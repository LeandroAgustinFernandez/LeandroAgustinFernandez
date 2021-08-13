const config = require("config");
const JWT = require("jsonwebtoken");

let verificarToken = (req, res, next) => {
  let token = req.get("Token");
  JWT.verify(token, config.get("configToken.SEED"), (err, decoded) => {
    if (err) {
      return res.status(401).json(err);
    }
    // res.send(token);
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = verificarToken;
