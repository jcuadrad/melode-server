var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/spotify', function (req, res, next) {
  res.send('login');
});

router.get('/logout', function (req, res, next) {
  res.send('logout');
});

module.exports = router;
