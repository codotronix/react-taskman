/****************************************************************************************
***************** Component:  TimeHeader ************************************************
****************************************************************************************/
var TimeHeader = React.createClass({
    c: {
        allMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        allQuarters: [['Jan', 'Feb', 'Mar'], ['Apr', 'May', 'Jun'], ['Jul', 'Aug', 'Sep'], ['Oct', 'Nov', 'Dec']]
    },
    render: function () {
        
        var months = [];
        var monthClass = '';
        var timeInfo = this.props.timeInfo;
        //console.log('Inside TimeHeader render...');
        //cosole.log(this.props.timeInfo);
        if (timeInfo.viewScope == 'y') {
            months = this.c.allMonths;
            monthClass = "col-xs-30 monthCell";
        } else if (timeInfo.viewScope == 'q') {
            var q = timeInfo.quarter;
            months = this.c.allQuarters[q-1];      
            monthClass = "col-xs-120 monthCell";
        } else if (timeInfo.viewScope == 'm') {
            months = [this.c.allMonths[timeInfo.month-1]];      
            monthClass = "col-xs-360 monthCell";
        }
        
        return (
            <div className="col-xs-360 timeHeader">
                <div className="yearHeader">
                    {this.props.timeInfo.year}
                </div>
                <div className="monthsHeader">
                    {months.map(function(monthName){
                        return (
                            <div className={monthClass} key={monthName}>
                                {monthName}
                            </div>
                        );
                    })}
                </div>
                <i className="fa fa-chevron-circle-left left" onClick={this.props.viewPrev}></i>
                <i className="fa fa-chevron-circle-right right" onClick={this.props.viewNext}></i>
            </div>
        );
    }

});
/////////////////////////////////////////////////////////////////////////////////////////



/****************************************************************************************
************************ Component:  Task ***********************************************
****************************************************************************************/
var Task = React.createClass({
    getCellClass: function () {        
        var classes = 'taskCell col-xs-offset-' + this.props.task.startOffset + ' col-xs-' + (this.props.task.endOffset - this.props.task.startOffset);
        return classes;
    },
    render: function () {
        return (
            <div className="row taskRow">
                <div className={this.getCellClass()} style={{background: this.props.task.bgColor}}>
                    <b>{this.props.task.name}</b><br/>
                    [ {this.props.task.startDate} - {this.props.task.endDate} ]
                </div>                
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////



/****************************************************************************************
***************** Component:  TaskContainer *********************************************
****************************************************************************************/
var TaskContainer = React.createClass({
    getInitialState: function () {
        var that = this;        
        this.props.myDB.on('child_added', function(snapshot) {            
            var task = snapshot.val();
            var tasks = that.state.taskData;
            tasks.push(task);
            that.setState({taskData: tasks});
        });
        return ({taskData: []});
    },
    removeUnelligibleTasks: function (tasks) {
        var elligibleTasks = [];
        var timeInfo = this.props.timeInfo;
        for (var i in tasks) {
            if ((new Date(tasks[i].endDate)) < timeInfo.startDate || (new Date(tasks[i].startDate)) > timeInfo.endDate) {
                //This task is not eliigible to be shown in current timescope
            } else {
                 elligibleTasks.push(tasks[i]);                     
            }
        }
        console.log('elligibleTasks=');console.log(elligibleTasks)
        return elligibleTasks;
    },
    getOffsetForDate: function(date){
        var timeInfo = this.props.timeInfo;
        var offset = 0;
        if (date <= timeInfo.startDate) {
            offset = 0;
        } else {
            var month = date.split('/')[1];
            var day = date.split('/')[2];

            if (timeInfo.viewScope == 'y') {
                offset = Math.floor((month-1) * 30 + day * (360/365));
            } 
            else if (timeInfo.viewScope == 'q') {
                var qStartMonth = (timeInfo.quarter - 1)*3 + 1;                    
                offset = Math.floor((month - qStartMonth) * 120 + (day * (360/365) * 4));
            } 
            else if (timeInfo.viewScope == 'm') {
                offset = Math.floor(day * (360/365) * 12);
            }                                        
        }        
        return offset;
    },
    render: function () {
        //var that = this;
        var tasks = this.removeUnelligibleTasks(this.state.taskData);        
        for (var i in tasks) {
            tasks[i].startOffset = this.getOffsetForDate(tasks[i].startDate);
            tasks[i].endOffset = this.getOffsetForDate(tasks[i].endDate);
        }        
        return (
            <div className="col-xs-360">                
                {tasks.map(function(task){
                    return (
                        <Task task={task} key={task.id}/>
                    );
                })}                
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////


/****************************************************************************************
*********************** Component:  ToolsGroup *********************************************
****************************************************************************************/
var ToolsGroup = React.createClass({
    viewStateChanged: function (e) {
        //console.log(e.target.value);
        this.props.viewChanged(e.target.value);
    },    
    showAddNewTaskModal: function () {
        $('#modal_AddNewTask').modal('show');
    },
    render: function () {        
        return (
            <div className="col-xs-360 toolsGroup">
                <div className="col-xs-20">
                    <i className="fa fa-plus" title="Add New Task" onClick={this.showAddNewTaskModal}></i>
                </div>
                <div className="col-xs-30">
                    <select className="form-control" onChange={this.viewStateChanged}>
                        <option value="y">Year</option>
                        <option value="q">Quarter</option>
                        <option value="m">Month</option>
                    </select>
                </div>
                
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////



/****************************************************************************************
* Component: TaskMan                
*
* Summary: It is the highest level component.

* State Objects: 1. TimeInfo 
                    {
                        viewScope: "y", //can be y, q, m
                        year: 2016,
                        quarter: 1,
                        month: 2                        
                    }
                    
* Methods: 1. viewChanged -> this function will be send as prop to ToolsGroup, so that
                            selectView dropdown can use it to change the state var 
                            timeInfo
****************************************************************************************/
var TaskMan = React.createClass({
    getInitialState: function () {
        var timeInfo = {};
        timeInfo.viewScope = "y";
        timeInfo.year = (new Date()).getFullYear();
        timeInfo.quarter = 1;
        timeInfo.month = 2;
        timeInfo.startDate = new Date(timeInfo.year + '/1/1');
        timeInfo.endDate = new Date(timeInfo.year + '/12/31');
        
        //console.log(timeInfo);
        
        var myDB = new Firebase('https://codotronix-taskman.firebaseio.com/reactTasks/');
        
        return ({timeInfo: timeInfo, myDB: myDB});
    },
    updateCurrentStartEndDate: function (timeInfo) {
        if (timeInfo.viewScope == "y") {
            timeInfo.startDate = new Date(timeInfo.year + '/1/1');
            timeInfo.endDate   = new Date(timeInfo.year + '/12/31');
        } else if (timeInfo.viewScope == "q") {
            var qStart = ['useless 0th location', '/01/01', '/04/01', '/07/01', '/10/01'];
            var qEnd = ['useless 0th location', '/03/31', '/06/30', '/09/30', '/12/31'];
            
            timeInfo.startDate = new Date(timeInfo.year + qStart[timeInfo.quarter]);
            timeInfo.endDate   = new Date(timeInfo.year + qEnd[timeInfo.quarter]);            
        } else if (timeInfo.viewScope == "m") {
            var daysInMonth = ['useless 0th location',31,28,31,30,31,30,31,31,30,31,30,31];
            
            //Feb 29 for Leap Year
            if((timeInfo.year%400 == 0) || ((timeInfo.year%100 != 0) && (timeInfo.year%4 == 0))) {
                daysInMonth = ['useless 0th location',31,29,31,30,31,30,31,31,30,31,30,31];
            }
            
            timeInfo.startDate = new Date(timeInfo.year + '/' + timeInfo.month + '/1');
            timeInfo.endDate   = new Date(timeInfo.year + '/' + timeInfo.month + '/' + daysInMonth[timeInfo.month]);
        }
        
        console.log(timeInfo);
        return (timeInfo);
    },
    viewChanged: function (viewScope) {
        var timeInfo = this.state.timeInfo;
        timeInfo.viewScope = viewScope;
        //console.log('setting the TaskMan state timeInfo='); console.log(timeInfo);
        timeInfo = this.updateCurrentStartEndDate(timeInfo);
        this.setState({timeInfo: timeInfo});
    },
    viewPrev: function () {
        var timeInfo = this.state.timeInfo;
        
        if (timeInfo.viewScope == 'y') {
            timeInfo.year--;
        } else if (timeInfo.viewScope == 'q') {
            if (timeInfo.quarter == 1) {
                timeInfo.year--;
                timeInfo.quarter = 4;
            } else {
                timeInfo.quarter--;
            }
        } else if (timeInfo.viewScope == 'm') {
            if (timeInfo.month == 1) {
                timeInfo.year--;
                timeInfo.month = 12;
            } else {
                timeInfo.month--;
            }
        }
        timeInfo = this.updateCurrentStartEndDate(timeInfo);
        this.setState({timeInfo: timeInfo});
    },
    viewNext: function () {
        var timeInfo = this.state.timeInfo;
        
        if (timeInfo.viewScope == 'y') {
            timeInfo.year++;
        } else if (timeInfo.viewScope == 'q') {
            if (timeInfo.quarter == 4) {
                timeInfo.year++;
                timeInfo.quarter = 1;
            } else {
                timeInfo.quarter++;
            }
        } else if (timeInfo.viewScope == 'm') {
            if (timeInfo.month == 12) {
                timeInfo.year++;
                timeInfo.month = 1;
            } else {
                timeInfo.month++;
            }
        }
        timeInfo = this.updateCurrentStartEndDate(timeInfo);
        this.setState({timeInfo: timeInfo});
    },
    saveNewTask: function (e) {
        //console.log(e.target);
        var newTask = {};
        var taskCreationSuccessful = true;
        $('#modal_AddNewTask .field').each(function(){
            var val = $(this).val().trim();
            if (val.length <= 0) {
                console.log($(this).attr('data-id') + ' is empty... fill it...');
                taskCreationSuccessful = false;
                return;
            } else {
                newTask[$(this).attr('data-id')] = val;
            }
        });
        
        if((new Date(newTask.endDate)) <= (new Date(newTask.startDate))) {
            console.log('Start Date must be atleast 1 day greater than End Date...');
            taskCreationSuccessful = false;
            return;
        }
        
        if (taskCreationSuccessful) {
            newTask.bgColor = $('#bgColor').css('background-color');
            newTask.id = (new Date()).getTime() * Math.random();
            this.state.myDB.push(newTask);
        }
        
        $('#modal_AddNewTask').modal('hide');
    },
    render: function () {
        return (
            <div>
                <ToolsGroup viewChanged={this.viewChanged} />
                <TimeHeader timeInfo={this.state.timeInfo} viewPrev={this.viewPrev} viewNext={this.viewNext} />
                <TaskContainer myDB={this.state.myDB} timeInfo={this.state.timeInfo}/>
                <Modal_AddNewTask saveNewTask={this.saveNewTask}/>             
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////




var Modal_AddNewTask = React.createClass({
    getInitialState: function () {
        return ({color: "rgb(234, 215, 245)"});
    },
    componentDidMount: function () {
        $('.datepicker').datepicker({
            format: "yyyy/mm/dd",
            autoclose: true
        });
    },
    generateRandomColor: function () {
        var taskColor = "rgb(" + Math.floor(Math.random()*155 + 100) + ', ' +      Math.floor(Math.random()*155 + 100) + ', ' + Math.floor(Math.random()*155 + 100) + ')';
        
        this.setState({color: taskColor});
    },
    render: function () {
        return (
            <div className="modal fade" tabIndex="-1" id="modal_AddNewTask">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Add New Task</h4>
                  </div>
                  <div className="modal-body">
                    <div className="col-xs-360 col-md-180">
                        <section className="clearfix">
                            <label className="col-xs-90">Name</label>
                            <div className="col-xs-250 col-xs-offset-20">
                                <input type="text" className="form-control field" data-id="name" placeholder="Enter a name for this task..."/>
                            </div>
                        </section>
                        <section className="clearfix marginTop15">
                            <label className="col-xs-90">Start Date</label>
                            <div className="col-xs-250 col-xs-offset-20">
                                <input type="text" className="form-control field datepicker" data-id="startDate"/>
                            </div>
                        </section>
                    </div>
                    <div className="col-xs-360 col-md-180">
                        <section className="clearfix">
                            <label className="col-xs-90 col-xs-offset-20">Owner</label>
                            <div className="col-xs-250">
                                <input type="text" className="form-control field" data-id="owner"/>
                            </div>
                        </section>
                        <section className="clearfix marginTop15">
                            <label className="col-xs-90 col-xs-offset-20">End Date</label>
                            <div className="col-xs-250">
                                <input type="text" className="form-control field datepicker" data-id="endDate"/>
                            </div>
                        </section>
                    </div>
                    <div className="col-xs-360 clearfix marginTop15">
                        <label className="col-xs-56">Description</label>
                        <div className="col-xs-304">
                            <textarea className="form-control field" data-id="desc"/>
                        </div>
                    </div>
            
                    <div className="col-xs-360 clearfix marginTop15 form-control text-center" style={{background: this.state.color}} onClick={this.generateRandomColor} id="bgColor">
                        Click here to generate a random color for this task
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={this.props.saveNewTask}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

 
//ReactDOM.render(<TaskInnerContainer taskData={taskData}/>, document.getElementById('taskContainer'));
ReactDOM.render(
    <TaskMan />, 
    document.getElementById('reactContainer')
);

