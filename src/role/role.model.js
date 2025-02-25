import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "El Role es obiligatorio"]
    }
});

export default mongoose.model("Role", RoleSchema);