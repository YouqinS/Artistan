
module.exports = (connection) => {
	const module = {};
	module.getAllUsers = async(req, res) => {
		try {
			const query = `SELECT user.user_id, username, time_created, path as avatar_path  FROM user LEFT JOIN avatar ON user.user_id=avatar.user_id`;
			const [rows, fields] = await connection.query(query);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getUser = async(req, res) => {
		try {
			const [rows, fields] = await connection.execute('SELECT user.user_id, fullname, username, time_created, path as avatar_path FROM user  JOIN avatar ON user.user_id=avatar.user_id WHERE user.user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.uploadAvatar = async (req, res) => {
		try {
			const query = 'INSERT INTO avatar (user_id, path, mimetype, encoding) VALUES(?, ?, ?, ?)';
			const queryParams = [req.user.user_id, req.file.path, req.file.mimetype, req.file.encoding];
			const [rows, fields] = await connection.execute(query, queryParams);
			res.send({message: 'Avatar uploaded successfully', path: req.file.path});

		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.updateAvatar = async (req, res) => {
		try {
			const query = 'UPDATE avatar SET path=?, mimetype=?, encoding=? WHERE user_id=?';
			const [rows, fields] = await connection.query(query,[req.file.path, req.file.mimetype, req.file.encoding, req.user.user_id])
		} catch(error) {
			res.status(401).json(error);
		}
	}

	module.getUserAvatar = async (req, res) => {
		try {
			const [rows, fields] = await connection.query('SELECT * FROM avatar WHERE user_id=?', [req.params.user_id]);
			res.send(rows);
		} catch(error) {
			res.status(401).json(error);
		}
	}


	return module;
};
