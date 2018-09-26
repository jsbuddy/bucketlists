const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BucketSchema = new Schema({
	name: { type: String, required: true },
	items: [
		{
			name: { type: String },
			createdAt: { type: Date, default: Date.now() },
			updatedAt: { type: Date },
			done: { type: Boolean, default: false }
		}
	],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Bucket', BucketSchema);