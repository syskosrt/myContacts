const User = require('../models/User');

exports.findUserByEmail = async (email) => {
  return User.findOne({ email });
};

exports.createUser = async (email, hashedPassword) => {
  const user = new User({ email, password: hashedPassword });
  return user.save();
};

