import db from './db.js'

const createUser = async(name, email, passwordHash) => {
	const defaultRole = 'user'
	const result = await db.query(`
		INSERT INTO users (name, email, password_hash, role_id)
		SELECT $1, $2, $3, role_id
		FROM roles
		WHERE role_name = $4
		RETURNING user_id;
	`, [name, email, passwordHash, defaultRole])

	if (!result.rows.length) {
		throw new Error('Failed to create user')
	}

	if (process.env.ENABLE_SQL_LOGGING === 'true') {
		console.log('Created new user with ID:', result.rows[0].user_id)
	}

	return result.rows[0].user_id
}

export { createUser }
