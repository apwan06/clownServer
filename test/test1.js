/**
 * Created by WuYijie on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../ctrl/user.js');
var session = require('express-session');

// for Lin Zinan
router.post('/reg', function(req, res){
	var reJson = {
		receive: 1
	}
	if (req.body['repassword'] != req.body['password']) {
		reJson.success = 0;
		reJson.errmsg = '两次输入的口令不一致';
		res.send(JSON.stringify(reJson));
	} else if (req.body['password'] == '') {
		reJson.success = 0;
		reJson.errmsg = '密码不能为空';
		res.send(JSON.stringify(reJson));
	} else if (req.body['username'].length < 3) {
		reJson.success = 0;
		reJson.errmsg = '用户名小于3个字符';
		res.send(JSON.stringify(reJson));
	} else {
		User.getUserByName(req.body['username'], function(err, userT) {
			if (userT) {
				reJson.success = 0;
				reJson.errmsg = '用户名已存在';
				res.send(JSON.stringify(reJson));
			} else {
				var newUser = new User({
					name: req.body['username'],
					email: req.body['email'],
					password: req.body['password']
				});
				newUser.createUser(function (err, userT) {
					if (err) {
						reJson.success = 0;
						reJson.errmsg = JSON.stringify(err);
						res.send(JSON.stringify(reJson));
					} else {
						//req.session.user = userT;
						reJson.success = 1;
						res.send(JSON.stringify(reJson));
					}
				});
			}
		});
	}
});

router.get('/reg', function(req, res){
   res.render('reg',{});
    //res.send('This is the first test module.');
});

router.post('/login', function(req, res){
	var reJson = {
		receive: 1
	}
	var user = new User({
		name: req.body['username'],
		password: req.body['password']
	});
	//res.send(JSON.stringify(user));
	user.checkPassword(function(err, userT) {
		if (userT) {
			session.user = userT;
			reJson.success = 1;
			res.send(JSON.stringify(reJson));
		} else {
			session.user = null;
			reJson.success = 0;
			res.send(JSON.stringify(reJson));			
		}
	});
});

router.get('/login', function(req, res){
	if (session.user != null) {
		var user = new User({
			name: session.user.name,
			password: session.user.password
		}, 1);
		user.checkPassword(function(err, userT) {
			if (userT) {
				session.user = userT;
				res.render('logged', {usermsg: JSON.stringify(userT)});
			} else {
				session.user = null;
				res.render('login',{});	
			}
		});
	} else {
		res.render('login',{});
	}
});

router.get('/logout', function(req, res) {
	session.user = null;
	res.redirect('/test1/login');
});

module.exports = router;