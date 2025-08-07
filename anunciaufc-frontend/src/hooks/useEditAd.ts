import { api } from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";
import sucess from "../assets/icons/sucess.svg";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";


async function handleEditAd(data: any, token: string) {
    return await api.put<Product>('/update_announcement', data, {
        headers: {
            'Authorization': token,
            "Content-Type": "multipart/form-data"
        }
    });
}

export function useEditAd() {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: (data: any) => handleEditAd(data, token ?? ""), // Certifique-se de que o token não seja vazio
        onSuccess: () => {
            toast({
                icon: sucess,
                title: "Anúncio atualizado!",
                description: "Seu anúncio foi atualizado com sucesso.",
            });

            queryClient.refetchQueries({
                queryKey: ["get-my-ads", "get-ad"],
            });

            navigate("/meus-anuncios")
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                // Verifica se a resposta de erro foi 404 (não autorizado ou não encontrado)
                if (error.response?.status === 401) {
                    toast({
                        icon: attetion,
                        title: "Anúncio não editado!",
                        description: "Faça login para poder editar um anúncio!",
                    });

                    // Logout do usuário e redirecionamento para a página de login
                    onLogout();
                    navigate("/entrar");
                } else {
                    // Caso de outros erros da API
                    toast({
                        icon: failed,
                        title: "Erro ao atualizar o anúncio!",
                        description: "Tente novamente mais tarde.",
                    });
                }
            } else {
                // Caso o erro não seja do tipo AxiosError
                toast({
                    icon: failed,
                    title: "Erro ao atualizar o anúncio!",
                    description: "Tente novamente mais tarde.",
                });
            }
        },
    });

    return mutate;
}
