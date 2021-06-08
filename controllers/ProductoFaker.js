import faker from 'faker'
faker.locale = 'es'

const productos = []

export default class ProductoFaker {

    mock(quantity = 10) {
        for (let id = 1; id <= quantity; id++) {
            const title = faker.commerce.productName()
            const price = faker.commerce.price()
            const thumbnail = faker.image.imageUrl()

            productos.push({
                _id: id,
                title: title,
                price: price,
                thumbnail: thumbnail
            })
        }

    }

    mockGenerator = (req, res) => {
        const cantidad = req.params.cant
        this.mock(cantidad)
        res.json(productos)
    }
}