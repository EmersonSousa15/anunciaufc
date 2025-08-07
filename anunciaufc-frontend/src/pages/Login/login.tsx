import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { HeroForms } from "../../components/HeroForms/hero-forms";
import { api } from "@/service/api";

import failed from "../../assets/icons/failed.svg";
import attetion from "../../assets/icons/attetion.svg";
import { Loading } from "@/components/Loading/loading";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = yup.object().shape({
    email: yup.string().email("Digite um e-mail válido").matches(
        /^[a-zA-Z0-9._%+-]+@(alu|crateus)\.ufc\.br$/,
        'O e-mail deve institucional da Universidade Federal do Ceará'
    ).required("O e-mail é obrigatório"),
    password: yup.string().min(8, "A senha deve conter pelo menos 8 caracteres").max(32, "A senha deve conter no máximo 32 carecteres").required("A senha é obrigatória"),
})

type login = {
    email: string;
    password: string;
}


export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { onLogin } = useAuth();


    const onSubmitHandler = async (data: login) => {
        try {
            setIsLoading(true);

            const response = await api.post("/login", {
                email: data.email,
                password: data.password
            })


            if (response?.status === 200) {
                window.localStorage.setItem("anunciaufc.token", response?.data.token);
                window.localStorage.setItem("anunciaufc.type", response?.data.type);

                onLogin();
                navigate("/")
            }
        } catch (error: any) {
            if (error?.status === 400) {
                toast({
                    icon: attetion,
                    title: "Erro ao fazer login!",
                    description: `${error?.response.data.message}`

                })
            }
            if (error?.status === 404) {
                toast({
                    icon: attetion,
                    title: "Erro ao fazer login!",
                    description: `${error?.response.data.message}`,

                })
            }
            if (error?.status === 401) {
                toast({
                    icon: attetion,
                    title: "Erro ao fazer login!",
                    description: `${error?.response.data.message}`,

                })
            }
            if (error?.status === 500) {
                toast({
                    icon: failed,
                    title: "Erro ao fazer login!",
                    description: `${error?.response.data.error}`,

                })
            }
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <main className="flex flex-col-reverse w-screen h-screen overflow-x-hidden md:flex-row">
            <section className="h-full w-full flex justify-center items-start md:w-1/2 md:items-center">
                <div className="flex flex-col items p-3 max-w-[500px] md:w-2/3 md:max-w-[500px]">
                    <HeroForms />
                    <article className="mb-3 mt-[30%] md:mt-0">
                        <h1 className="font-semibold text-2xl tracking-wider mb-4">Entrar</h1>
                        <p className="text-justify">
                            Seja bem vindo novamente! Insira suas informações e navegue pelo
                            nosso sistema de anúncios da Universidade Federal do Ceará!
                        </p>
                    </article>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="p-1">Email:</label>
                            <input
                                type="text"
                                id="email"
                                className="border h-8 bg-transparent rounded-md p-2"
                                required
                                {...register("email")}
                            />
                            {errors.email && <p className="text-red-600 text-sm ml-2">{errors.email.message}</p>}

                            <br />
                            <label htmlFor="password" className="p-1">Senha:</label>
                            <div className="flex border bg-transparent rounded-md px-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="h-8 w-full"
                                    required
                                    {...register("password")}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Eye className="text-gray-400" size={20} /> : <EyeClosed className="text-gray-400" size={20} />}
                                </button>
                            </div>

                            {errors.password && <p className="text-red-600 text-sm ml-2">{errors.password.message}</p>}
                        </div>
                        <div className="flex justify-end">
                            <Link to="/recuperar-senha" className="underline text-[10px] text-[#5E5E5E] cursor-pointer text-right flex-end p-1">Esqueci minha senha</Link>
                        </div>
                        <br />
                        <div className="flex justify-center">
                            <button type="submit" className="w-56 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md">{isLoading ? <Loading /> : "Login"}</button>
                        </div>
                        <div className="text-center absolute inset-x-0 bottom-2 md:mt-0 md:static">
                            <span className="text-[12px]">Não tem uma conta?</span>
                            <Link to="/registrar" className="text-[12px] text-[#00629B] ml-1 underline underline-offset-1">Cadastre-se aqui</Link>
                        </div>
                    </form>
                </div>
            </section>
            <section className="bg-bgLogin bg-cover bg-center h-[45%] left-1/2 md:block md:fixed md:w-1/2 md:h-screen"></section>
        </main>
    )
}