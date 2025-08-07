import { Hero } from "../../components/Hero/hero"
import { Logo } from "@/components/Logo/logo"
import { CategoriesCard } from "./components/categories-card";
import { ProductCard } from "@/components/ProductCard/product-card";
import { useEffect, useState } from "react";
import { api } from "@/service/api";
import { toast } from "@/hooks/use-toast";

import failed from "../../assets/icons/failed.svg"
import { Link } from "react-router-dom";
import { SkeletonCard } from "@/components/SkeletonCard/skeleton-card";

import empty from "../../assets/sem-embalagem.png"
import { TypeProductCard } from "@/components/ProductCard/types/type-product-card";

export const Home = () => {
    const categories = [
        {
            image: "/src/assets/categories/moveis.svg",
            label: "Casa & Mobilia",
            route: "produtos/Casa Mobilia"
        },
        {
            image: "/src/assets/categories/eletrodomestico.svg",
            label: "Eletrodomésticos",
            route: "produtos/Eletrodomésticos"
        },
        {
            image: "/src/assets/categories/imoveis.svg",
            label: "Imóveis",
            route: "produtos/Imóveis"
        },
        {
            image: "/src/assets/categories/vestiario.svg",
            label: "Vestuário",
            route: "produtos/Vestuário"
        },
        {
            image: "/src/assets/categories/eletronicos.svg",
            label: "Eletrônicos",
            route: "produtos/Eletrônicos"
        },
        {
            image: "/src/assets/categories/livros.svg",
            label: "Livros",
            route: "produtos/Livros"
        },
        {
            image: "/src/assets/categories/acessorios.svg",
            label: "Acessórios",
            route: "produtos/Acessórios"
        },
        {
            image: "/src/assets/categories/outros.svg",
            label: "Outros",
            route: "produtos/Outros"
        }
    ];
    const [products, setProducts] = useState<TypeProductCard[]>([] as TypeProductCard[]);
    const [isLoading, setIsLoading] = useState(false);

    const getProducts = async () => {
        try {
            setIsLoading(true);

            const response = await api.get("/home")

            if (response.status === 200) {
                const products = await response?.data

                setProducts(products);
            }
        } catch (error) {
            toast({
                icon: failed,
                title: "Erro ao carregar os produtos",
                description: "Por favor, tente novamente mais tarde."
            })
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getProducts();
    }, [])




    return (
        <>
            <header>
                <div className="bg-white w-screen py-3 pl-2 flex items-center md:hidden">
                    <Logo />
                </div>
                <Hero showImage={true}/>
            </header>
            <main className="w-[95%] h-screen m-auto my-10">
                <div className="w-full mt-4 flex flex-col justify-center">
                    <div className="w-full">
                        <p className="text-[#00629B] font-semibold text-2xl ml-5 mb-2 text-left">Categorias</p>
                    </div>

                    <div className="flex w-full 2xl:justify-center items-center overflow-x-auto whitespace-nowrap scrollbar-hidden py-2">
                        <div className="flex">
                            {categories.map((category, index) => {
                                return (
                                    <CategoriesCard key={index} image={category.image} label={category.label} route={category.route} />
                                )
                            })}
                        </div>
                    </div>
                </div>
                <section>
                    <div className="flex justify-between items-center my-2">
                        <p className="text-[#00629B] font-semibold text-2xl ml-5 mb-2 text-left">Anúncios</p>
                        <Link to="/produtos/Ver todos" className="text-[#00629B] text-md underline cursor-pointer ml-5 mb-2 text-left">Ver todos</Link>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        <div className="flex w-full gap-5 flex-wrap mb-10 items-center justify-center">
                            {!isLoading && products.length > 0 && products.map((product, index) => {
                                return (
                                    <ProductCard key={index}
                                        image={product.image}
                                        price={product.price}
                                        description={product.description}
                                        campus={product.campus}
                                        date={product.date}
                                        id={product.id}
                                    />
                                )
                            })}

                            { !isLoading && products.length === 0 &&
                                <div className="flex flex-col items-center justify-center m-20 w-full">
                                    <img src={empty} alt="Sem estoque" className="w-[200px]"/>
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
                </section>
            </main>
        </>
    )
}
