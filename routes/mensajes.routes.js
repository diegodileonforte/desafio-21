import express from 'express'
import Mensaje from '../controllers/Mensaje.js'
const routerMsg = express.Router()
const mensaje = new Mensaje()

routerMsg.post('/', mensaje.addMsg)
routerMsg.get('/', mensaje.findAllMsg)

export default routerMsg