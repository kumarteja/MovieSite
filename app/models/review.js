var mongoose = require('mongoose');

// define the schema for our review model
var reviewSchema = mongoose.Schema(
{
    m_id : String,
    u_id : String,
    is_critic : Boolean,
    review : String,
    up_votes : Number,
    down_votes : Number
},
{
    collection : 'Reviews'
})

// create the model for users and expose it to our app
module.exports = mongoose.model('Review', reviewSchema);
