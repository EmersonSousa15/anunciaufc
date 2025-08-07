import { InputForm } from "@/components/InputForm/input-form"
import { Logo } from "@/components/Logo/logo"
import { Navbar } from "@/components/Navbar/navbar"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import { Loading } from "@/components/Loading/loading"
import { useEditAd } from "@/hooks/useEditAd"
import { useGetAd } from "@/hooks/useGetAd"

import { dataUriToBuffer } from "data-uri-to-buffer";
import { Product } from "@/types/product";
import { useDeleteAd } from "@/hooks/useDeleteAd"

export const EditAd = () => {
    const { handleSubmit, register, setValue, reset } = useForm<Product>();
    const navigate = useNavigate();
    const params = useParams();

    const { data: adData, isLoading: adIsLoading } = useGetAd(params.id ?? "");
    const { mutate: editAdMutate, isPending: isPendingUpdate } = useEditAd();
    const { mutate: deleteAdMutate, isPending: isPendingDelete} = useDeleteAd(params.id ?? "");

    const [images, setImages] = useState<File[]>([]);
    const [price, setPrice] = useState(adData?.data.price);

    const handleCreateAd = async (data: Product) => {
        const dataAd = {
            ...data,
            announcementId: Number(params.id)
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(dataAd));
        images.forEach(image => {
            formData.append("images", image);
        });

        if (params.id) {
            editAdMutate(formData);
        }

        setImages([]);
        setPrice("");
        reset();

    };

    function base64ToFile(base64: string, filename: string): File {
        const parsed = dataUriToBuffer(base64);
        return new File([parsed.buffer], filename);
    }

    useEffect(() => {
        if (adData?.data) {
            const ad = {
                title: adData?.data.title,
                campus: adData?.data.campus,
                category: adData?.data.category,
                state: adData?.data.state,
                description: adData?.data.description
            }

            setPrice(new Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL"
            }).format(Number(adData?.data.price) / 100));

            setValue("price", adData?.data.price);

            const initialImages = adData?.data.images.map((image, index) => {
                return base64ToFile(`data:image/png;base64,${image.toString()}`, index.toString());
            });
            setImages(initialImages);

            reset(ad);
        }
    }, [adData?.data]);

    const handleDeleteAd = () => {
        deleteAdMutate();
    }

    const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const files: File[] = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);   
    }


    const formatPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/\D/g, "");
        setPrice(new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL"
        }).format(Number(numericValue) / 100))
        setValue("price", numericValue)
    }

    if (adIsLoading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
            </div>
        )
    }


    return (
        <>
            <header className="w-screen p-3 shadow-md">
                <Logo />
            </header>
            <main className="md:my-10">
                <div className="w-full mt-10 flex">
                    <button onClick={() => navigate(-1)} className="absolute left-10">
                        <ArrowLeft color="#00629B" size={30} />
                    </button>
                    <h1 className="text-[#00629B] text-xl text-center w-full">
                        Criar anúncio
                    </h1>
                </div>

                <div className="w-full flex justify-center my-4 items-center">
                    <p className="w-[90%] text-center">
                        As negociações referentes a este anúncio serão realizadas exclusivamente
                        pelo número cadastrado na sua conta. Os clientes poderão ligar ou enviar
                        mensagens pelo WhatsApp para concluir o processo.
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleCreateAd)} className="w-[80%] m-auto mt-10 bg-white max-w-[800px]">
                    <div>
                        <InputForm label="Título do anúncio" id="title" type="text" register={register} classNameDiv="flex border bg-transparent rounded-md px-2" classNameInput="h-8 w-full" />
                        <br />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="campus" className="p-1">Selecione o campus</label>
                        <Select onValueChange={(value) => setValue("campus", value, { shouldValidate: true })} defaultValue={adData?.data.campus}>
                            <SelectTrigger className="w-full h-8 border rounded-md">
                                <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border w-full" id="campus">
                                <SelectGroup>
                                    <SelectItem value="Crateús" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Crateús</SelectItem>
                                    <SelectItem value="Quixadá" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Quixadá</SelectItem>
                                    <SelectItem value="Russas" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Russas</SelectItem>
                                    <SelectItem value="Fortaleza" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Fortaleza</SelectItem>
                                    <SelectItem value="Itapajé" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Itapajé</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <br />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="category" className="p-1">Selecione a categoria</label>
                        <Select onValueChange={(value) => setValue("category", value, { shouldValidate: true })} defaultValue={adData?.data.category}>
                            <SelectTrigger className="w-full h-8 border rounded-md">
                                <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border w-full" id="category">
                                <SelectGroup>
                                    <SelectItem value="Eletrônicos" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Eletrônicos</SelectItem>
                                    <SelectItem value="Casa & Mobilia" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Casa & Mobilia</SelectItem>
                                    <SelectItem value="Imóveis" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Imóveis</SelectItem>
                                    <SelectItem value="Vestuário" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Vestuário</SelectItem>
                                    <SelectItem value="Eletrodomésticos" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Eletrodomésticos</SelectItem>
                                    <SelectItem value="livros" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Livros</SelectItem>
                                    <SelectItem value="Livros" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Acessórios</SelectItem>
                                    <SelectItem value="Outros" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Outros</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <br />
                    </div>
                    <div className="w-full flex">
                        <div className="w-1/2">
                            <InputForm label="Preço" id="price" type="string" classNameDiv="flex border bg-transparent rounded-md px-2" classNameInput="h-8 w-full" onInput={formatPrice} value={price} />
                            <br />
                        </div>
                        <div className="w-1/2 ml-10">
                            <p className="text-sm mb-2">Estado</p>
                            <RadioGroup
                                onValueChange={(value) => {
                                    setValue("state", value);
                                }}
                                className="rounded-lg p-1 flex"
                                defaultValue={adData?.data.state}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="novo" id="novo" />
                                    <label htmlFor="novo" className="text-sm font-semibold ml-3">Novo</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="usado" id="usado" />
                                    <label htmlFor="usado" className="text-sm font-semibold ml-3">Usado</label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="desciption">Descrição</label>
                        <textarea
                            id="description"
                            {...register("description")}
                            maxLength={2028}
                            className="flex w-full h-32 border bg-transparent rounded-md px-2"
                        />
                        <br />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="image" className="block">Selecione a imagem</label>
                        <p className="text-[#7D7D7D] text-sm">
                            Para melhor qualidade, a resolução da imagem deve ser de 1050x900 pixels.
                            Podem ser carregadas até 4 fotos com extensão .jpg.
                        </p>

                        <div className="border border-gray-300 bg-transparent rounded-md px-3 py-2">
                            <label htmlFor="image" className="cursor-pointer flex items-center justify-center gap-2 text-[#00629B] font-medium">
                                <Upload size={20} />
                                {images.length < 4 ? "Selecionar imagem" : "Limite atingido"}
                            </label>

                            <input
                                type="file"
                                id="image"
                                className="hidden"
                                accept="image/png, image/jpeg"
                                multiple
                                onChange={handleAddImage}
                                disabled={images.length >= 4}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-32 h-32 border rounded-md shadow-md">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <button type="button"
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <X size={16} className="text-red-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center flex-wrap gap-3 mt-4">
                        <button type="submit" className="w-[200px] h-10 rounded-md bg-[#00629B] text-white font-semibold hover:bg-[#394959] transition duration-150">
                            {isPendingUpdate ? <Loading /> : "Atualizar"}
                        </button>
                        <button type="button" onClick={() => handleDeleteAd()}
                         className="md:w-[200px] w-full h-10 rounded-md bg-white text-[#FF0000] border border-[#FF0000] font-semibold hover:bg-[#FF0000] hover:text-white transition duration-200">
                            {isPendingDelete ? <Loading/> : "Excluir Anúncio"}
                        </button>
                    </div>
                </form>
            </main>
            <footer className="block md:hidden h-32">
                <Navbar />
            </footer>
        </>
    )
}