// BASE SETUP
// =============================================================================

// call required packages
var express = require('express') // call express
var app = express() // define app using express
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Hero = require('./app/models/hero')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080 // set port

mongoose.Promise = global.Promise // This is needed because mongoose default promise library is depricated
mongoose.connect('mongodb://root:root@ds135830.mlab.com:35830/heroes-db') // connect to database

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router() // get an instance of express Router

// middleware to use for all requests
router.use(function (req, res, next) {
  // do some logging
  console.log('something is happening.')
  next()
})

// test route (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'api initialised' })
})

// more routes here

// on routes that end in /bears
// ----------------------------------------------------

router.route('/heroes')

  // create a hero (accessed at POST http://localhost:8080/api/heroes)
  .post(function (req, res) {
    var hero = new Hero() // create a new instance of hero model
    hero.name = req.body.name // set the hero name (comes from the request)

    // save the hero and check for errors
    hero.save(function (error) {
      if (error)
        res.send(error)

      res.json({ message: 'Hero created!' })
    })
  })

  // get all the heroes (accessed at GET http://local:8080/api/heroes)
  .get(function (req, res) {
    Hero.find(function (error, heroes) {
      if (error)
        res.send(err)

      res.json(heroes)
    })
  })

// on routes that end in /bears/:bear_id
// ----------------------------------------------------

router.route('/heroes/:hero_id')

  // get the hero with that id (accessed at GET http://localhost:8080/api/heroes/:bear_id)
  .get(function (req, res) {
    Hero.findById(req.params.hero_id, function (error, hero) {
      if (error)
        res.send(error)
      res.json(hero)
    })
  })

  // update the hero with this id (accessed at GET http://localhost:8080/api/heroes/:bear_id)
  .put(function (req, res) {

    // use our hero model to find the hero we want
    Hero.findById(req.params.hero_id, function (error, hero) {
      if (error)
        res.send(error)

      hero.name = req.body.name // update the hero name

      //save the hero
      hero.save(function (error) {
        if (error)
          res.send(error)

        res.json({ message: 'Hero updated!' })
      })
    })
  })

  // delete the hero with this id (accessed at GET http://localhost:8080/api/heroes/:bear_id)
  .delete(function (req, res) {
    Hero.remove({
      _id: req.params.hero_id
    }, function (error, hero) {
      if (error)
        res.send(error)
      res.json({ message: 'Successfully deleted' })
    })
  })

// REGISTER OUR ROUTES -------------------------------
// all routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// =============================================================================
app.listen(port, function () {
  console.log('App is listening on port ' + port)
})