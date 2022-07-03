const {body} = require('express-validator');
const path = require('path');

const usersMiddleware = [
body('name')
                .notEmpty().withMessage('* Introduce tu nombre completo y apellido').bail()
                .isLength({min: 4}).withMessage('* Ingrese al menos 2 caracteres'),
body('country')
                .notEmpty().withMessage('* Introduzca su país de nacimiento'),
body('email')
                .notEmpty().withMessage('* Introduce tu correo electrónico').bail()
                .isEmail().withMessage('* Introduzca una dirección de correo electrónico válida'),
body('password')
                .notEmpty().withMessage('* Establecer una contraseña').bail()
                .isLength({min: 8}).withMessage('* Su contraseña debe tener al menos 8 caracteres').bail()
]

module.exports = usersMiddleware;
