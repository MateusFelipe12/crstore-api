import controller from '../controllers/itemsController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/items', controller.get)
	app.get('/items/:id', controller.get)
	app.post('/items/persist', controller.persist)
	app.post('/items/destroy', controller.destroy)
}