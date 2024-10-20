const Joi = require("@hapi/joi");

//Register validation

const registerValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

//Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};


//exporting the module
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
