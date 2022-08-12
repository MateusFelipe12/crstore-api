import controller from '../controllers/cartController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/cart', controller.get)
	app.get('/cart/:id', controller.get)
	app.post('/cart/persist', controller.persistCart)
	app.post('/cart/remove', controller.persistItensCart)
	app.post('/cart/destroy', controller.destroyCart)


}