export const validarRol = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: "Valide el token antes de verificar el Role"
            });
        }

        const { role } = req.usuario;
        
        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                msg: `Usuario no autorizado, Posee el Rol de ${req.usuario.role}, y los roles autorizados son ${roles}`
            });
        }

        next();
    }
};