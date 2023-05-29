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

const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ["Spring", "Summer", "Fall", "Winter"],
    },
});
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Product = mongoose.model("Product", productSchema);
const Farm = mongoose.model("Farm", farmSchema);

// Product.insertMany([
//     { name: "Goddess Melon", price: 4.99, season: "Summer" },
//     { name: "Sugar Baby Watermelon", price: 4.99, season: "Summer" },
//     { name: "Asparagus", price: 3.99, season: "Spring" },
// ]);

const makeFarm = async () => {
    const farm = new Farm({ name: "Full Belly Farms", city: "Guinda, CA" });
    const melon = await Product.findOne({ name: "Goddess Melon" });
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
};

// makeFarm();

const addProduct = async () => {
    const farm = await Farm.findOne({ name: "Full Belly Farms" });
    const watermelon = await Product.findOne({ name: "Sugar Baby Watermelon" });
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm);
};

// addProduct();

Farm.findOne({ name: "Full Belly Farms" })
    .populate("products")
    .then((farm) => console.log(farm));
