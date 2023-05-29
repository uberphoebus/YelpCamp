const express = require("express");

const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");

const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

// routes

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
    res.render("home");
});

// error handling
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "something went wrong";
    res.status(statusCode).render("error", { err });
});

// app listen
app.listen(3000, () => {
    console.log(`[${"server".padEnd(7)}] on port 3000`.brightCyan);
});
