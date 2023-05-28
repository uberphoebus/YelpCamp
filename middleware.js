const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));
app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
});
// app.use((req, res, next) => {
//     console.log("this is my first middleware");
//     next();
//     console.log("this is my first middleware after calling next()");
// });
// app.use((req, res, next) => {
//     console.log("this is my second middleware");
//     return next();
// });
// app.use((req, res, next) => {
//     console.log("this is my third middleware");
//     return next();
// });

app.get("/", (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("home page");
});

app.get("/dogs", (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("woof woof");
});

app.listen(3001, () => {
    console.log("server on port 3001");
});
