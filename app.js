const express = require("express");
const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const { log } = require("console");

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
app.use(express.urlencoded({ extended: true }));

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

app.get("/campgrounds", async (req, res) => {
    logRoutes(req, res);
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    logRoutes(req, res);
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    logRoutes(req, res, `posted ${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
    logRoutes(req, res);
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

// app listen
app.listen(3000, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`);
});
