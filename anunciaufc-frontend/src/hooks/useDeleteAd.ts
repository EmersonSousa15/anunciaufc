import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { AxiosError, AxiosPromise } from "axios";
import { api } from "@/service/api";
import { toast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import sucess from "../assets/icons/sucess.svg";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";



const handleDeleteAd = async (id: string, token: string): AxiosPromise<{ message: string }> => {
    return await api.delete("/delete_announcement", {
        headers: {
            Authorization: token,
        },
        data: {
            announcementId: id
        }
    })
}


export function useDeleteAd(id: string) {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: () => handleDeleteAd(id, token ?? ""),
        onSuccess: () => {
            toast({
                icon: sucess,
                title: "Usuário excluído com sucesso!",
                description: "Seu anúncio foi excluído do sistema.",
            })

            queryClient.invalidateQueries({
                queryKey: ["get-my-ads", "get-ad"]
            })

            navigate("/meus-anuncios");
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    toast({
                        icon: attetion,
                        title: "Anúncio não excluído!",
                        description: "Faça login para poder cadastrar um anúncio!",
                    })

                    onLogout();
                    navigate("/entrar");
                }
            } else {
                toast({
                    icon: failed,
                    title: "Erro ao excluir o anúncio!",
                    description: "Tente novamente mais tarde.",
                })
            }
        }
    })


    return mutate;
}