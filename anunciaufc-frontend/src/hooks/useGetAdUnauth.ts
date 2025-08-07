import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { api } from "@/service/api";
import { AxiosPromise } from "axios";


export type AdInfo = {
    id: string;
    name: string;
    email: string;
    created_at: string;
}


const handleGetAdUnauth = async (token: string): AxiosPromise<AdInfo[]> => {
    return await api.get<AdInfo[]>("/get_announcement_no_verify", {
        headers: {
            "Authorization": token
        }
    })
}

export function useGetAdUnauth(){
    const { token } = useAuth();

    const query = useQuery({
        queryFn: () => handleGetAdUnauth(token ?? ""),
        queryKey: ["get-ad-unauth"],
        retry: false
    })

    return {
        ...query,
        data: query?.data
    }
}