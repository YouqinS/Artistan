//using mysql2 used instead of mysql module
const mysql = require('mysql2/promise');

//creeate connection pool to reuse previous connection
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

//each module represent a table on database(controllers for db IO)
const User = require('./users')(pool);
const Media = require('./media')(pool);
const Post = require('./post')(pool);
const Comment = require('./comment')(pool);
const Category = require('./category')(pool);
const Auth = require('./auth')(pool);

module.exports = {
	User,
	Media,
	Post,
	Comment,
	Category,
	Auth
}
