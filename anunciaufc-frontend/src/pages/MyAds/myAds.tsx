import { Hero } from "@/components/Hero/hero";
import { Logo } from "@/components/Logo/logo";
import { ProductCard } from "@/components/ProductCard/product-card";
import { TypeProductCard } from "@/components/ProductCard/types/type-product-card";
import { SkeletonCard } from "@/components/SkeletonCard/skeleton-card";
import { useGetMyAds } from "@/hooks/useGetMyAds";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/sem-embalagem.png"
import attetion from "../../assets/icons/attetion.svg";
import failed from "../../assets/icons/failed.svg";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function MyAds() {
    const { onLogout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<TypeProductCard[]>([] as TypeProductCard[]);
    const { data, isLoading, error } = useGetMyAds();

    useEffect(() => {
        if (data?.data) {
            setProducts(data?.data);
        }
    }, [data?.data])

    useEffect(() => {
        if (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    toast({
                        icon: attetion,
                        title: "Sessão inspirada!",
                        description: "Faça login novamente para ver seus anúncios!",
                    })

                    onLogout();
                    navigate("/entrar");
                } else if (error.status === 404) {
                    setProducts([]);
                }
            } else {
                toast({
                    icon: failed,
                    title: "Erro ao carregar anúncios!",
                    description: "Tente novamente mais tarde.",
                })
            }
        }
    }, [error])

    return (
        <>
            <header>
                <div className="bg-white w-screen py-3 pl-2 flex items-center md:hidden">
                    <Logo />
                </div>
                <Hero showImage={false} />
            </header>
            <main className="md: my-10">
                <div className="w-full mt-10">
                    <button onClick={() => navigate("/")} className="absolute left-10">
                        <ArrowLeft color="#00629B" size={30} />
                    </button>
                    <h1 className="text-[#00629B] text-xl text-center w-full">
                        Meus anúncios
                    </h1>
                </div>
                <div className="w-full flex flex-col items-center my-10">
                    <div className="flex w-full gap-5 flex-wrap mb-10 items-center justify-center">
                        {!isLoading && products.length > 0 && products.map((product, index) => {
                            return (
                                <div>
                                    <ProductCard key={index}
                                        image={product.image}
                                        price={product.price}
                                        description={product.description}
                                        campus={product.campus}
                                        date={product.date}
                                        id={product.id}
                                    />

                                    <div>
                                        <button onClick={() => navigate(`/editar-anuncio/${product.id}`)} className="flex items-center justify-center px-5 py-2 mt-2 w-full bg-transparent border rounded-md transition-all delay-150  hover:border-[#00629B] hover:text-[#00629B]">
                                            <Edit2 size={20} className="mr-2" />
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                        {!isLoading && products.length === 0 &&
                            <div className="flex flex-col items-center justify-center m-20 w-full">
                                <img src={empty} alt="Sem estoque" className="w-[200px]" />
                                <p className="text-2xl m-5 font-semibold">Nenhum produto cadastrado no momento!</p>
                            </div>
                        }

                        {isLoading &&
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        }
                    </div>
                </div>
            </main>
        </>
    )
}