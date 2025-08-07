import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home/home.tsx";
import { Login } from "../pages/Login/login";
import { ForgetPassword } from "../pages/ForgetPassword/forgetPassword.tsx";
import { Register } from "../pages/Register/register";
import { Products } from "@/pages/Products/produtcs.tsx";
import { AuthRoute } from "@/components/AuthRoute/authRoute.tsx";
import { CreateAd } from "@/pages/CreateAd/createAd.tsx";
import { Product } from "@/pages/Product/Product.tsx";
import { Account } from "@/pages/Account/Account.tsx";
import { MyAds } from "@/pages/MyAds/myAds.tsx";
import { EditAd } from "@/pages/EditAd/EditAd.tsx";
import { AuthAd } from "@/pages/AuthAd/AuthAd.tsx";

export const router = createBrowserRouter([

    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/entrar",
                element: <Login />,
            },
            {
                path: "/registrar",
                element: <Register />,
            },
            {
                path: "/recuperar-senha",
                element: <ForgetPassword />,
            },
            {
                path: "/produtos/:category",
                element: <Products />,
            },
            {
                path: "",
                element: <AuthRoute />,
                children: [
                    {
                        path: "/criar-anuncio",
                        element: <CreateAd />,
                    },
                    {
                        path: "/conta",
                        element: <Account />,
                    },
                    {
                        path: "/meus-anuncios",
                        element: <MyAds />,
                    },
                    {
                        path: "/editar-anuncio/:id",
                        element: <EditAd />,
                    },
                    {
                        path: "/autorizar-anuncios",
                        element: <AuthAd />
                    }
                ],
            },
            {
                path: "/produto/:id",
                element: <Product />
            },
            {
                path: "*",
                element: <h1>Página não encontrada</h1>,
            }
        ]
    }
]);