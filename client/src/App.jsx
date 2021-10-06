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
    handleChange = ({ currentTarget: input }) => {
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
            const { data } = await addArticle({ article: this.state.currentTitle, body: this.state.currentBody });
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
                <div className="App flex">
                    <div className="container">
                        <h1 className="heading">Posts</h1>
                        {/* new article form */}
                        <form
                            onSubmit={this.handleSubmit}
                            style={{ margin: "15px 0" }}
                        >
                            <input
                                style={{ width: "100%" }}
                                value={this.state.currentTitle}
                                required={true}
                                onChange={this.handleChange}
                                placeholder="Create New Title"
                            />
                            <textarea
                                style={{ width: "100%" }}
                                value={this.state.currentBody}
                                required={true}
                                onChange={this.handleChangeBody}
                                placeholder="Create New Body"
                                type="text"
                                rows="30" /><br />
                            <input
                                style={{ height: "40px" }}
                                type="submit"
                                value="Add Post"
                            />
                        </form>
                        {/* displays stored articles */}
                        <div>
                            {articles.map((article) => (
                                <div
                                    key={article._id}
                                    className="flex article_container"
                                >
                                    <input
                                        type="checkbox"
                                        checked={article.completed}
                                        onClick={() => this.handleUpdate(article._id)}
                                        style={{ color: "green" }}
                                    />
                                    <div className="article">
                                        <div
                                            className={
                                                article.completed
                                                    ? "line_through"
                                                    : ""
                                            }>{article.article}
                                        </div><br />
                                        {article.createdAt}<br />
                                        {article.body}
                                    </div>
                                    <button
                                        onClick={() => this.handleDelete(article._id)}
                                    >
                                        Delete
                                    </button>
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
