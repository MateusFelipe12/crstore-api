import controller from '../controllers/usersController'
import Authenticate from '../utils/Authenticate'

export default (app) => {
	app.get('/users', controller.get)
	app.post('/users/register', controller.register)
	app.post('/users/login', controller.login)
<<<<<<< HEAD
	app.post('/users/verification' ,controller.update)
	app.post('/users/newpassword' ,controller.newPassword)
	app.post('/users/validation/typeuser' ,controller.validUser)

}
=======
	app.post('/users/update' ,controller.update)
}	
>>>>>>> 432244cbd69aba346b9ff0086c01e647e33e72f1
