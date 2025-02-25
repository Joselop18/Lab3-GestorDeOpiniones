import {hash, verify} from "argon2";
import Usuario from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    
    const {email,password, username} = req.body;

    try {


        const user = await Usuario.findOne({
            $or: [{email},{username}]
        })

        if(!user){
            return res.status(400).json({
                msg: "Informarcion personal incorrecto"
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: "Usuario no existe en base de datos"
            }); 
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Contraseña Incorrecta"
            })
        }

        const token = await generarJWT(user.id);
        
        res.status(200).json({
            msg: "Inicio Sesion Excelente!",
            userDetails: {
                username: user.username,
                token: token
            }
        })

        
    } catch (error) {
        console.log(e);
        res.status(500).json({
            msg: 'Server Error',
            error: e.message
        })
    }
}

export const register  = async (req, res) => {
    try {
        const data = req.body;

        if (data.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Permiso no validos para registrarte como administrador"
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role || "USER_ROLE"
        })

        return res.status(201).json({
            message: "User Register Successfully",
            userDetails:{
                user: user.email
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "User Registration Failed",
            error: error.message
        })
    }
}