module.exports = function(app) {
    app.get('/', function(req, res){
        res.render('index.html');
    });
    app.get('/partials/:name', function(req, res){
        var name = req.params.name;
        res.render('partials/' + name);
    });
};