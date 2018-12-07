module.exports = (connection) => {
	const module = {};
	module.createPost = async(req, res) => {
		//check if media was uploaded to db successfully
		if (!req.insertedFile.error) {
			if (!req.user) {res.send({message: 'Unautherized authentication required.'});}
			try {
				const categories = JSON.parse(req.body.category);
				if(!Array.isArray(categories)) return res.send({error: 'categories format is incorrect.It should be in array format.'});
				const query = 'INSERT INTO post (title, media, owner) VALUES(?, ?, ?)';
				const queryParams = [req.body.title, req.insertedFile.rows.insertId, req.user.user_id];
				const [rows, fields] = await connection.execute(query, queryParams);
				const q = 'INSERT INTO post_category (post_id, category_id) VALUES ?';
				const qparams = categories.map(category => [rows.insertId, category]);
				await connection.query(q, [qparams]);
				res.send({
					post_id: rows.insertId,
					message: 'New post created successfully!'
				});
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.status(401).json(req.insertedFile.error);
		}
	};

	module.like = async(req, res) => {
		if (req.user) {
			try {
				const query = 'INSERT INTO likes_post (user_id, post_id) VALUES(?, ?)';
				const [rows,fields] = await connection.execute(query,[req.user.user_id, req.params.post_id]);
				res.send({message: 'Posted liked'});
			} catch (error) {
				res.status(401).json(error);
			}
		}
	};

	module.getAllPosts = async(req, res) => {
		try {
			//get all posts
			const query = `SELECT post.*, user.*, media.*, avatar.path as avata_path,  (select count(1) from likes_post where likes_post.post_id=post.post_id group by post_id) as likes 
				FROM post INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner LEFT JOIN avatar ON user.user_id=avatar.user_id`;
			const [rows,fields] = await connection.execute(query);
			rows.forEach(post => {
				post.password = null;
				post.email = null;
			});
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllByUser = async(req, res) => {
		try {
			const query = `SELECT post.*, user.*, media.*, avatar.path as avata_path, (select count(1) from likes_post where likes_post.post_id=post.post_id group by post_id) as likes FROM post 
				LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE post.owner=? ;`;
			const [rows,fields] = await connection.execute(query, [req.params.user_id]);
			rows.forEach(post => {
				post.email = null;
				post.password = null;
			})
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllByCategory = async(req, res) => {
		try {
			const [postIds,p_fields] = await connection.execute('SELECT post_id FROM post_category WHERE category_id=?', [req.params.category_id]);
			if(postIds.length > 0) {
			const query = `SELECT post.*, user.*, media.*, avatar.path as avata_path, (select count(1) from likes_post where likes_post.post_id=post.post_id group by post_id) as likes FROM post 
				LEFT JOIN avatar ON post.owner=avatar.user_id INNER JOIN media ON media.media_id=post.media INNER JOIN user ON user.user_id=post.owner WHERE post.post_id IN  ( `;
			const [rows,fields] = await connection.execute(query + postIds.map(p => p.post_id) + ' ) ');
			rows.forEach(post => {
				post.email = null;
				post.password = null;
			})
			res.send(rows);
			} else {
				res.send([]);
			}
		} catch (error) {
			res.status(error).json(error);
		}
	};

	module.delete = async(req, res) => {
		if (req.user) {
			try {
				const [rows,fields] = await connection.query('DELETE FROM post WHERE post_id=?', [req.params.post_id]);
				res.send(rows);
			} catch (error) {
				res.status(401).json(error);
			}
		} else {
			res.send({message: 'Unautherized authentication required.'});
		}
	};

	return module;
};
