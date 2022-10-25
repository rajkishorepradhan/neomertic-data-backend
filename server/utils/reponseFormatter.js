module.exports = (code, message, data, res) => {
	res.statusCode = code;
	res.statusMessage = message;
	return res.json({ code, message, data });
};
