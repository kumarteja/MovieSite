var Movie            = require('../models/movie');
var Review            = require('../models/review');
var ObjectId = require('mongoose').Types.ObjectId; 
var url = require("url");

module.exports = function(app) {
    app.get('/movie',function(req, res) {
    	parsedUrl = url.parse(req.url, true)
		queryAsObject = parsedUrl.query
		movieId = queryAsObject.m_id
      	Movie.findOne({ '_id' :  new ObjectId(movieId)}, function(err, movie) {
      		res.end(JSON.stringify(movie));
      	})
    })
    app.get('/retrieve-movies',function(req, res) {
    	parsedUrl = url.parse(req.url, true)
		queryAsObject = parsedUrl.query
		var searchTerm = queryAsObject.s;
      	Movie.find(
      		{
      			'title' : new RegExp('.*' + searchTerm + '.*')
      		},
      		null,
      		{
			    skip:0, // Starting Row
			    limit:5, // Ending Row
			    sort:{
			        users_rating: -1 //Sort by rating Added DESC
			    }
			}, 
			function(err, movies) {
      			res.end(JSON.stringify(movies))
      		}
      	)
    })
    app.get('/reviews',function(req, res) {
    	parsedUrl = url.parse(req.url, true)
		queryAsObject = parsedUrl.query
		movieId = queryAsObject.m_id
      	Review.find({ 'm_id' :  movieId}, function(err, reviews) {
      		res.end(JSON.stringify(reviews));
      	})
    })
    app.get('/user-review',function(req, res) {
    	parsedUrl = url.parse(req.url, true)
		queryAsObject = parsedUrl.query
		movieId = queryAsObject.m_id
		userId = queryAsObject.u_id
      	Review.findOne({ 'm_id' :  movieId}).where('u_id').equals(userId).exec(function(err, review) {
      		res.end(JSON.stringify(review));
      	})
    })
    app.post('/post-review',function(req, res) {
    	review = req.body
    	newReview = new Review()
    	newReview.m_id = review.m_id
    	newReview.u_id = review.u_id
    	newReview.is_critic = review.is_critic
    	newReview.review = review.review
    	newReview.up_votes = review.up_votes
    	newReview.down_votes = review.down_votes
      	newReview.save(function(err) {
		    if (err)
		        throw err;
		    res.end();
		});
    })
}