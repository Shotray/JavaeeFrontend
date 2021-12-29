import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8081/",
    // baseURL: "http://81.69.225.235:8081/",
    withCredentials: true,
    timeout: 7000,
    responseType: "json/text",
    contentType: "application/json; charset=utf-8",
})