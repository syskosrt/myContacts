const Contact = require('../models/Contact');

exports.findByUser = async (userId) => {
  return Contact.find({ user: userId });
};

exports.create = async (data) => {
  const contact = new Contact(data);
  return contact.save();
};

exports.update = async (id, userId, data) => {
  const contact = await Contact.findOne({ _id: id, user: userId });
  if (!contact) return null;
  if (data.firstName !== undefined) contact.firstName = data.firstName;
  if (data.lastName !== undefined) contact.lastName = data.lastName;
  if (data.phone !== undefined) contact.phone = data.phone;
  return contact.save();
};

exports.delete = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, user: userId });
};

