const express = require("express");
const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

// database config
env.config();
mongoose.connect(process.env.URI, {
    dbName: "yelp-camp",
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on(
    "error",
    console.error.bind(console, `[${"mongo".padEnd(7)}] connection error`)
);
db.once("open", () => {
    console.log(`[${"mongo".padEnd(7)}] database connected`);
});

// app config
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// functions
const logRoutes = (req, res, action = "") => {
    console.log(
        `[${"request".padEnd(7)}] ${req.method.padEnd(4)} ${req.url} ${action}`
    );
};

// routes
app.get("/", (req, res) => {
    logRoutes(req, res);
    res.render("home");
});

app.get("/makecampground", async (req, res) => {
    logRoutes(req, res);
    const camp = new Campground({
        title: "My Backyard",
        description: "cheap camping",
    });
    await camp.save();
    logRoutes(req, res, `created ${camp.title}`);
    res.send(camp);
});

// app listen
app.listen(3000, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`);
});
