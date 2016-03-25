var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome');
});

router.get('/piano',function (req,res,next) {
	
	res.render('piano')
})
module.exports = router;
