import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Filter } from "./components/filter-dialog"
import { FilterParams } from "@/types/product"
import { api } from "@/service/api"
import { ProductCard } from "@/components/ProductCard/product-card"
import { SkeletonCard } from "@/components/SkeletonCard/skeleton-card"
import { toast } from "@/hooks/use-toast"

import atettion from "../../assets/icons/attetion.svg"
import failed from "../../assets/icons/failed.svg"

import empty from "../../assets/sem-embalagem.png"
import { TypeProductCard } from "@/components/ProductCard/types/type-product-card"


export const Products = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = (value: boolean) => {
        setOpenFilter(value);
    }

    const [filterParams, setFilterParams] = useState<FilterParams>({
        campus: "",
        state: "",
        order_az: false,
        order_price: false,
    } as FilterParams);

    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<TypeProductCard[]>([] as TypeProductCard[]);

    const handleGetFilterProdutcs = async () => {
        const category = params.category === "Ver todos" ?
            "" :
            params.category?.
                toLowerCase().
                normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim()
                .replace(/\s+/g, "-")



        try {
            setIsLoading(true);
            const response = await api.get(`/products?category=${category}&campus=${filterParams?.campus}&state=${filterParams.state}&order_az=${filterParams?.order_az}&order_price=${filterParams?.order_price}`)


            if (response.status === 200) {
                setProducts(response.data);

                if (response.data.length === 0) {
                    toast({
                        icon: atettion,
                        title: "Nenhum produto encontrado!",
                        description: "Tente novamente com outras palavras-chave ou categorias."
                    })
                }
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
        handleGetFilterProdutcs();
    }, [filterParams])

    return (
        <>
            <header className="w-screen shadow-md flex justify-center items-center">
                <div className="w-[500px] flex px-5 m-3 border-2 rounded-full items-center">
                    <button>
                        <Search color="#969696" />
                    </button>
                    <input type="text" className="w-full p-1" placeholder="Pesquise aqui" />
                </div>
            </header>
            <main className="flex flex-wrap justify-center">
                <div className="w-[90%] mt-10 flex justify-between">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft color="#00629B" size={30} />
                    </button>
                    <h1 className="text-[#00629B] text-xl">
                        {params.category}
                    </h1>
                    <button onClick={() => setOpenFilter(true)}>
                        <SlidersHorizontal color="#00629B" size={25} />
                    </button>
                </div>
                <section className="flex w-full mt-10 mb-10 gap-5 flex-wrap items-center justify-center">
                    {!isLoading && products.map((product, index) => {
                        return (
                            <ProductCard key={index}
                                image={product.image}
                                price={product.price}
                                description={product.description}
                                campus={product.campus}
                                date={product.date}
                                id={index + 1}
                            />
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
                </section>

                {openFilter &&
                    <Filter openFilter={openFilter} handleOpenFilter={handleOpenFilter} setFilterParams={setFilterParams} filterParams={filterParams} />
                }
            </main>


        </>
    )
}