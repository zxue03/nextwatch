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

router.post("/addMovie", verifyToken, async (req, res) => {
    const user = await User.findOne({_id: req.userId});
    const watchList = user.watchList;
    const movieId = req.body.movieId;
    console.log(user)
    console.log(watchList)
    console.log(movieId)
    const existing = watchList.find(existingMovieId => existingMovieId == movieId);
    if(existing){
        return res.status(200).json({message: "Movie already exists in watchlist"});
    }
    watchList.push(movieId);
    User.updateOne({_id: req.userId}, {$set: {watchList: watchList}}, (err, res) => {
        if(err) throw err;
        console.log(res);
    })

    res.status(200).json({message: "Movie successfully added to watchlist"});
})

router.post("/deleteMovie", verifyToken, async (req, res) => {
    const user = await User.findOne({_id: req.userId});
    const watchList = user.watchList;
    const movieId = req.body.movieId;
    const index = watchList.indexOf(movieId);
    console.log(user)
    console.log(watchList)
    console.log(movieId)
    if (index > -1) {
        watchList.splice(index, 1);
        User.updateOne({_id: req.userId}, {$set: {watchList: watchList}}, (err, res) => {
            if(err) throw err;
            console.log(res);
        })
      }
    res.status(200).json({message: "Movie successfully deleted from watchlist"});
})

module.exports = router;