import controller from '../controllers/categoryesController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/category', controller.get)
	app.post('/category/persist', controller.persist)
	app.post('/category/destroy', Authenticate, controller.destroy)
}