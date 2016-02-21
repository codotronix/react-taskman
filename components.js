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
        var duration = this.props.task.end - this.props.task.start;
        var classes = "taskCell col-xs-offset-" + this.props.task.start + " col-xs-" + duration;
        return classes;
    },
    render: function () {
        return (
            <div className="row taskRow">
                <div className={this.getCellClass()} style={{background: this.props.task.bgColor}}>
                    {this.props.task.name}
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
    render: function () {
        var that = this;
        return (
            <div className="col-xs-360">                
                {this.state.taskData.map(function(task){
                    return (
                        <Task task={task} key={task.id}/>
                    );
                })}
                <div className="text-center">
                    <button onClick={this.addNewTask} id="btnLoadMoreTasks" className="btn btn-primary marginTop15">Load More Tasks</button>
                </div>
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
        var timeInfo = {
            viewScope: "y",
            year: 2016,
            quarter: 1,
            month: 2
        };
        
        var myDB = new Firebase('https://codotronix-taskman.firebaseio.com/reactTasks/');
        
        return ({timeInfo: timeInfo, myDB: myDB});
    },
    viewChanged: function (viewScope) {
        var timeInfo = this.state.timeInfo;
        timeInfo.viewScope = viewScope;
        console.log('setting the TaskMan state timeInfo='); console.log(timeInfo);
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

