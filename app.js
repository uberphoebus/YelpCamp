const express = require("express");
const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const colors = require("colors");
const methodOverride = require("method-override");
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
    console.error.bind(
        console,
        `[${"mongo".padEnd(7)}] connection error`.brightMagenta
    )
);
db.once("open", () => {
    console.log(`[${"mongo".padEnd(7)}] database connected`.brightMagenta);
});

// app/middleware config
const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// functions
const logRoutes = (req, res, action = "") => {
    console.log(
        `[${"request".padEnd(7)}] ${req.method.padEnd(4)} ${req.url} ${action}`
    );
};

// routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

// app listen
app.listen(3000, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`.brightCyan);
});
