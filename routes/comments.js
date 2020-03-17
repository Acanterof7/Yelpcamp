const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"); 
    // if it'snamed index you don't have to specify the exact file it's the default


// adding a comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id)
        .catch(err => console.log(err))
        .then(function (campFound) {
            res.render("comments/new", { campground: campFound });
        });
});

// creating the comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id)
        .catch(err => {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        })
        .then(function (campFound) {
            Comment.create(
                {
                    author: {
                        id: req.user._id,
                        username: req.user.username
                    },
                    text: req.body.text

                }
            )
                .catch(err => {
                    req.flash("Something went wrong creating the comment")
                    console.log(err)
                })
                .then(comment => {
                    // @ts-ignore
                    campFound.comments.push(comment);
                    // @ts-ignore
                    campFound.save();
                    req.flash("success", "Comment created correctly")
                    res.redirect("/campgrounds/" + req.params.id);
                })
        });
});

//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findById(req.params.comment_id)
            .catch(err => console.log(err))
            .then((foundComment) => {
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
            })

    });

// update comment
router.put("/:comment_id", middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findByIdAndUpdate(req.params.comment_id, { text: req.body.text })
            .catch(err => console.log(err))
            .then((foundComment) => {
                res.redirect("/campgrounds/" + req.params.id);
            })
    });

//delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findByIdAndRemove(req.params.comment_id)
            .catch(err => console.log(err))
            .then((foundComment) => {
                req.flash("success", "Comment deleted")
                res.redirect("/campgrounds/" + req.params.id);
            })
    });




module.exports = router;