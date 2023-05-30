const express = require("express");

const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");

const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const colors = require("colors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError");

const User = require("./models/user");

const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

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

app.use(morgan("dev"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "thishouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    // if (!["/login", "/register", "/"].includes(req.originalUrl)) {
    //     req.session.returnTo = req.originalUrl;
    // } else {
    //     delete req.session.returnTo;
    // }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/fakeUser", async (req, res) => {
    const user = new User({ email: "coltttt@gmail.com", username: "coltttt" });
    const newUser = await User.register(user, "chicken");
    res.send(newUser);
});

// routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

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
