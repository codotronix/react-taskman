//var MyComponent = React.createClass({
//    render: function () {
//        return (
//            <div>
//                Hi, I am a Component... and I'm created by {this.props.createdBy}
//            </div>
//        );
//    }
//});
//ReactDOM.render(<MyComponent createdBy="Barick"/>, document.getElementById('container'));

var TimeHeader = React.createClass({
    render: function () {
        var months = [];
        var monthClass = '';
        if (this.props.subheader == 'y') {
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];      
            monthClass = "col-xs-30 monthCell";
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
            var taskColor = "rgb(" + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')';
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
 
//ReactDOM.render(<TaskInnerContainer taskData={taskData}/>, document.getElementById('taskContainer'));
ReactDOM.render(
    <div>
        <TimeHeader year="2016" subheader="y"/>
        <TaskContainer />
    </div>, 
    document.getElementById('reactContainer'));

