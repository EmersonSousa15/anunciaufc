import { api } from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosPromise } from "axios";
import { useAuth } from "./useAuth";
import { EditUser } from "@/pages/Account/Account";
import { toast } from "./use-toast";
import sucess from "../assets/icons/sucess.svg";
import attetion from "../assets/icons/attetion.svg";
import failed from "../assets/icons/failed.svg";
import { useNavigate } from "react-router-dom";


async function handleEditUser(data: EditUser, token: string): AxiosPromise<EditUser> {
    return await api.put<EditUser>('/update_user', { ...data }, {
        headers: {
            'Authorization': token
        }
    });
}


export function useEditUser() {
    const { token, onLogout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: (data: EditUser) => handleEditUser(data, token ?? ""),
        onSuccess: () => {
            toast({
                icon: sucess,
                title: "Usuário atualizado!",
                description: "Seus dados foram atualizados com sucesso.",
            });

            queryClient.refetchQueries({
                queryKey: ["get-user"],
            })
        },
        onError: (error) => {
            console.log(error);


            if (error instanceof AxiosError) {

                if (error.response?.status === 401) {
                    toast({
                        icon: attetion,
                        title: "Token inválido!",
                        description: "Faça login para poder editar seus dados!",
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