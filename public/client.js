const socket = io.connect()

let pantalla = document.getElementById('pantalla')
let botonChat = document.getElementById('btnChat')
botonChat.addEventListener('click', () => { validar() })

function validar() {
    let user = document.getElementById('userMail').value;
    let mensaje = document.getElementById('messageChat').value
    if (mensaje === "" || user === "") {
        alert(`Complete todos los campos`)
    } else {
        let nuevoMensaje = {
            author: {
                id: document.getElementById('userMail').value,
                nombre: document.getElementById('userName').value,
                apellido: document.getElementById('userLastName').value,
                edad: document.getElementById('userAge').value,
                alias: document.getElementById('userAlias').value,
                avatar: document.getElementById('userAvatar').value
            },
            text: document.getElementById('messageChat').value,
        }
        socket.emit('new-message', nuevoMensaje);
        document.getElementById('messageChat').value = ""
    }
}

let date = new Date()
newDate = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear()].join('/') + ' ' +
    [date.getHours(),
    date.getMinutes(),
    date.getSeconds()].join(':')

function renderMessage(data) {
    let html = data.map((elem, i) => {
        return (`
            <div>
            Usuario: <strong style="color:blue">${elem.author.alias}</strong></span>
            (a las <span>${newDate.toString()}</span>)
            dijo: <i style="color:green">${elem.text}</i></div>`);
    }).join(' ');
    document.getElementById('pantalla').innerHTML = html
}

const denormalize = (normalizedChats) => {
    const userSchema = new schema.Entity('users', {}, { idAttribute: 'id', })
    const messagesSchema = new schema.Entity('messages', {
        text: userSchema
    })
    const authorSchema = new schema.Entity('messages', {
        author: userSchema,
        texto: [messagesSchema]
    })

    const denormalizedChats = denormalize(normalizedChats.result, authorSchema, normalizedChats.entities)

    console.log(denormalizedChats)
    
    console.log(JSON.stringify(denormalizedChats).length)
    return denormalizedChats;
}

socket.on('new-message-server', (data) => {
    const denormalizedChat = denormalize(data)
    console.log(denormalizedChat)
    renderMessage(denormalizedChat)
})

document.getElementById('btnForm').addEventListener('click', () => { validarForm() })

function validarForm() {
    let title = document.getElementById('title').value
    let price = document.getElementById('price').value
    let thumbnail = document.getElementById('thumbnail').value
    if (title === "" || price === "" || thumbnail === "") {
        alert(`Complete todos los campos`)
    } else {
        let newProd = {
            title: title,
            price: price,
            thumbnail: thumbnail
        }
        socket.emit('new-producto', newProd)

        document.getElementById('title').value = ""
        document.getElementById('price').value = ""
        document.getElementById('thumbnail').value = ""
    }
}

const fragment = document.createDocumentFragment()
const tabla = document.getElementById('tableProd')
const template = document.getElementById('templateList').content

document.addEventListener('DOMContentLoaded', e => { fetchData() });

const fetchData = async () => {
    const res = await fetch('http://localhost:8080/api/productos')
    const data = await res.json()
    verProdHtml(data)
};

const verProdHtml = data => {
    data.forEach(producto => {

        template.getElementById('prodTitle').textContent = producto.title;
        template.getElementById('prodPrice').textContent = producto.price;
        template.getElementById('prodImg').setAttribute("src", producto.thumbnail)

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    tabla.appendChild(fragment)
};


socket.on('new-prod-server', async data => {
    let array = []
    array.push(await data)
    verProdHtml(array)

})