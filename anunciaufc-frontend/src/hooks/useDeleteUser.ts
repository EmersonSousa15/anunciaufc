import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { AxiosError, AxiosPromise } from "axios";
import { api } from "@/service/api";
import { toast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import sucess from "../assets/icons/sucess.svg";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";



const handleDeleteUser = async (token: string): AxiosPromise<{ message: string }> => {
    return await api.delete("/delete_user", {
        headers: {
            Authorization: token,
        },
    })
}


export function useDeleteUser() {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();


    const mutate = useMutation({
        mutationFn: () => handleDeleteUser(token ?? ""),
        onSuccess: () => {
            toast({
                icon: sucess,
                title: "Usuário excluído com sucesso!",
                description: "Seu usuário e anúncios forma excluídos do sistema.",
            })
            onLogout();
            navigate("/");
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    toast({
                        icon: attetion,
                        title: "Anúncio não cadastrado!",
                        description: "Faça login para poder cadastrar um anúncio!",
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
    })


    return mutate;
}