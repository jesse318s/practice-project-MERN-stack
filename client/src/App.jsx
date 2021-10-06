import "./App.css";
import { Paper, TextField } from "@material-ui/core";
import { Checkbox, Button } from "@material-ui/core";
import { Component } from "react";
import {
    addArticle,
    getArticles,
    updateArticle,
    deleteArticle,
} from "./services/articleServices";

//component
class App extends Component {
    //variables

    //sets state
    state = { articles: [], currentArticle: "", currentBody: "" };

    //functions

    //retrieves articles on load
    async componentDidMount() {
        try {
            const { data } = await getArticles();
            this.setState({ articles: data });
        } catch (error) {
            console.log(error);
        }
    }

    //handles create new article input change
    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentArticle: input.value });
    };

    handleChangeBody = ({ currentTarget: input }) => {
        this.setState({ currentBody: input.value });
    };

    //handles add article
    handleSubmit = async (e) => {
        e.preventDefault();
        const originalArticles = this.state.articles;
        try {
            const { data } = await addArticle({ article: this.state.currentArticle, body: this.state.currentBody });
            const articles = originalArticles;
            articles.push(data);
            this.setState({ articles, currentArticle: "", currentBody: "" });
        } catch (error) {
            console.log(error);
        }
    };

    //handles check/uncheck article
    handleUpdate = async (currentArticle) => {
        const originalArticles = this.state.articles;
        try {
            const articles = [...originalArticles];
            const index = articles.findIndex((article) => article._id === currentArticle);
            articles[index] = { ...articles[index] };
            articles[index].completed = !articles[index].completed;
            this.setState({ articles });
            await updateArticle(currentArticle, {
                completed: articles[index].completed,
            });
        } catch (error) {
            this.setState({ articles: originalArticles });
            console.log(error);
        }
    };

    //handles delete article
    handleDelete = async (currentArticle) => {
        const originalArticles = this.state.articles;
        try {
            const articles = originalArticles.filter(
                (article) => article._id !== currentArticle
            );
            this.setState({ articles });
            await deleteArticle(currentArticle);
        } catch (error) {
            this.setState({ articles: originalArticles });
            console.log(error);
        }
    };

    render() {
        //constants

        //declares articles
        const { articles } = this.state;

        // render component
        return (
            <>
                {/* articles app */}
                <div className="App flex">
                    <Paper elevation={3} className="container">
                        <h1 className="heading">Posts</h1>
                        {/* new article form */}
                        <form
                            onSubmit={this.handleSubmit}
                            className="flex"
                            style={{ margin: "15px 0" }}
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                style={{ width: "80%" }}
                                value={this.state.currentArticle}
                                required={true}
                                onChange={this.handleChange}
                                placeholder="Create New Title"
                            />
                            <TextField
                                name="body"
                                variant="outlined"
                                size="small"
                                style={{ width: "80%" }}
                                value={this.state.currentBody}
                                required={true}
                                onChange={this.handleChangeBody}
                                placeholder="Create New Body"
                            />
                            <Button
                                style={{ height: "40px" }}
                                variant="outlined"
                                type="submit"
                            >
                                <p>Add post</p>
                            </Button>
                        </form>
                        {/* displays stored articles */}
                        <div>
                            {articles.map((article) => (
                                <Paper
                                    key={article._id}
                                    className="flex article_container"
                                >
                                    <Checkbox
                                        checked={article.completed}
                                        onClick={() => this.handleUpdate(article._id)}
                                        style={{ color: "green" }}
                                    />
                                    <div
                                        className={
                                            article.completed
                                                ? "article line_through"
                                                : "article"
                                        }
                                    >
                                        {article.article}<br />
                                        {article.createdAt}<br />
                                        {article.body}
                                    </div>
                                    <Button
                                        onClick={() => this.handleDelete(article._id)}
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
