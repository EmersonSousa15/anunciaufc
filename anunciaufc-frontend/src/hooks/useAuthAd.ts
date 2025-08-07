import { api } from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export type dataAuthAd = {
    id: string;
    email: string;
    status: string;
}


const handleAuthAd = async (data: dataAuthAd, token: string) => {
    return await api.put("/verify_annoucement", { ...data }, {
        headers: {
            Authorization: token
        }
    })
}



export function useAuthAd() {
    const { token } = useAuth();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: dataAuthAd) => handleAuthAd(data, token ?? ""),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["get-ad-unauth"]
            })
        }
    })


    return mutation;
}