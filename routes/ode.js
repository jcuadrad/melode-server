var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
  const userOde = req.body;
  res.json('OK!');
});

router.get('/random', function (req, res, next) {
  res.send('random ode');
});

router.get('/:id', function (req, res, next) {
  res.send('this specific ode');
});

router.post('/by-id', function (req, res, next) {
  res.send('the users odes');
});

module.exports = router;
