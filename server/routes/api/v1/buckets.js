const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const router = express.Router();
const Buckets = require('../../../models/bucket');
const User = require('../../../models/user');
const config = require('../../../config/index');

router.all('*', (req, res, next) => {
	if (!req.headers[ 'authorization' ]) return res.status(403).json({ success: false });
	const token = req.headers[ 'authorization' ].split(' ')[ 1 ];

	jwt.verify(token, config.secret, async (err, decoded) => {
		if (err) return res.status(403).json({ success: false });
		const user = await User.findById(decoded.id).select('-password').exec();
		if (!user) return res.status(403).json({ success: false });
		req.user = user;
		next();
	})
});

router.get('/', async (req, res, next) => {
	try {
		let { q = '', page = '1', limit = '20' } = req.query;
		page = parseInt(page, 10);
		limit = parseInt(limit, 10);
		limit = limit > 100 ? 100 : limit;
		q = new RegExp(`${q}`, 'gi');
		const skip = (page - 1) * limit;
		const buckets = await Buckets.find({ createdBy: req.user._id })
			.where('name', q)
			.limit(limit)
			.skip(skip)
			.exec();
		res.json({ success: true, buckets });
	} catch (err) {
		next(err)
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const bucket = await Buckets.findById(id).exec();
		if (!bucket) res.status(404).json({ success: false, message: 'Buckets not found' });
		res.status(200).json({ success: true, bucket })
	} catch (err) {
		if (err.path === '_id') {
			res.status(400).json({ success: false, message: err.message });
		} else next(err)
	}
});

router.post('/', async (req, res, next) => {
	const schema = Joi.object().keys({
		name: Joi.string().required()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const { name } = data;
				const _bucket = new Buckets({ name, createdBy: req.user._id });
				const bucket = await _bucket.save();
				res.status(201).json({ success: true, message: 'Buckets Created', bucket })
			} catch (err) {
				next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.put('/:id', async (req, res, next) => {
	const schema = Joi.object().keys({
		name: Joi.string().required()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const bucket = await Buckets.findByIdAndUpdate(req.params.id, data, { new: true }).exec();
				if (!bucket) return res.status(404).json({ success: false, message: 'No bucket found' });
				res.status(200).json({ success: true, message: 'Buckets Updated', bucket });
			} catch (err) {
				next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.delete('/:id', async (req, res, next) => {
	try {
		const bucket = await Buckets.findByIdAndRemove(req.params.id).exec();
		if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
		res.status(200).json({ success: true, message: 'Buckets Deleted', bucket });
	} catch (err) {
		next(err)
	}
});

router.get('/:id/items', async (req, res, next) => {
	try {
		let bucket = await Buckets.findById(req.params.id).exec();
		if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
		res.status(200).json({ success: true, items: bucket.items });
	} catch (err) {
		next(err);
	}
});

router.get('/:id/items/:itemId', async (req, res, next) => {
	try {
		const { id, itemId } = req.params;
		let bucket = await Buckets.findById(id).exec();
		if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
		const item = bucket.items.find(item => item._id.toString() === itemId);
		if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
		res.status(200).json({ success: true, item });
	} catch (err) {
		next(err);
	}
});

router.post('/:id/items', async (req, res, next) => {
	const schema = Joi.object().keys({
		name: Joi.string().required()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const { name } = data;
				let bucket = await Buckets.findById(req.params.id).exec();
				if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
				bucket.items.push({ name, createdAt: Date.now(), updatedAt: Date.now(), done: false });
				bucket = await bucket.save();
				res.status(201).json({ success: true, message: 'Item Added', bucket });
			} catch (err) {
				next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.put('/:id/items/:itemId', async (req, res, next) => {
	const schema = Joi.object().keys({
		name: Joi.string(),
		done: Joi.boolean()
	});

	Joi.validate(req.body, schema)
		.then(async data => {
			try {
				const { id, itemId } = req.params;
				let bucket = await Buckets.findById(id).exec();
				if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
				const item = bucket.items.find(item => item._id.toString() === itemId);
				if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
				Object.keys(data).forEach(key => {
					bucket.items[ bucket.items.indexOf(item) ][ key ] = data[ key ]
				});
				bucket = await bucket.save();
				res.status(200).json({ success: true, message: 'Item Updated', bucket });
			} catch (err) {
				next(err);
			}
		})
		.catch(err => res.status(400).json({ success: false, message: err.details[ 0 ].message }));
});

router.delete('/:id/items/:itemId', async (req, res, next) => {
	try {
		const { id, itemId } = req.params;
		let bucket = await Buckets.findById(id).exec();
		if (!bucket) return res.status(404).json({ success: false, message: 'Buckets not found' });
		const item = bucket.items.find(item => item._id.toString() === itemId);
		if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
		bucket.items.splice(bucket.items.indexOf(item), 1);
		bucket = await bucket.save();
		res.status(200).json({ success: true, message: 'Item Deleted', bucket })
	} catch (err) {
		next(err)
	}
});

module.exports = router;