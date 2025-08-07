import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosPromise } from "axios";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";
import { Product } from "@/types/product";

const handleGetAd = async (id: string, token: string): AxiosPromise<Product> => {
    return await api.get<Product>(`/get_announcement?id=${id}`, {
        headers: {
            Authorization: `${token}`,
        },
    });
}

export function useGetAd(id: string) {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();


    const query = useQuery({
        enabled: !!token,
        queryFn: () => handleGetAd(id, token ?? ""),
        queryKey: ["get-ad", id],
    })

    if (query.error) {
        if (query.error instanceof AxiosError) {

            if (query.error.status === 401) {
                toast({
                    icon: attetion,
                    title: "Sessão inspirada!",
                    description: "Faça login novamente para ver seus anúncios!",
                })

                onLogout();
                navigate("/entrar");
            }
        } else {
            toast({
                icon: failed,
                title: "Erro ao atualizar o usuário!",
                description: "Tente novamente mais tarde.",
            })
        }
    }


    return query;
}
