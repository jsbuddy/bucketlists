const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, lowercase: true, trim: true, unique: true },
	password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	bcrypt.hash(this.password, null, null, (err, hash) => {
		if (err) return next(err);
		this.password = hash;
		next();
	})
});

UserSchema.methods.comparePasswords = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);