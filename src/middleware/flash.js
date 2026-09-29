const flashMiddleware = (req, res, next) => {
	if (!req.session) {
		throw new Error('Session is not initialized. Ensure express-session is mounted before flash middleware.')
	}

	req.flash = (type, message) => {
		if (!req.session.flash) {
			req.session.flash = {}
		}

		if (typeof message === 'undefined') {
			const messages = req.session.flash[type] || []
			delete req.session.flash[type]
			return messages
		}

		if (!Array.isArray(req.session.flash[type])) {
			req.session.flash[type] = []
		}

		req.session.flash[type].push(message)
		return req.session.flash[type]
	}

	res.locals.flash = req.flash
	next()
}

export default flashMiddleware
