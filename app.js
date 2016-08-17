// require mongoose - step 5
// var mongoose = require('mongoose');
// var mongo_url = 'mongodb://localhsot/mymdb_db';
//
// mongoose.connect(mongo_url);
//
// // set schema - step 6
// // settin up how json structure would be like
// var movieSchema = new.mongoose.Schema({
//   title: String,
  // publishedYear: Number,
//   director: String,
//   actors: String
// }
// );
//
// // register the schema - step 7
// var Movie = mongoose.model('Movie', movieSchema); // 'Movie' mongoose will look for movies with a "s"

// requiring the Movie module - step 9
var Movie = require('./models/movie');

var Actor = require('./models/actor');

var User = require('./models/user');

var jwt_secret = 'supercalifreagilxpress';


// require express module - step 1
var express = require('express');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

// run express - step 2
var app = express();

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// express JWT
app.use(
  expressJWT( {
    secret: jwt_secret
  })
  .unless({
    path: [ '/signup', '/login']
  })
);

// set the port - step 3
var port = process.env.PORT || 5000;
app.set( 'port', port);

//signup route

app.post('/signup', function(req, res) {
  // res.send(req.body);
  // set var for the posted requests
  var user_object = req.body;
  // set new user object
  var new_user = new User(user_object);
  //save the new user object
  new_user.save( function(err, user) {
    if (err) return res.status(400).send(err);

    return res.status(200).send({
      message: 'User created'
    });
  });
  // res.send('create new user');
});

// user login route

app.post('/login', function(req, res) {
 var loggedin_user = req.body;

 User.findOne(
   loggedin_user,
   function(err, found_user) {
     // this is error find flow
     if (err) return res.status(400).send(err);

     if(found_user) {

       var payload = found_user.id;
       var jwt_token = jwt.sign(payload, jwt_secret);

       return res.status(200).send(jwt_token);

     } else {
       // this is login failed flow
       return res.status(400).send({ message: 'login failed'});
     }
   });
 });



// set all middle wares

// list all the routes - step - 10
app.route('/movies')
   .get( function(req, res, next) {
    //  Movie.find({}, function(err, movies){
     Movie.find().exec(function(err, movies){
       if (err) return next(err);

       res.json(movies);
     });
   })

     .post( function(req, res, next) {
       console.log(req.body);
       var new_movie = new Movie( req.body );
       new_movie.save(function(err) {
         if (err) return next(err);

         res.json(new_movie);
       });
      //  res.send('post new moive');
     })

app.route('/movies/:movie_id')
  .get( function(req, res, next) {
   var movie_id = req.params.movie_id;
   // res.send( 'movie_id is ' + movie_id);
   // res.json(res.params);
   Movie.findOne({
     _id: movie_id
   }, function(err, movie) {
     if (err) return next(err);

     res.json(movie);
   });
  })

  .put( function(req, res, next) {
   console.log(req.body);
   // res.send('update movie by id');
   // res.json(req);
   var movie_id = req.params.movie_id;
   Movie.findByIdAndUpdate( movie_id, req.body, function(err, movie){
       if (err) return next(err);

       res.json(movie);
   });
 })

   .delete( function(req, res, next) {
     // console.log(req.body);
     // res.send('update actor by id');
     // res.json(req);
     var movies_id = req.params.movies_id;
     Movie.findByIdAndRemove( movie_id, function(err) {
         if (err) return next(err);

         res.end();
     });
   })


app.route('/actors')
  .get( function(req, res, next) {
   //  Movie.find({}, function(err, movies){
    Actor.find().exec(function(err, actors){
      if (err) return next(err);

      res.json(actors);
    });
})
  .post( function(req, res, next) {
    console.log(req.body);
    var new_actor = new Actor( req.body );
    new_actor.save(function(err) {
      if (err) return next(err);

      res.json(new_actor);
    });
   //  res.send('post new moive');
  })
    //  res.send('list of movies');

app.route('/actors/:actor_id') // app.route('/actors/:actor_email)
  .get( function(req, res, next) {
    var actor_id = req.params.actor_id;
    // res.send( 'actor_id is ' + actor_id);
    // res.json(res.params);
    Actor.findOne({
      _id: actor_id
    }, function(err, actor) {
      if (err) return next(err);

      res.json(actor);
    });
  })

  .put( function(req, res, next) {
    // console.log(req.body);
    // res.send('update actor by id');
    // res.json(req);
    var actor_id = req.params.actor_id;
    Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
        if (err) return next(err);

        Actor.findOne( {_id: actor_id},  // Actor
        function(err, actor) {           // .find()
          if (err, actor) return next(err); //.byName(actorName)
                                            // .exec(function())
          res.json(actor);
        });
        // res.json(actor);
    });
  })

  .delete( function(req, res, next) {
    // console.log(req.body);
    // res.send('update actor by id');
    // res.json(req);
    var actor_id = req.params.actor_id;
    Actor.findByIdAndRemove( actor_id, function(err) {
        if (err) return next(err);

        res.end();
    })
  })



// listening to the port - step 4
app.listen( app.get('port'), function() {
  console.log('Running on port ' + app.get('port'));
});

module.exports = app;
