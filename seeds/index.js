const mongoose = require('mongoose');
const Bnbair = require('../models/places');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/bnbair', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async() =>{
    await Bnbair.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*500);
        const place = new Bnbair({ location: `${cities[random1000].city}, ${cities[random1000].state}`,
                                    title: `${sample(descriptors)} ${sample(places)}`,
                                    image: 'https://source.unsplash.com/1600x900/?house',
                                    description: "some description",
                                    price: price})
        await place.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
});