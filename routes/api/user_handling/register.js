const express = require('express');
const router = express.Router();

const model = require('../../../models/model.js');
const crypto = require('crypto');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: false
}));

/* GET home page. */
router.post('/', function(req, res, next) {
    new Promise((resolve, reject) => {
        /* -------------
         TODO: PASSWORD 검증 하는 작업을 여기서 하십시오. 모델에 저장되는 패스워드는 salt가 쳐진 형태입니다. */

        if(false) { // TODO: if 조건문을 적절히 수정해주세요.
            reject(new Error('password-error'));
        }
        else {
            resolve(model.user.find().where('email').equals(req.body.email));
        }
    }).then(result => {
        if (result.length >= 1) throw new Error('already-register');
        return model.user.find()
            .where('name').equals(req.body.name);
    }).then(result => {
        if(result.length >= 1) throw new Error('not-unique-name');
        return ;
    }).then(() => {
            var etoken = crypto.randomBytes(32).toString('hex');
            etoken = req.body.email + etoken;
            etoken = crypto.createHash('sha512').update(etoken).digest('hex');

            var user_salt = crypto.randomBytes(128).toString('hex');
            var hashed_password = crypto.createHmac('sha512', user_salt).update(req.body.password).digest('hex');

            save_obj = model.user({
                email: req.body.email,
                name: req.body.name,
                password: hashed_password,
                email_token: etoken,
                email_auth: true, // TODO: 나중에 false 로 변경
                role: req.body.role,
                solved_problem: [],
                classroom: [],
                salt: user_salt
            });

            save_obj.save(err => {
                if (err) {
                    res.status(403).send({message: 'email-form-error'});
                }
                else {
                    /* ----------
                    TODO: 여기서 이메일을 보내는 작업을 작성하십시오. 비동기 작업이어야 합니다. */
                    console.log('Hello');

                    res.status(200).send({message: 'register-success'});
                }
            });
    }).catch(err => {
        /* --------
        TODO: 런타임 에러를 핸들링 하십시오. */

        if(err.message === "already-register") {
            /*--------------
            TODO: email token 을 재발급 하는 기능을 만들어야 합니다. 이 부분에 대해서는 토론이 필요합니다. */

            res.status(403).send({message: 'already-register'});
        }
        else if(err.message === "password-error") {
            res.status(403).send({message: 'password-error'});
        }
        else if(err.message === 'not-unique-name') {
            res.status(403).send({message: 'not-unique-name'});
        }
        else {
            res.status(500).send({message: 'server-error'});
        }

    });
});

router.get('/authorization/:authToken', function(req, res, next) {
    /* -------
    TODO: 여기서 이메일 인증을 작성하십시오. */

    res.status(200).send({message: "email_auth_success"});
});

module.exports = router;
