import controller from '../controllers/cartController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/cart', controller.get)
	app.get('/cart/:id', controller.get)
	app.post('/cart/persist', controller.persist)
}