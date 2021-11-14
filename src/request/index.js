import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8081/",
    withCredentials: true,
    timeout: 7000,
    responseType: "json",
    contentType: "application/json; charset=utf-8",
})