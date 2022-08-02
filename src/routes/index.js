import usersRoute from "./usersRoute";
import itemsRoute from "./itemsRoute";
import categoryRoute from "./categoryRoute";
import addressRoute from "./addressRoute";
import paymentMethodsRoute from "./paymentMethodsRoute";


function Routes(app) {
	usersRoute(app);
	itemsRoute(app);
	categoryRoute(app);
	addressRoute(app);
	paymentMethodsRoute(app);
}

export default Routes;