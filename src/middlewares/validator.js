import { body } from 'express-validator';
import { validarCampos } from './validar-campos.js';
import { existenteEmail } from '../helpers/db-validator.js';
 
export const registerValidator = [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('surname', "El segundo nombre es requerido").not().isEmpty(),
    body('email', "Agregue un email valido").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "La contraseña debe contener como minimo 6 caracterizticas").isLength({min: 6}),
    validarCampos
]
 
export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un email valido"),
    body ("username").optional().isString().withMessage("Ingrese un usuario valido"),
    body("password", "Ingrese contraseña que contenga como minimo 6 caracterizticas").isLength({min: 6}),
    validarCampos
]