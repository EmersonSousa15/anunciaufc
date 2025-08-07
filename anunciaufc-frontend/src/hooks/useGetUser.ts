import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosPromise } from "axios";
import { User } from "@/types/user";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";

const handleGetUser = async (token: string): AxiosPromise<User> => {
    return await api.get<User>("/get_user", {
        headers: {
            Authorization: `${token}`,
        },
    });
}

export function useGetUser() {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();


    const query = useQuery({
        enabled: !!token,
        queryFn: () => handleGetUser(token ?? ""),
        queryKey: ['get-user'],
    })

    if (query.error) {
        if (query.error instanceof AxiosError) {

            if (query.error.status === 401) {
                toast({
                    icon: attetion,
                    title: "Falha ao buscar usuário",
                    description: "Faça login para poder ver o usuário!",
                })

                onLogout();
                navigate("/entrar");
            }
        } else {
            toast({
                icon: failed,
                title: "Erro ao ver o usuário!",
                description: "Tente novamente mais tarde.",
            })
        }
    }


    return query;
}
