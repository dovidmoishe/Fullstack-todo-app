const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  jwt.verify(token, process.env.TOKEN,(err,user) => {
    if(err) return res.status(403)

    req.user = user;

    next()
  })
}
