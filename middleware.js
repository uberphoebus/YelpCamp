const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("this is my first middleware");
    next();
    console.log("this is my first middleware after calling next()");
});
app.use((req, res, next) => {
    console.log("this is my second middleware");
    return next();
});

app.get("/", (req, res) => {
    res.send("home page");
});

app.get("/dogs", (req, res) => {
    res.send("woof woof");
});

app.listen(3001, () => {
    console.log("server on port 3001");
});
