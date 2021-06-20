import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import router from './routes/productos.routes.js'
import routerMsg from './routes/mensajes.routes.js'
import mongoose from 'mongoose'

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

app.use(cookieParser())

const url = 'mongodb+srv://diegodileonforte:*****@cluster0.wnyby.mongodb.net/test?authSource=admin&replicaSet=atlas-2ugqp6-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const options = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(session({
    store: MongoStore.create({
        mongoUrl: url,
        mongoOptions: options,
        ttl: 60 * 10,
    }),
    secret: 'shhhh',
    resave: false,
    saveUninitialized: false
}))

app.get('/login', (req, res) => {
    req.session.user = req.query.user
    if (req.session.user) {
        res.render('login', { name: req.session.user })
        if (!req.session.user) {
            res.redirect('/')
        }
    }
    else {
        res.send(`Error en el Login`)
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({ error: 'Error' })
        } else {
            return setTimeout(() => {
                res.redirect('/')
            }, 2000);
        }
    })
})

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => { console.log('Conectado a Mongo') },
    err => { err }
)

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/productos', router)
app.use('/mensajes', routerMsg)

app.set('views', './public');
app.set('view engine', 'ejs')

//Login con Session

import normalizr from "normalizr"
const normalize = normalizr.normalize
const schema = normalizr.schema
import utils from "util"

import Mensaje from './controllers/Mensaje.js'
const msgClass = new Mensaje()

import Producto from './controllers/Producto.js'
const prodClass = new Producto()

//Chat con Normalizr

const chat = []

io.on('connection', socket => {
    console.log(`Cliente ID:${socket.id} inició conexión`)
    io.sockets.emit('new-message-server', chat)

    socket.on('new-message', async data => {
        const message = await data;
        chat.push(data);
        msgClass.addMsg({ message })
       
        const userSchema = new schema.Entity('users', {}, { idAttribute: 'id', })
        const messagesSchema = new schema.Entity('messages', {
            text: userSchema
        })
        const authorSchema = new schema.Entity('messages', {
            author: userSchema,
            texto: [messagesSchema]
        })

        const normalizedData = normalize(chat, authorSchema)
        console.log(utils.inspect(normalizedData, false, 15, true))

        const originalLength = JSON.stringify(chat).length
        console.log('Longitud de chat riginal', originalLength)        

        const nomalizedLength = JSON.stringify(normalizedData).length
        console.log('Longitud de chat normalizado', nomalizedLength)

        const compressionPerc = (nomalizedLength * 100) / originalLength
        console.log(`Porcentaje de compresión: ${compressionPerc} %`)

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



