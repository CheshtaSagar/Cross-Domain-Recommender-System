//authentication for user
exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'Please log in.');
        res.redirect('/l');
    }
}