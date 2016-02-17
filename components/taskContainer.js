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
                    <button onClick={this.addNewTask} id="btnLoadMoreTasks" className="btn btn-primary">Load More Tasks</button>
                </div>
            </div>
        );
    }
});