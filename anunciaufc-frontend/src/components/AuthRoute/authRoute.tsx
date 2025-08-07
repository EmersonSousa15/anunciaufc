import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Navigate, Outlet } from "react-router-dom";

import attetion from "../../assets/icons/attetion.svg"


export const AuthRoute = () => {
    const { isLoading, token } = useAuth();

    if (!token && !isLoading) {
        toast({
            icon: attetion,
            title: "Acesso negado!",
            description: "Faça login para continuar!"
        })

        return <Navigate to="/entrar" replace />;
    }

    return (
        <Outlet />
    )

}