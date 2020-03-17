const Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middleObject = {
    checkCampgroundOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id)
                .catch(err => {
                    req.flash("error", "Campground not found")
                    res.redirect("back")
                })
                .then(function (campFound) {
                    // @ts-ignore
                    if (campFound.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "Permission denied.")
                        res.redirect("back");
                    }

                });
        } else {
            req.flash("error", "You need to be logged in to perform this action.")
            res.redirect("/login")
        };
    },

    checkCommentOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.id)
                .catch(err => {
                    req.flash("error", "Comment not found")
                    res.redirect("back")
                })
                .then(function (commentFound) {
                    // @ts-ignore
                    if (commentFound.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "Permission denied.")
                        res.redirect("back");
                    }

                });
        } else {
            req.flash("error", "You need to be logged in to perform this action.")
            res.redirect("back")
        };
    },

    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        //req.flash doesnt show anythin, just gives the ability to
        req.flash("error", "You need to be logged in to perform this action.")
        res.redirect("/login");
    }
};

module.exports = middleObject;