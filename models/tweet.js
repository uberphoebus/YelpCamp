const env = require("dotenv");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
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

const userSchema = new Schema({
    username: String,
    age: Number,
});

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweets = async () => {
    // const user = new User({ username: "chickenfan99", age: 61 });
    const user = await User.findOne({ username: "chickenfan99" });
    const tweet2 = new Tweet({
        text: "bock bock bock my chickens make noise",
        likes: 123,
    });
    tweet2.user = user;
    await user.save();
    await tweet2.save();
    console.log(tweet2);
};

// makeTweets();

const findTweet = async () => {
    const t = await Tweet.find({}).populate("user");
    console.log(t);
};

findTweet();
