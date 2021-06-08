import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import router from './routes/productos.routes.js'
import routerMsg from './routes/mensajes.routes.js'
import mongoose from 'mongoose'

import Mensaje from './controllers/Mensaje.js'
const msgClass = new Mensaje()

import Producto from './controllers/Producto.js'
const prodClass = new Producto()

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}).then(() => { console.log('Conectado a Mongo') },
    err => { err }
)

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/productos', router)
app.use('/mensajes', routerMsg)


const chat = []

io.on('connection', socket => {
    console.log(`Cliente ID:${socket.id} inició conexión`)
    io.sockets.emit('new-message-server', chat)

    socket.on('new-message', async data => {
        const message = await data;
        chat.push(data);
        msgClass.addMsg({ message })
        io.sockets.emit('new-message-server', chat)
    })

    socket.on('new-producto', async data => {
        const producto = await data;
        prodClass.add({ producto })
        io.sockets.emit('new-prod-server', producto)
    })

})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en puerto: ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))



