import mongoose from 'mongoose'
const Schema = mongoose.Schema

const mensajeSchema = new Schema({
    message : {
        user: { type: String },
        mensaje: { type: String }
    }
})

const MensajeDAO = mongoose.model('MensajeDAO', mensajeSchema)
export default MensajeDAO