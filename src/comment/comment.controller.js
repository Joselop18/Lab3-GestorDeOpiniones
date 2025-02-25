import User from "../users/user.model.js";
import Post from "../posts/post.model.js";
import Comment from "../comment/comment.model.js";

export const saveComment = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findById(req.usuario._id); 
        const post = await Post.findById(data.postId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No se encontro este usuario"
            });
        }

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "No se encontro la publicacion"
            });
        }

        const comment = new Comment({
            content: data.content,
            keeperUser: user._id,
            keeperPost: post._id,
            status: true
        });

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comentario creado",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al guardar el comentario",
            error
        });
    }
}

export const getComments = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};
    try {
        const comments = await Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
            
        const commentsWithOwnerNames =  await Promise.all(comments.map(async (comment) =>{
            const owner = await User.findById(comment.keeperUser);
            const post = await Post.findById(comment.keeperPost)
            return{
                ...comment.toObject(),
                keeperUser: owner ? owner.nombre: "No se encontro este usuario",
                keeperPost: post ? post.title: "No se encontro la publicacion"
            }
        }));
        
        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments: commentsWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el comentario",
            error
        })
    }
}

export const searchComment = async (req, res) =>{
    const {id} = req.params;

    try {
        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "No se encontro el comentario"
            })
        }

        const owner = await User.findById(comment.keeperUser);

        res.status(200).json({
            success: true,
            comment: {
                ...comment.toObject(),
                keeperUser: owner ? owner.name : "No se encontro el creador"
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el comentario",
            error
        })
    }
}

export const deleteComment = async(req, res) => {
    const {id} = req.params;
    try {

        const comment = await Comment.findByIdAndUpdate(id, { status: false });        

        if (req.usuario.role === "USER_ROLE" && comment.keeperUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No autorizado para modificar este comentario" 
            });
        }
        
        if (!comment) {
            return res.status(404).json({
                 success: false, 
                 msg: "No se encontro el comentario" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Se pudo eliminar el comentario"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario",
            error
        })
    }

}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, keeper, ...data } = req.body; 

        const comment = await Comment.findByIdAndUpdate(id, data, { new: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "No se pudo encontral el comentario"
            });
        }

        if (req.usuario.role === "USER_ROLE" && comment.keeperUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "No autorizado para modificar este comentario" 
            });
        }

        res.status(200).json({
            success: true,
            msg: "Comentario regenerado",
            comment
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "No se pudo actualizar el comentario",
            error
        });
    }
}