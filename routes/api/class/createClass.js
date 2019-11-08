const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const model = require('../../../models/model.js');

const bodyParser = require('body-parser');

const auth = require('../../middleware/auth.js');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(auth);

//req : client한테서 받아오는 것, res client에 내보내는 것

router.post('/', (req, res) => {
    const user_id = mongoose.Types.ObjectId(req.decoded_token._id);
    const role = req.decoded_token.role;
    model.user.findOne()
    .where('_id').equals(mongoose.Types.ObjectId(user_id))
    .then(result => {
        
    })
    
        classroom.create()
        .then(token => {
            res.status(200).json({
                message: "Class Created",
                token
            });
        }).catch(err => {
            if(role === '2' ||role ==='3') {
                res.status(403).send({message: 'Forbidden'});
            }
            else {
                console.log(err);
                res.status(500).send({message: 'server-error'});
            }
        });

});
//TODO: 학생이 접근하려고 할 시 막아야함  => DECODE에서 403으로 반환, 성공 시 200

module.exports = router;



