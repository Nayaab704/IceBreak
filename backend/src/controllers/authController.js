const authService = require('../services/authService');


async function register(req, res) {
  const { email, password, age, username } = req.body;
  try {
    const user = await authService.registerUser(email, password, age, username);
    res.status(201).json(user);
  } catch (error) {
    console.log("Error: ", error)
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const {email, password} = req.body
  console.log(email, password)
  try {
    const user = await authService.loginUser(email, password)
    res.status(201).json(user);
  } catch (error) {
    console.log("Error: ", error)
    res.status(400).json({ error: error.message });
  }
}

async function verifyToken(req, res) {
  const checkToken = req.body.token
  try {
    const user = await authService.logInUserToken(checkToken)
    res.status(201).json(user);
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
}

module.exports = {
  register,
  login,
  verifyToken
};
