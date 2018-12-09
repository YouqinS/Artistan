/* This is controller module for followers/following data
* This module performs CRUDE operation to database on follower table only
*/

module.exports = (connection) => {

	const module = {};

	module.getAllFollowing = async(req, res) => {

		try {
			const [rows, _] = await connection.execute('SELECT * FROM follower WHERE followed_id=?',[req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.getAllFollowed = async(req, res) => {

		try {
			const [rows, _] = await connection.execute('SELECT * FROM follower WHERE follower_id=?',[req.params.user_id]);
			res.send(rows);
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.addFollower = async(req, res) => {

		try {
			const [r, _] = await connection.query('SELECT * FROM follower WHERE follower_id=? AND followed_id=?', [req.user.user_id, req.params.to_user_id]);
			console.log(r);
			if (r.length === 0) {
				await connection.query('INSERT INTO follower VALUES(?,?)', [req.user.user_id, req.params.to_user_id]);
				res.send({message: 'Follower inserted'});
			} else {
				res.send({message: 'Follower already exist'});
			}
		} catch (error) {
			res.status(401).json(error);
		}
	};

	module.deleteFollower = async(req, res) => {
		try {
			await connection.query('DELETE FROM follower WHERE follower_id=? AND followed_id=?', [req.user.user_id, req.params.to_user_id]);
			res.send({message: 'Follower deleted'});
		} catch (error) {
			res.status(401).json(error);
		}
	};

	return module;
};
