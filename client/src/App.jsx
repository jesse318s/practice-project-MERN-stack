import "./App.css";
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
    state = { articles: [], currentTitle: "", currentBody: "" };

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

    //handles new article form input change
    handleChangeTitle = ({ currentTarget: input }) => {
        this.setState({ currentTitle: input.value });
    };

    handleChangeBody = ({ currentTarget: input }) => {
        this.setState({ currentBody: input.value });
    };

    //handles add article
    handleSubmit = async (e) => {
        e.preventDefault();
        const originalArticles = this.state.articles;
        try {
            const { data } = await addArticle({ title: this.state.currentTitle, body: this.state.currentBody });
            const articles = originalArticles;
            articles.push(data);
            this.setState({ articles, currentTitle: "", currentBody: "" });
        } catch (error) {
            console.log(error);
        }
    };

    //handles check/uncheck article
    handleUpdate = async (currentTitle) => {
        const originalArticles = this.state.articles;
        try {
            const articles = [...originalArticles];
            const index = articles.findIndex((article) => article._id === currentTitle);
            articles[index] = { ...articles[index] };
            articles[index].completed = !articles[index].completed;
            this.setState({ articles });
            await updateArticle(currentTitle, {
                completed: articles[index].completed,
            });
        } catch (error) {
            this.setState({ articles: originalArticles });
            console.log(error);
        }
    };

    //handles edit article
    handleEdit = async (currentTitle) => {
        const originalArticles = this.state.articles;
        try {
            const articles = [...originalArticles];
            const index = articles.findIndex((article) => article._id === currentTitle);
            articles[index] = { ...articles[index] };
            this.state.currentTitle = articles[index].title;
            this.state.currentBody = articles[index].body;
            this.setState({ articles });
        } catch (error) {
            this.setState({ articles: originalArticles });
            console.log(error);
        }
    };

    //handles delete article
    handleDelete = async (currentTitle) => {
        const originalArticles = this.state.articles;
        try {
            const articles = originalArticles.filter(
                (article) => article._id !== currentTitle
            );
            this.setState({ articles });
            await deleteArticle(currentTitle);
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
                <div className="flex">
                    <div className="app_container">
                        <h1 className="heading">Create Post</h1>
                        {/* new article form */}
                        <form
                            onSubmit={this.handleSubmit}
                            style={{ margin: "15px 0" }}
                        >
                            <input
                                type="text"
                                style={{ width: "80%" }}
                                value={this.state.currentTitle}
                                required={true}
                                onChange={this.handleChangeTitle}
                                placeholder="Create New Title"
                            />
                            <textarea
                                rows="20"
                                style={{ width: "80%" }}
                                value={this.state.currentBody}
                                onChange={this.handleChangeBody}
                                placeholder="Create New Body"
                            /><br />
                            <input
                                style={{ height: "40px" }}
                                type="submit"
                                value="Submit Post"
                            />
                        </form>
                        {/* displays stored articles */}
                        <h1 className="heading">Posts</h1>
                        <div>
                            {articles.map((article) => (
                                <div
                                    key={article._id}
                                    className="flex article_container"
                                >
                                    <input
                                        type="checkbox"
                                        checked={article.completed}
                                        onChange={() => this.handleUpdate(article._id)}
                                    />
                                    <div className="article">
                                        <div
                                            style={{
                                                paddingTop: "10px",
                                                position: "relative",
                                                top: "15px"
                                            }}
                                            className={
                                                article.completed
                                                    ? "article_completed"
                                                    : ""
                                            }
                                        >
                                            {article.title}</div><br />
                                        Submitted: {article.createdAt.slice(0, 10)}<br />
                                        <div style={{ paddingTop: "10px" }}>{article.body}</div><br />
                                        <button style={{ color: "blue" }} onClick={() => this.handleEdit(article._id)}>
                                            Edit
                                        </button>
                                        <button style={{ color: "red" }} onClick={() => this.handleDelete(article._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default App;