import axios from "axios";
const apiUrl = "http://localhost:8080/api/articles";

export function getArticles() {
    return axios.get(apiUrl);
}

export function addArticle(article) {
    return axios.post(apiUrl, article);
}

export function updateArticle(id, article) {
    return axios.put(apiUrl + "/" + id, article);
}

export function deleteArticle(id) {
    return axios.delete(apiUrl + "/" + id);
}