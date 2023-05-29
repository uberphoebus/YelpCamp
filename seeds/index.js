const env = require("dotenv");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, veritatis excepturi dolor, saepe possimus sapiente tenetur vitae est nobis dolorum iure magnam libero hic mollitia minima, reprehenderit eligendi expedita doloribus.",
            price: price,
        });
        await camp.save();
    }
    console.log(`[${"mongo".padEnd(7)}] database seeded`);
};

seedDB().then(() => {
    mongoose.connection.close();
});
