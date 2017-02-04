var path = require('path');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup 用户注册
router.post('/', function(req, res, next) {
    var name = req.fields.name,
        gender = req.fields.gender,
        bio = req.fields.bio,
        // avatar = req.files.avatar.path.split(path.sep).pop(),
        avatar = '/img/default_avatar.jpg',
        password = req.fields.password,
        repassword = req.fields.repassword;

    //test
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在 1-10 个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('性别只能是 m、f 或 x');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error('个人简介请限制在 1-30 个字符');
        }
        // if (!req.files.avatar.name) {
        //     throw new Error('缺少头像');
        // }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        req.send({
            errmsg: e.message,
            errnum: '',
            data: null
        })
    }
    password = md5.update(password).digest('hex');
    var user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    };
    UserModel.create(user)
    .then(function (result) {
        user = result.ops[0];
        delete user.password;
        req.session.user = user;
        res.send({
            errmsg: '',
            errnum: '',
            data: 'success'
        });
    })
    .catch(function (e) {
        if (e.message.match('E11000 duplicate key')) {
            res.send({
                errmsg: '用户名已占用',
                errnum: '',
                data: ''
            });
        }
        next();
    })
});

module.exports = router;