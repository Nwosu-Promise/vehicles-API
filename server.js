var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// config app for bodyParser()
// lets us grab data from the body post
app.use(bodyParser.urlencoded({ extended: true} ));
app.use(bodyParser.json());

// set port for server to listen on
var port = process.env.PORT || 3000;

// connect to DB
mongoose.connect('mongodb://localhost:27017/hello', { useNewUrlParser: true });

// Api routes
var router = express.Router();

//routes will be prefixed with /Api
app.use('/api', router);

// MIDDLEWARE
// MIDDLEWARE can be very useful for doing validations. we can log in things
// from here or stop the request from continuing the event that the request
// is not safe
// Middleware to use for all requests
router.use((req, res, next)=>{
  console.log('FYI...There is some processing currrently going down...');
  next();
})

// test route
router.get('/', (req, res)=>{
  res.json({message: 'Welcome to our API'});
})


router.route('/vehicle')
  .post((req, res)=>{
    var vehicle = new Vehicle(); //new vehicles
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save((err)=>{
      if (err) {
        res.send(err);
      } else {
        res.json({message: 'Vehicle was susseccfully manufactured'});
      }
    });
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

router.route('/vehicle/:vehicle_id')
.get((req,res)=>{
  Vehicle.findById(req.params.vehicle_id, (err,vehicle)=>{
    if (err) {
      res.send(err);
    } else {
      res.json(vehicle);
    }
  });
})

router.route('/vehicle/make/:make')
  .get((req,res)=>{
    Vehicle.find({make: req.params.make}, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle);
      }
    });
  })

router.route('/vehicle/color/:color')
  .get((req,res)=>{
    Vehicle.find({color: req.params.color}, (err, vehicle)=>{
      if (err) {
        res.send(err);
      } else {
        res.json(vehicle);
      }
    })
  })

// fire up server
app.listen(port)

// message when connected
console.log('Server listening on port:' + port);
