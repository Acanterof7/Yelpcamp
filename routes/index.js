const express = require("express"),
    router = express.Router();

// @ts-ignore
router.get("/", function (req, res) {
    res.render("home", { currentUser: req.user });
});

module.exports = router;