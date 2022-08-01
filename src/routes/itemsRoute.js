import controller from '../controllers/itemsController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/items', controller.get)
	app.post('/items/persist', controller.persist)
	app.post('/items/destroy', Authenticate, controller.destroy)
}