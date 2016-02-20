/****************************************************************************************
***************** Component:  TimeHeader ************************************************
****************************************************************************************/
var TimeHeader = React.createClass({
    render: function () {
        var months = [];
        var monthClass = '';
        if (this.props.subHeader == 'y') {
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];      
            monthClass = "col-xs-30 monthCell";
        } else if (this.props.subHeader == 'q') {
            months = ['Jan', 'Feb', 'Mar'];      
            monthClass = "col-xs-120 monthCell";
        } else if (this.props.subHeader == 'm') {
            months = ['Jan'];      
            monthClass = "col-xs-360 monthCell";
        }
        
        return (
            <div className="row">
                <div className="yearHeader">
                    {this.props.year}
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
        var tasks = this.state.taskData;
        
        //Let's create and Add 5 more tasks...
        for(var i=0; i<5; i++) {        
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
            tasks.push(newObj);
        }
        this.setState({taskData: tasks});
        
        setTimeout(function(){
            document.getElementById('btnLoadMoreTasks').scrollIntoView();
        }, 100);
        
    },
    render: function () {
        return (
            <div>                
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
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////










/****************************************************************************************
* Component:  TaskMan                                                                   *
* Summary: It is the highest level component.
* State Objects: 1. TimeInfo 
                    {
                        viewScope: "y", //can be y, q, m
                        year: 2016,
                        quaeter: 1,
                        month: 2                        
                    }
****************************************************************************************/
var TaskMan = React.createClass({
    getInitialState: function () {
        var year = this.props.year;
        var subHeader = this.props.subHeader;
        return ({year: year, subHeader:subHeader});
    },
    viewChanged: function (subHeader) {
        console.log('setting the TaskMan state subHeader=' + subHeader);
        this.setState({subHeader: subHeader});
    },
    render: function () {
        return (
            <div>
                <ToolsGroup viewChanged={this.viewChanged}/>
                <TimeHeader  year={this.state.year} subHeader={this.state.subHeader}/>
                <TaskContainer />
            </div>
        );
    }
});
/////////////////////////////////////////////////////////////////////////////////////////











 
//ReactDOM.render(<TaskInnerContainer taskData={taskData}/>, document.getElementById('taskContainer'));
ReactDOM.render(
    <TaskMan year="2016" subHeader="y"/>, 
    document.getElementById('reactContainer')
);

