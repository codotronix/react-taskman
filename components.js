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
        return ({taskData: []});
    },
    addNewTask: function () {
        //var tasks = this.state.taskData;
        
        //Let's create and Add 5 more tasks...
//        for(var i=0; i<5; i++) {        
//            var newId = (new Date()).getTime() * Math.random();
//            var taskName = "Task_" + Math.round(Math.random()*999999);
//            var taskColor = "rgb(" + Math.floor(Math.random()*155 + 100) + ', ' + Math.floor(Math.random()*155 + 100) + ', ' + Math.floor(Math.random()*155 + 100) + ')';
//            var startDate = Math.floor(Math.random()*180);
//            var endDate = Math.floor(Math.random()*180) + 180;
//
//            var newObj = {
//                id: newId,
//                name: taskName,
//                start: startDate,
//                end: endDate,
//                bgColor: taskColor
//            }
//            tasks.push(newObj);
//        }
//        this.setState({taskData: tasks});
        var that = this;
        $.get("/react-taskman/php/getTask.php", function(result){
            //console.log(JSON.parse(result));
            var tasks = JSON.parse(result);
            //console.log(tasks);
            that.setState({taskData: tasks});
            //console.log(that.state);
        }, "json");
        
        setTimeout(function(){
            document.getElementById('btnLoadMoreTasks').scrollIntoView();
        }, 100);
        
    },
    render: function () {
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
    addNewTask: function () {
        //let's make a new dummy task
        var newId = (new Date()).getTime() * Math.random();
        var taskName = "Task_" + Math.round(Math.random()*999999);
        var taskColor = "rgb(" + Math.floor(Math.random()*155 + 100) + ', ' + Math.floor(Math.random()*155 + 100) + ', ' + Math.floor(Math.random()*155 + 100) + ')';
        var startDate = Math.floor(Math.random()*180);
        var endDate = Math.floor(Math.random()*180) + 180;

        var newObj = {
            id: newId,
            name: taskName,
            start: startDate,
            end: endDate,
            bgColor: taskColor
        }
        
        $.post("/react-taskman/php/saveTask.php", {task: newObj}, function(result){
            console.log(result);
        });
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
        
        var showAddNewTaskModal = false;
        
        return ({timeInfo: timeInfo, showAddNewTaskModal: showAddNewTaskModal});
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
        console.log(e.target);
    },
    render: function () {
        return (
            <div>
                <ToolsGroup viewChanged={this.viewChanged} />
                <TimeHeader timeInfo={this.state.timeInfo} viewPrev={this.viewPrev} viewNext={this.viewNext} />
                <TaskContainer />
                <Modal_AddNewTask saveNewTask={this.saveNewTask}/>               
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////




var Modal_AddNewTask = React.createClass({
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
                                <input type="text" className="form-control" id="taskName"/>
                            </div>
                        </section>
                        <section className="clearfix marginTop15">
                            <label className="col-xs-90">Start Date</label>
                            <div className="col-xs-250 col-xs-offset-20">
                                <input type="text" className="form-control" id="taskStartDate"/>
                            </div>
                        </section>
                    </div>
                    <div className="col-xs-360 col-md-180">
                        <section className="clearfix">
                            <label className="col-xs-90 col-xs-offset-20">Owner</label>
                            <div className="col-xs-250">
                                <input type="text" className="form-control" id="taskOwner"/>
                            </div>
                        </section>
                        <section className="clearfix marginTop15">
                            <label className="col-xs-90 col-xs-offset-20">End Date</label>
                            <div className="col-xs-250">
                                <input type="text" className="form-control" id="taskEndDate"/>
                            </div>
                        </section>
                    </div>
                    <div className="col-xs-360 clearfix marginTop15">
                        <label className="col-xs-56">Description</label>
                        <div className="col-xs-304">
                            <textarea className="form-control" id="taskDesc"/>
                        </div>
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

