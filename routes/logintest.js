const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth.js');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(auth);

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.status(200).send({message: 'success'});
});

module.exports = router;