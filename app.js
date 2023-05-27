const express = require("express");
const app = express();
const path = require("path");

// app config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const log_routes = (req, res, action = "") => {
    console.log(
        `[${"request".padEnd(7)}] ${req.method.padEnd(4)} ${req.url} ${action}`
    );
};

app.get("/", (req, res) => {
    log_routes(req, res);
    res.render("home");
});

app.listen(3000, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`);
});
