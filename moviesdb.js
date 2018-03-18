var mongoose = require('mongoose')

mongoose.connect('mongodb://movieuseraccess:password1@ds117729.mlab.com:17729/moviesandusers')

var Schema = mongoose.Schema
var db = mongoose.connection

var actorSchema = new Schema({
    ActorName: { type: String, required: true },
    CharacterName: { type: String, required: true }
})

var manyValidators = [
    { validator: isActor, msg: 'Is not an Actor' },
    { validator: minSize, msg: 'Not enough actors' }
];
function isActor(val) {
    return val.every(function (i) { return i instanceof Actor });
}
function minSize(val) {
    return val.length >= 3
}

var movieSchema = new Schema({
    Title: { type: String, required: true },
    Year: { type: Number, required: true },
    Genre: { type: String, enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western'], required: true },
    Actors: {
        type: [actorSchema],
        required: true,
        validate: manyValidators
    }
})

var Movie = mongoose.model('Movie', movieSchema)
var Actor = mongoose.model('Actor', actorSchema)
var moviesdb = {}

moviesdb.addAMovie = function (req, res) {
    var movie = new Movie()
    if (req.body.movie) {
        movie.Title = req.body.movie.Title
        movie.Year = req.body.movie.Year
        movie.Genre = req.body.movie.Genre
        for (var i = 0; i < req.body.movie.Actors.length; i++)
            movie.Actors[i] = new Actor(req.body.movie.Actors[i].Actor)
        movie.save(function (error) {
            if (error != null)
                res.json({ error: error })
            else
                res.json({ success: 'Movie successfully inserted.' })
        })
    } else {
        res.json({error:'There is no movie to insert.'})
    }
}

moviesdb.getAMovie = function (req, res) {
    if(req.query.Title)
        Movie.find({ Title: req.query.Title }, function (err, movie) {
            res.json({movies:movie})
        })

    else if (req.query.Year)
        Movie.find({ Year: req.query.Year }, function (err, movie) {
            res.json({ movies: movie })
        })

    else if (req.query.Genre)
        Movie.find({ Genre: req.query.Genre }, function (err, movie) {
            res.json({ movies: movie })
        })
    else 
        res.json({error:'Invalid search criteria'})
}

moviesdb.deleteAMovie = function (req, res) {
    if (req.body._id) {
        Movie.findByIdAndRemove(req.body._id, function (err, doc) {
            if (err) {
                res.json({ error: 'Could not delete movie.' })
            }
            else {
                if (doc) {
                    res.json({ success: 'Movie successfully removed.' })
                }
                else {
                    res.json({ error: 'Could not find movie.' })
                }
            }
        })
    }
    else
        res.json({error:'No id given.'})
}

moviesdb.updateAMovie = function (req, res) {
    if(req.body.Title)
        Movie.findByIdAndUpdate(req.body._id, { $set: { Title: req.body.Title } }, { new: true }, function (err, doc) {
            if (err)
                res.json({ error: 'Could not update movie.' })
            else {
                if(doc)
                    res.json({ success: 'Movie successfully updated.' })
                else
                    res.json({error:'Could not find movie for updating.'})
            }
        })
    else if (req.body.Year)
        Movie.findByIdAndUpdate(req.body._id, { $set: { Year: req.body.Year } }, { new: true }, function (err, doc) {
            if (err)
                res.json({ error: 'Could not update movie.' })
            else {
                if (doc)
                    res.json({ success: 'Movie successfully updated.' })
                else
                    res.json({ error: 'Could not find movie for updating.' })
            }
        })
    else if (req.body.Genre)
        Movie.findByIdAndUpdate(req.body._id, { $set: { Genre: req.body.Genre } }, { new: true }, function (err, doc) {
            if (err)
                res.json({ error: 'Could not update movie.' })
            else {
                if (doc)
                    res.json({ success: 'Movie successfully updated.' })
                else
                    res.json({ error: 'Could not find movie for updating.' })
            }
        })
}

module.exports = moviesdb