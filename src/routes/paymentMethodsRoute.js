import controller from '../controllers/paymentMethodsController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/payments', controller.get)
	app.get('/payments/:id', controller.get)
	app.post('/payments/persist', controller.persist)
	app.post('/payments/destroy',  controller.destroy)
}