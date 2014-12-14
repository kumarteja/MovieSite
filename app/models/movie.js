var mongoose = require('mongoose');

// define the schema for our movie model
var movieSchema = mongoose.Schema(
{
    title : String,
    release_date : String,
    users_rating : Number,
    story_line : String,
    directors : [String],
    producers : [String],
    stars : [String],
    selected_comment : String,
    critic_rating : Number,
    boxoffice_rating : Number
},
{
    collection : 'Movies'
})

// create the model for users and expose it to our app
module.exports = mongoose.model('Movie', movieSchema);
