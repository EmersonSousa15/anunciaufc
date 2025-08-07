import { InputForm } from "@/components/InputForm/input-form"
import { Logo } from "@/components/Logo/logo"
import { Navbar } from "@/components/Navbar/navbar"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Loading } from "@/components/Loading/loading"
import { yupResolver } from "@hookform/resolvers/yup"
import { useGetUser } from "@/hooks/useGetUser"
import { useEditUser } from "@/hooks/useEditUser"
import * as yup from "yup"
import { ConfirmDeleteDialog } from "./components/dialog-confim-delete"

const editSchema = yup.object().shape({
    name: yup.string().matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}( [A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/,
        "Digite o nome e o sobrenome"
    ).required("O nome e o sobrenome são obrigatórios"),
    telephone: yup.string().min(13, "O número deve conter 11 digitos").required("O número de celular é obrigatório"),
    campus: yup.string().required("O campus é obrigatório"),
    gender: yup.string().required("Escolha um se")
})


export type EditUser = {
    email: string;
    cpf: string;
    name: string;
    telephone: string;
    campus: string;
    gender: string;
}

export const Account = () => {
    const { data, isLoading } = useGetUser();
    const { handleSubmit, register, setValue, formState: { errors }, reset
    } = useForm({
        resolver: yupResolver(editSchema), mode: "all"
    });
    const navigate = useNavigate();
    const { mutate: updateMutate, isPending: isPendingUpdate } = useEditUser();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleEditAccount = async (data: any) => {
        updateMutate(data);
    };

    const handleDeleteUser = () => {
        setOpenDeleteModal(true);
    }

    const formattelephone = (data: React.ChangeEvent<HTMLInputElement>) => {
        let value = data.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            data.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 6) {
            data.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else if (value.length > 2) {
            data.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            data.target.value = value;
        }
    }

    const formatCPF = (data: React.ChangeEvent<HTMLInputElement>) => {
        let value = data.target.value.replace(/\D/g, "");
        value = value.slice(0, 11);

        if (value.length > 9) {
            data.target.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
        } else if (value.length > 6) {
            data.target.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        } else if (value.length > 3) {
            data.target.value = `${value.slice(0, 3)}.${value.slice(3)}`;
        } else {
            data.target.value = value;
        }
    }

    useEffect(() => {
        if (data?.data) {
            const user: EditUser = {
                email: data?.data.email,
                name: data?.data.name,
                telephone: data?.data.telephone,
                cpf: data?.data.cpf,
                campus: data?.data.campus,
                gender: data?.data.gender,
            }
            reset(user)
        }
    }, [data?.data])

    if (isLoading) {
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
            <main className="md: my-10">
                <div className="w-full mt-10 flex">
                    <button onClick={() => navigate(-1)} className="absolute left-10">
                        <ArrowLeft color="#00629B" size={30} />
                    </button>
                    <h1 className="text-[#00629B] text-xl text-center w-full">
                        Minha Conta
                    </h1>
                </div>

                <form onSubmit={handleSubmit(handleEditAccount)} className="w-[80%] m-auto mt-10 bg-white max-w-[800px]">
                    <div>
                        <InputForm label="Email Institucional" id="email" readOnly={true} type="text" register={register} classNameDiv="flex border bg-transparent rounded-md px-2" classNameInput="h-8 w-full text-[#bdbdbd] cursor-not-allowed" />
                        <br />
                    </div>
                    <div>
                        <InputForm label="Nome e Sobrenome" id="name" type="text" register={register} classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2">
                            {errors.name && <p className="text-red-600 text-sm ml-2">{errors.name.message}</p>}
                        </InputForm>
                        <br />
                    </div>
                    <div>
                        <InputForm label="Número de Celular" id="telephone" type="text" register={register} onInput={formattelephone}
                            classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2">
                            {errors.telephone && <p className="text-red-600 text-sm ml-2">{errors.telephone.message}</p>}
                        </InputForm>
                        <br />
                    </div>
                    <div>
                        <InputForm label="CPF" id="cpf" type="text" register={register}
                            classNameDiv="flex flex-col" readOnly={true} classNameInput="border h-8 bg-transparent rounded-md p-2 text-[#bdbdbd] cursor-not-allowed" onInput={formatCPF}>
                        </InputForm>
                        <br />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="campus" className="p-1">Selecione o campus</label>
                        <Select onValueChange={(value) => setValue("campus", value, { shouldValidate: true })} defaultValue={data?.data.campus}>
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
                        <div >
                            <p className="p-1">Sexo</p>
                            <RadioGroup className="flex gap-8" defaultValue={data?.data.gender} onValueChange={(value) => { setValue("gender", value, { shouldValidate: true }) }}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="feminino" id="feminino" />
                                    <label htmlFor="feminino">Feminino</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="masculino" id="masculino" />
                                    <label htmlFor="masculino">Maculino</label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors.gender && <p className="text-red-600 text-sm ml-2">{errors.gender.message}</p>}

                        <br />
                    </div>

                    <div className="flex items-center justify-center flex-wrap gap-3 mt-4">
                        <button type="submit" className="md:w-[200px] w-full h-10 rounded-md bg-[#00629B] text-white hover:bg-[#394959] transition duration-200">
                            {isPendingUpdate ? <Loading /> : "Salvar alterações"}
                        </button>
                        <button type="button" onClick={() => handleDeleteUser()}
                         className="md:w-[200px] w-full h-10 rounded-md bg-white text-[#FF0000] border border-[#FF0000] font-semibold hover:bg-[#FF0000] hover:text-white transition duration-200">
                            Excluir Conta
                        </button>
                    </div>
                </form>
            </main>
            <footer className="block md:hidden h-32">
                <Navbar />
            </footer>

            { openDeleteModal &&
                <ConfirmDeleteDialog openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal}/>
            }
        </>
    )
}