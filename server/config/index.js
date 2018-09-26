module.exports = {
	PORT: process.env.PORT || 1000,
	db: {
		uri: 'mongodb://localhost:27017/bucketlist'
	},
	secret: 'bucketlist.secret'
};