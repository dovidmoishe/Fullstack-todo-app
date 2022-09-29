const Joi = require('@hapi/joi')

const RegisterValidation = (data) => {
    const ValidationSchema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, ValidationSchema)
}

const LoginValidation = (data) => {
    const ValidationSchema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, ValidationSchema)
}

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;