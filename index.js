var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Vehicle = require('./app/models/vehicle')

// config app for bodyParser() --
// lets us grab data from the body post
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set port for server to listen on
var port = process.env.PORT || 3000;

// connect to DB
mongoose.connect('mongodb://localhost:27017/hello', {useNewUrlParser: true});


// initialise Api routes
var router = express.Router();

//routes will be prefixed with /Api
app.use('/api', router);

// MIDDLEWARE
// MIDDLEWARE can be very useful for doing validations. we can log in things
// from here or stop the request from continuing the event that the request
// is not safe
// Middleware to use for all requests
router.use((req, res, next)=>{
  console.log('FYI...something is going on here...');
  next();
})

// test route
router.get('/', (req, res)=>{
  res.send({message: '...Welcome to our API...'});
})

router.route('/vehicle')
  .post((req, res)=>{
    var vehicle = new Vehicle();
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save((err)=>{
      if (err) {
        res.send(err);
      } else {
        res.json({message: 'You have manufactured a car susseccfully'})
      }
    })

  })
  .get((req, res)=>{
    Vehicle.find((err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle);
      }
    })
  })
// search by color
router.route('/vehicle/color/:color')
  .get((req,res)=>{
    Vehicle.find({color: req.params.color}, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle)
      }
    })
  })



// search by make
router.route('/vehicle/make/:make')
  .get((req,res)=>{
    Vehicle.find({make: req.params.make}, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle)
      }
    })
  })

// search by models
router.route('/vehicle/model/:model')
  .get((req,res)=>{
    Vehicle.find({model: req.params.model}, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle)
      }
    })
  })
// search by ID
router.route('/vehicle/:id')
  .get((req,res)=>{
    Vehicle.findById(req.params.id, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle)
      }
    })
  })

// fire up server
app.listen(port);

// message when connected
console.log('Server doing amebo on port:3000');
