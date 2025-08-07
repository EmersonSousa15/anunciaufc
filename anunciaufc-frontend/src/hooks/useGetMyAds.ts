import { TypeProductCard } from "@/components/ProductCard/types/type-product-card";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosPromise } from "axios";
import { useAuth } from "./useAuth";



async function handleGetMyAds(token: string): AxiosPromise<TypeProductCard[]> {
    return await api.get<TypeProductCard[]>("/my_announcements", {
        headers: {
            Authorization: token,
        }
    });
}


export function useGetMyAds() {
    const { token } = useAuth();

    const query = useQuery({
        queryFn: () => handleGetMyAds(token ?? ""),
        queryKey: ["get-my-ads"],
        retry: false
    })


    return query;
}