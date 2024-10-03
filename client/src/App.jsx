import "./App.css";
import { useState, useEffect } from "react";
import {
  addArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} from "./services/articleServices";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentBody, setCurrentBody] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await getArticles();

        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticles();
  }, []);

  const handleChangeTitle = (e) => {
    setCurrentTitle(e.currentTarget.value);
  };

  const handleChangeBody = (e) => {
    setCurrentBody(e.currentTarget.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const originalArticles = articles;

    try {
      const { data } = await addArticle({
        title: currentTitle,
        body: currentBody,
      });

      setArticles([...originalArticles, data]);
      setCurrentTitle("");
      setCurrentBody("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (currentTitle) => {
    const originalArticles = articles;

    try {
      const updatedArticles = [...originalArticles];
      const index = updatedArticles.findIndex(
        (article) => article._id === currentTitle
      );

      updatedArticles[index] = { ...updatedArticles[index] };
      updatedArticles[index].completed = !updatedArticles[index].completed;
      setArticles(updatedArticles);
      await updateArticle(currentTitle, {
        completed: updatedArticles[index].completed,
      });
    } catch (error) {
      setArticles(originalArticles);
      console.log(error);
    }
  };

  const handleEdit = (currentTitle) => {
    const originalArticles = articles;

    try {
      const updatedArticles = [...originalArticles];
      const index = updatedArticles.findIndex(
        (article) => article._id === currentTitle
      );

      updatedArticles[index] = { ...updatedArticles[index] };
      setCurrentTitle(updatedArticles[index].title);
      setCurrentBody(updatedArticles[index].body);
      setArticles(updatedArticles);
    } catch (error) {
      setArticles(originalArticles);
      console.log(error);
    }
  };

  const handleDelete = async (currentTitle) => {
    const originalArticles = articles;

    try {
      const updatedArticles = originalArticles.filter(
        (article) => article._id !== currentTitle
      );

      setArticles(updatedArticles);
      await deleteArticle(currentTitle);
    } catch (error) {
      setArticles(originalArticles);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="app_container">
          <h1 className="heading">Create Post</h1>
          <form
            onSubmit={handleSubmit}
            style={{ textAlign: "center", margin: "10px" }}
          >
            <input
              type="text"
              style={{ width: "100%" }}
              value={currentTitle}
              required={true}
              onChange={handleChangeTitle}
              placeholder="Create New Title"
            />
            <textarea
              rows="20"
              style={{ width: "100%" }}
              value={currentBody}
              onChange={handleChangeBody}
              placeholder="Create New Body"
            />
            <br />
            <input
              style={{ height: "40px", color: "red" }}
              type="reset"
              value="Clear"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you wish to clear this post? This cannot be undone."
                  )
                )
                  setCurrentTitle("");
                setCurrentBody("");
              }}
            />
            <input
              style={{ height: "40px" }}
              type="submit"
              value="Submit Post"
            />
          </form>
          <h1 className="heading">Posts</h1>
          <div>
            {articles.map((article) => (
              <div key={article._id} className="flex article_container">
                <input
                  type="checkbox"
                  checked={article.completed}
                  onChange={() => handleUpdate(article._id)}
                />
                <div className="article">
                  <div
                    style={{
                      paddingTop: "10px",
                      position: "relative",
                      top: "15px",
                    }}
                    className={article.completed ? "article_completed" : ""}
                  >
                    {article.title}
                  </div>
                  <br />
                  Submitted: {article.createdAt.slice(0, 10)}
                  <br />
                  <div style={{ paddingTop: "10px" }}>{article.body}</div>
                  <br />
                  <button
                    style={{ color: "blue" }}
                    onClick={() => handleEdit(article._id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you wish to delete this item? This cannot be undone."
                        )
                      )
                        handleDelete(article._id);
                    }}
                  >
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
};

export default App;
