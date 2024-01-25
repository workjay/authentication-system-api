const Joi = require("joi");

module.exports = {
  signup: Joi.object().keys({
    first_name: Joi.string().required().label("First name"),
    last_name: Joi.string().required().label("Last name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).max(16).required().label("Password"),
    role: Joi.string().valid("admin", "customer").required().label("Role"),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm Password"),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).max(16).required().label("Password"),
    role: Joi.string().valid("admin", "customer").required().label("Role"),
  }),
};
