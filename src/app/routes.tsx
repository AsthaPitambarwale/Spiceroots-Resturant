import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/pages/Home";
import { Menu } from "./components/pages/Menu";
import { Cart } from "./components/pages/Cart";
import { Checkout } from "./components/pages/Checkout";
import { OrderTracking } from "./components/pages/OrderTracking";
import { Profile } from "./components/pages/Profile";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { Reservations } from "./components/pages/Reservations";
import { Offers } from "./components/pages/Offers";
import { Notifications } from "./components/pages/Notifications";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminLogin } from "./components/admin/AdminLogin";
import { ManageFoods } from "./components/admin/ManageFoods";
import { ManageCategories } from "./components/admin/ManageCategories";
import { ManageOrders } from "./components/admin/ManageOrders";
import { ManageCustomers } from "./components/admin/ManageCustomers";
import { SalesReports } from "./components/admin/SalesReports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "menu", Component: Menu },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "orders", Component: OrderTracking },
      { path: "reservations", Component: Reservations },
      { path: "offers", Component: Offers },
      { path: "notifications", Component: Notifications },
      { path: "profile", Component: Profile },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        Component: AdminLogin,
      },

      {
        path: "dashboard",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "foods", Component: ManageFoods },
          { path: "categories", Component: ManageCategories },
          { path: "orders", Component: ManageOrders },
          { path: "customers", Component: ManageCustomers },
          { path: "reports", Component: SalesReports },
        ],
      },
    ],
  }
]);
