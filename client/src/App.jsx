import "./App.css";
import { Paper, TextField } from "@material-ui/core";
import { Checkbox, Button } from "@material-ui/core";
import { Component } from "react";
import {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
} from "./services/taskServices";

//component
class App extends Component {
    //variables

    //sets state
    state = { tasks: [], currentTask: "" };

    //functions

    //retrieves tasks on load
    async componentDidMount() {
        try {
            const { data } = await getTasks();
            this.setState({ tasks: data });
        } catch (error) {
            console.log(error);
        }
    }

    //handles create new task input change
    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    //handles add task
    handleSubmit = async (e) => {
        e.preventDefault();
        const originalTasks = this.state.tasks;
        try {
            const { data } = await addTask({ task: this.state.currentTask });
            const tasks = originalTasks;
            tasks.push(data);
            this.setState({ tasks, currentTask: "" });
        } catch (error) {
            console.log(error);
        }
    };

    //handles check/uncheck task
    handleUpdate = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = [...originalTasks];
            const index = tasks.findIndex((task) => task._id === currentTask);
            tasks[index] = { ...tasks[index] };
            tasks[index].completed = !tasks[index].completed;
            this.setState({ tasks });
            await updateTask(currentTask, {
                completed: tasks[index].completed,
            });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    //handles delete task
    handleDelete = async (currentTask) => {
        const originalTasks = this.state.tasks;
        try {
            const tasks = originalTasks.filter(
                (task) => task._id !== currentTask
            );
            this.setState({ tasks });
            await deleteTask(currentTask);
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.log(error);
        }
    };

    render() {
        //constants

        //declares tasks
        const { tasks } = this.state;

        // render component
        return (
            <>
                {/* tasks app */}
                <div className="App flex">
                    <Paper elevation={3} className="container">
                        <h1 className="heading">Tasks</h1>
                        {/* new task form */}
                        <form
                            onSubmit={this.handleSubmit}
                            className="flex"
                            style={{ margin: "15px 0" }}
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                style={{ width: "80%" }}
                                value={this.state.currentTask}
                                required={true}
                                onChange={this.handleChange}
                                placeholder="Create New Task"
                            />
                            <Button
                                style={{ height: "40px"}}
                                variant="outlined"
                                type="submit"
                            >
                                <p>Add Task</p>
                            </Button>
                        </form>
                        {/* displays stored tasks */}
                        <div>
                            {tasks.map((task) => (
                                <Paper
                                    key={task._id}
                                    className="flex task_container"
                                >
                                    <Checkbox
                                        checked={task.completed}
                                        onClick={() => this.handleUpdate(task._id)}
                                        style={{ color: "green" }}
                                    />
                                    <div
                                        className={
                                            task.completed
                                                ? "task line_through"
                                                : "task"
                                        }
                                    >
                                        {task.task}
                                    </div>
                                    <Button
                                        onClick={() => this.handleDelete(task._id)}
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Delete
                                    </Button>
                                </Paper>
                            ))}
                        </div>
                    </Paper>
                </div>
            </>
        );
    }
}

export default App;
