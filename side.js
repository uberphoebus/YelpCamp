const express = require("express");
const app = express();
const morgan = require("morgan");
const colors = require("colors");
const AppError = require("./AppError");

app.use(morgan("dev"));
app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
});
app.use("/dogs", (req, res, next) => {
    console.log("I love dogs");
    next();
});
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === "chickennugget") {
        next();
    }
    throw new AppError("password required", 401);
};

app.get("/", (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("home page");
});

app.get("/error", (req, res) => {
    chicken.fly();
});

app.get("/dogs", (req, res) => {
    console.log(`request date: ${req.requestTime}`);
    res.send("woof woof");
});

app.get("/secret", verifyPassword, (req, res) => {
    res.send("my secret is");
});

app.get("/admin", (req, res) => {
    throw new AppError("you are not an admin", 403);
});

app.use((req, res) => {
    res.status(404).send("NOT FOUND!");
});

// app.use((err, req, res, next) => {
//     console.log("***********************************");
//     console.log("**************ERROR****************");
//     console.log("***********************************");
//     // res.status(500).send("we got error");
//     next(err);
// });

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong" } = err;
    res.status(status).send(message);
});

app.listen(3001, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`.brightCyan);
});
