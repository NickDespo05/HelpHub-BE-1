const Account = require("../models/memberAccount");
const jwt = require("json-web-token");

async function defineCurrentUser(req, res, next) {
  try {
    console.log(req.headers);
    if (req.headers.authorization) {
      const [method, token] = req.headers.authorization.split(" ");
      if (method == "Bearer") {
        const result = await jwt.decode(process.env.JWT_SECRET, token);
        console.log(result);
        const { id } = result.value;
        let user = await Account.findOne({ _id: id });
        req.currentUser = user;
      }
    }
    next();
  } catch (err) {
    req.currentUser = null;
    console.log(err);
    next();
  }
}

module.exports = defineCurrentUser;
