module.exports = function(app, passport) {
    // passport authentication for login
    app.post('/login', passport.authenticate('local-login'), function(req, res) {
      res.send(req.user);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.end();
    });
};