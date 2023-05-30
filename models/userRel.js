const env = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");
const { string } = require("joi");

// database config
env.config();
mongoose.connect(process.env.URI, {
    dbName: "relationshipDemo",
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

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: false,
            street: String,
            city: String,
            state: String,
            country: String,
        },
    ],
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
    const u = new User({
        first: "Harry",
        last: "Potter",
    });
    u.addresses.push({
        street: "123 Sesame St.",
        city: "New York",
        state: "NY",
        country: "USA",
    });
    const res = await u.save();
    console.log(res);
};

// one to few
const addAddress = async (id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: "99 3rd St.",
        city: "New York",
        state: "NY",
        country: "USA",
    });
    const res = await user.save();
    console.log(res);
};

// makeUser();
// addAddress("64737d245f3e07aa7bbeb6f2");
