const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const airbnbSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
})

airbnbSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Bnbair',airbnbSchema);