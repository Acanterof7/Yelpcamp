const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// show campgrounds
// @ts-ignore
router.get("/", function (req, res) {
    Campground.find({})
        .catch(err => console.log(err))
        .then(function (allCamps) {
            res.render("campgrounds/index",
                {
                    campgrounds: allCamps
                });
        });
});

// create a new campground
router.post("/", function (req, res) {
    Campground.create({
        name: req.body.name,
        imageUrl: req.body.img,
        description: req.body.desc,
        price: req.body.price,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    },
        function (err, camp) {
            if (err) {
                console.log("error!!!:");
            } else {
                res.render("campgrounds", { campgrounds: camp })
            }
        });
    res.redirect("/campgrounds");
});

// show form to create a new campground
// @ts-ignore
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// show detail of an exact campground
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec()
        .catch(err => {
            console.log(err);
            req.flash("error", "Campground not found");
        })
        .then(function (campFound) {
            res.render("campgrounds/show", { campground: campFound });
        });
});

// editing campground
// @ts-ignore
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id)
        .catch(err => console.log(err))
        .then(function (campFound) {
            res.render("campgrounds/edit", {
                campground: campFound
            });
        });
});

//updating campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price
    })
        .catch(err => console.log(err))
        .then(() => {
            res.redirect("/campgrounds/" + req.params.id);
        });
});

//deleting campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id)
        .catch(err => console.log(err))
        .then((campgroundRemoved) => {
            // @ts-ignore
            console.log(campgroundRemoved.comments);
            // @ts-ignore
            Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } })
                .catch(err => console.log(err))
                .then((result) => {
                    console.log(result);
                    res.redirect("/campgrounds");
                });
        });
});



module.exports = router;