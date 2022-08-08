import usersRoute from "./usersRoute";
import itemsRoute from "./itemsRoute";
import categoryRoute from "./categoryRoute";
import addressRoute from "./addressRoute";
import paymentMethodsRoute from "./paymentMethodsRoute";
import ordersRoute from "./ordersRoute";
import cartRoute from "./cartRoute";


function Routes(app) {
	usersRoute(app);
	itemsRoute(app);
	categoryRoute(app);
	addressRoute(app);
	paymentMethodsRoute(app);
	ordersRoute(app);
	cartRoute(app);
}

export default Routes;