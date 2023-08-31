import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import SecondaryLayout from "../layout/SecondaryLayout";
import Sales from "../pages/Sales/Sales";
import ForgetPassword from "../pages/authentication/ForgetPassword";
import Login from "../pages/authentication/Login";
import ResetPassword from "../pages/authentication/ResetPassword";
import Customer from "../pages/customer/Customer";
import CustomerForm from "../pages/forms/CustomerForm";
import EditProfile from "../pages/forms/EditProfile";
import InventoryForm from "../pages/forms/InventoryForm";
import MoneyOwedForm from "../pages/forms/MoneyOwedForm";
import SalesForm from "../pages/forms/SalesForm";
import SalesFormView from "../pages/forms/SalesFormView";
import Home from "../pages/home/Home";
import Inventory from "../pages/inventory/Inventory";
import Money from "../pages/money/Money";
import Profile from "../pages/profile/Profile";
import PrivateRouter from "./PrivateRouter";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouter>
        <Layout></Layout>
      </PrivateRouter>
    ),
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/customer",
        element: <Customer></Customer>,
      },

      {
        path: "/inventory",
        element: <Inventory></Inventory>,
      },
      {
        path: "/moneyOwed",
        element: <Money></Money>,
      },
      {
        path: "/sales",
        element: <Sales></Sales>,
      },

      {
        path: "/inventory-add",
        element: <InventoryForm></InventoryForm>,
      },
      {
        path: "/inventory-edit",
        element: <InventoryForm></InventoryForm>,
      },
      {
        path: "/sales-add",
        element: <SalesForm></SalesForm>,
      },
      {
        path: "/sales-edit",
        element: <SalesFormView></SalesFormView>,
      },
      {
        path: "/customer-add",
        element: <CustomerForm></CustomerForm>,
      },
      {
        path: "/customer-edit",
        element: <CustomerForm></CustomerForm>,
      },

      {
        path: "/moneyOwed-add",
        element: <MoneyOwedForm></MoneyOwedForm>,
      },
      {
        path: "/moneyOwed-edit",
        element: <MoneyOwedForm></MoneyOwedForm>,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRouter>
        <SecondaryLayout></SecondaryLayout>
      </PrivateRouter>
    ),
    children: [
      {
        path: "/store-profile",
        element: <Profile></Profile>,
      },
      {
        path: "/edit-store-profile",
        element: <EditProfile></EditProfile>,
      },
    ],
  },
  // {
  //   path: "/register",
  //   element: <Register></Register>,
  // },
  {
    path: "/login",
    element: <Login></Login>,
  },

  {
    path: "/forget-password",
    element: <ForgetPassword></ForgetPassword>,
  },
  {
    path: "/eyJhbGciOiJIUzI1NiIsInR5/:email",
    element: <ResetPassword></ResetPassword>,
  },
  {
    path: "*",
    element: (
      <h2 className="font-black py-6 text-3xl text-red-600 text-center">
        Page Not Found!
      </h2>
    ),
  },
]);
