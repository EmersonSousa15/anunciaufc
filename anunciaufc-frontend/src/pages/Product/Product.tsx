import { Logo } from "@/components/Logo/logo"
import attetion from "../../assets/icons/attetion.svg"

import whatsApp from "../../assets/icons/whatsapp-logo-thin-svgrepo-com.svg"
import { ChevronLeft, ExternalLink, PhoneIncoming } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Hero } from "@/components/Hero/hero"
import { Product as TypeProduct } from "@/types/product"
import { useEffect, useState } from "react"
import { api } from "@/service/api"
import { Loading } from "@/components/Loading/loading"
import { CarouselProduct } from "./components/carousel-product"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export const Product = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState<TypeProduct>({} as TypeProduct);


    useEffect(() => {
        handleGetAnnouncement()
    }, [])

    const handleGetAnnouncement = async () => {
        try {
            const response = await api.get(`/get_announcement?id=${id}`)

            if (response.status === 200) {
                const product = await response.data

                console.log(product.images);

                setProduct(product)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }


    const handleSendMessage = async () => {
        if (token) {
            const telefone = product?.user_telephone.replace(/[()\-\s]/g, '');
            const mensagem = encodeURIComponent(`Olá, gostaria de saber mais sobre o ${product?.title} que você anunciou no ANUNCIAUFC!`);

            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            const url = isMobile
                ? `https://api.whatsapp.com/send?phone=55${telefone}&text=${mensagem}`
                : `https://web.whatsapp.com/send?phone=55${telefone}&text=${mensagem}`;

            window.open(url, '_blank');
        } else {
            toast({
                icon: attetion,
                title: "Indisponível",
                description: 'Para ter acesso a esta função efetue crie uma conta e efetue login.'
            })
        }
    };

    const handleCall = () => {
        if (token) {
            const telefone = product?.user_telephone.replace(/[()\-\s]/g, '');
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                window.open(`tel:+55${telefone}`, '_self');
            } else {
                toast({
                    icon: attetion,
                    title: "Indisponível",
                    description: 'Para ter acesso a esta função entre pelo seu dispositivo smartphone.'
                })
            }
        } else {
            toast({
                icon: attetion,
                title: "Indisponível",
                description: 'Para ter acesso a esta função efetue crie uma conta e efetue login.'
            })
        }
    };




    if (isLoading) {
        return (
            <main className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </main>
        )
    }


    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate()}/${d.getUTCMonth() < 10 ? "0" + d.getUTCMonth() : d.getUTCMonth()}/${d.getUTCFullYear()},`;
    };

    return (
        <>
            <header>
                <div className="bg-white shadow-md w-screen py-3 pl-2 flex items-center md:hidden">
                    <Logo />
                </div>
                <Hero showImage={false} />
            </header>
            <main className="flex justify-center">
                <section className="pb-20 md:h-[650px] md:pb-0 md:flex md:justify-center md:mt-20 md:max-w-[90%]">
                    <div className="md:h-full md:mt-8 w-[500px] flex flex-col items-center">
                        <div className="absolute z-50 w-full px-10 top-20 md:static md:px-0 md:w-[400px] flex justify-between items-center">
                            <button onClick={() => navigate(-1)} className="w-10 h-10 border shadow-md p-1 bg-white rounded-full flex items-center justify-center">
                                <ChevronLeft color="#00629B" size={25} />
                            </button>
                            <button onClick={() => navigate(-1)} className="w-10 h-10 border shadow-md p-1 bg-white rounded-full flex items-center justify-center">
                                <ExternalLink color="#00629B" size={23} />
                            </button>
                        </div>
                        <CarouselProduct images={product?.images} />
                    </div>
                    <article className="mx-10 md:min-w-[350px]">
                        <div className="ml-1 my-2 md:flex md:items-center md:justify-between md:mt-5">
                            <h1 className="text-[#00629B] text-2xl mt-5">
                                {product?.title}
                            </h1>
                            <p className="text-[#00629B] text-2xl font-bold md:mt-5">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product?.price) / 100)}
                            </p>
                        </div>
                        <hr />
                        <div className="ml-1 my-5">
                            <label htmlFor="" className="text-[#00629B] text-md">Descrição</label>
                            <p className="text-justify">
                                {product?.description}
                            </p>
                        </div>
                        <hr />
                        <div className="ml-1 my-5">
                            <label htmlFor="" className="text-[#00629B] text-md">Informações</label>
                            <ul className="flex gap-2 flex-wrap text-[#424242]">
                                <li className="border px-8 rounded-lg">{product?.state}</li>
                                <li className="border px-8 rounded-lg">UFC campus de {product?.campus}</li>
                                <li className="border px-8 rounded-lg capitalize">{product?.category}</li>
                            </ul>
                        </div>
                        <hr />
                        <div className="ml-1 my-5">
                            <label htmlFor="" className="text-[#00629B] text-md">Contate o anunciante</label>
                            <div className="flex lg:gap-2 flex-wrap justify-center text-center lg:flex-nowrap">
                                <button onClick={() => handleSendMessage()} className="flex justify-center items-center md:max-w-[300px] w-full my-2 gap-3 text-white bg-[#14AD00] hover:bg-[#318526] transition-all duration-150 p-2 rounded-lg">
                                    <img src={whatsApp} alt="whatsapp" className="w-6" />
                                    Mandar uma mensagem
                                </button>
                                <button onClick={() => handleCall()} className="flex justify-center items-center w-full md:max-w-[300px]  my-2 gap-3 border font-medium text-[#00629B] border-[#00629B]  hover:bg-[#00629B] hover:text-white transition-all duration-150 p-2 rounded-lg">
                                    <PhoneIncoming size={20} />
                                    Fazer uma ligação
                                </button>
                            </div>

                        </div>
                        <div className="my-10 text-sm text-[#B7B7B7] md:my-5">
                            <span>Postado dia {
                                formatDate(product?.date)
                            } às  {new Date(product?.date).getUTCHours()}:{new Date(product?.date).getUTCMinutes()}</span>
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}