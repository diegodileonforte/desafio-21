import MensajeDAO from '../models/mensajeSchema.js'

class Mensaje {

    constructor() { }

    async addMsg(req, res) {
        try {
            if (!req) {
                return res.status(404).json({ mensaje: 'Error al publicar tu mensaje' })
            }
            const data = await { ...req }
            await MensajeDAO.create(data)
        } catch (error) {
            console.log(error)
        }
    }

    async findAllMsg(req, res) {
        try {
            let msgInDb = await MensajeDAO.find();
            return res.status(200).json(msgInDb);
        } catch (error) {
            return res.status(400).json({ mensaje: 'Ocurrió un error', error })
        }
    }
}

export default Mensaje