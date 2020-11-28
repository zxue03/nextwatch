const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("./verifyToken");

router.get("/watchList", verifyToken, async (req, res) => {
    const user = await User.findOne({_id: req.userId});
    const watchList = user.watchList;
    console.log(user)
    console.log(watchList)
    res.status(200).json({watchList: watchList});
})

module.exports = router;