/****************************************************************************************
***************** Component:  TimeHeader ************************************************
****************************************************************************************/
var TimeHeader = React.createClass({
    render: function () {
        var months = [];
        var monthClass = '';
        //console.log('Inside TimeHeader render...');
        //cosole.log(this.props.timeInfo);
        if (this.props.timeInfo.viewScope == 'y') {
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];      
            monthClass = "col-xs-30 monthCell";
        } else if (this.props.timeInfo.viewScope == 'q') {
            months = ['Jan', 'Feb', 'Mar'];      
            monthClass = "col-xs-120 monthCell";
        } else if (this.props.timeInfo.viewScope == 'm') {
            months = ['Jan'];      
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
                            <div className={monthClass}>
                                {monthName}
                            </div>
                        );
                    })}
                </div>
                <i className="fa fa-chevron-circle-left left"></i>
                <i className="fa fa-chevron-circle-right right"></i>
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
    render: function () {        
        return (
            <div className="col-xs-360 marginTop15">
                <div className="col-xs-30">
                    <select className="form-control" onChange={this.viewStateChanged}>
                        <option value="y">Year</option>
                        <option value="q">Quarter</option>
                        <option value="m">Month</option>
                    </select>
                </div>
                <div className="col-xs-30">
                    <button id="addNewTask" onClick={this.addNewTask}>Add New Task</button>
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
        
        return ({timeInfo: timeInfo});
    },
    viewChanged: function (viewScope) {
        var timeInfo = this.state.timeInfo;
        timeInfo.viewScope = viewScope;
        console.log('setting the TaskMan state timeInfo='); console.log(timeInfo);
        this.setState({timeInfo: timeInfo});
    },
    render: function () {
        return (
            <div>
                <ToolsGroup viewChanged={this.viewChanged}/>
                <TimeHeader timeInfo={this.state.timeInfo}/>
                <TaskContainer />
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////











 
//ReactDOM.render(<TaskInnerContainer taskData={taskData}/>, document.getElementById('taskContainer'));
ReactDOM.render(
    <TaskMan />, 
    document.getElementById('reactContainer')
);

