const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router({});
const User = require("../../../models/user");
const config = require('../../../config/index');

router.post('/register', async (req, res, next) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(2).required(),
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(6).required()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const _user = new User(data);
				const user = await _user.save();
				res.status(201).json({ success: true, message: 'Registration Successful', user });
			} catch (err) {
				if (err.code === 11000) res.status(400).json({
					success: false,
					message: 'Email address already in use'
				});
				else next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.post('/login', async (req, res, next) => {
	const schema = Joi.object().keys({
		email: Joi.string().email().lowercase().required(),
		password: Joi.string().min(6).required()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const { email, password } = data;
				const user = await User.findOne({ email }).exec();
				if (!user) return res.status(404).json({ success: false, message: 'Email address does not exist' });
				if (!user.comparePasswords(password)) return res.status(400).json({
					success: false,
					message: 'Incorrect password'
				});
				jwt.sign({ id: user._id, name: user.name }, config.secret, (err, token) => {
					if (err) return next(err);
					res.status(200).json({ success: true, message: 'Login successful', token: `Bearer ${token}` })
				});
			} catch (err) {
				return next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.post('/logout', (req, res) => {
});

module.exports = router;
