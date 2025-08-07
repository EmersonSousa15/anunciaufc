import { Link, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { HeroForms } from "../../components/HeroForms/hero-forms"
import { toast } from "@/hooks/use-toast"

import failed from "../../assets/icons/failed.svg"
import sucess from "../../assets/icons/sucess.svg"
import { api } from "@/service/api"
import { Loading } from "@/components/Loading/loading"

const emailSchema = yup.object().shape({
    email: yup.string().email("Digite um e-mail válido").matches(
        /^[a-zA-Z0-9._%+-]+@(alu|crateus)\.ufc\.br$/,
        'O e-mail deve institucional da Universidade Federal do Ceará'
    ).required("O e-mail é obrigatório")
})

const newPasswordSchema = yup.object().shape({
    newPassword: yup.string().min(8, "A senha deve conter pelo menos 8 caracteres").max(32, "A senha deve conter no máximo 32 carecteres").required("A senha é obrigatória"),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'As senhas devem ser iguais').required("A confirmação de senha é obrigatória"),
    code: yup.string().matches(
        /^[0-9]/,
        'O código deve ser numérico').required("O código é obrigatório").min(6, "O código deve conter 4 digitos").max(6, "O código deve conter 4 digitos"),
})


type RedefinePasswordProps = {
    email: string;
    newPassword: string;
}

export const ForgetPassword = () => {
    const { register: registerEmail, handleSubmit: handleEmailSendCode, formState: { errors: errorsEmail } } = useForm({ resolver: yupResolver(emailSchema) })
    const { register: registerNewPassoword, handleSubmit: handleNewPasswordSet, formState: { errors: errorsNewPassword }, reset: resetPasswordFields } = useForm({ resolver: yupResolver(newPasswordSchema) })
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("exemplo@alu.ufc.br")
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [stepForm, setStepForm] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const onSubmitHandler = async (data: any) => {
        setEmail(data.email);

        if (stepForm === 0) {
            try {
                if (data) {
                    setIsLoading(true);

                    const response = await api.post("/confirmaemail", {
                        email: data.email
                    })

                    if (response.status === 200) {
                        toast({
                            icon: sucess,
                            title: "E-mail enviado com sucesso!",
                            description: "Verifique o código no seu e-mail!",
                        })

                    }
                }
            } catch (error: any) {
                if (error && error.status === 500) {
                    toast({
                        icon: failed,
                        title: "Erro ao enviar e-mail!",
                        description: `${error?.response.data.message}`,
                    })
                }
            } finally {
                setIsLoading(false);
            }

            setStepForm(1);
        } else {
            try {
                setIsLoading(true);

                const response = await api.post("/verifyemail", {
                    code: data.code,
                    email: email
                })

                if (response?.status === 200) {
                    handleRedefinePassword(data);
                }

            } catch (error: any) {
                if (error?.status === 400) {
                    toast({
                        icon: failed,
                        title: "Código inválido",
                        description: "Verifique o e-mail e tente novamente!",
                    })
                    setStepForm(0);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleButtonCLick = () => {
        setStepForm(0);
    }


    const handleRedefinePassword = async (data: RedefinePasswordProps) => {
        setIsLoading(true);
        try {
            const response = await api.put("/forgotpassword", {
                email: email,
                password: data.newPassword
            })

            if (response.status === 200) {
                toast({
                    icon: sucess,
                    title: "Senha alterada com sucesso!",
                    description: "Redirecionando para login!",
                })

                navigate("/entrar");
            }

        } catch (error: any) {
            if (error && error.status === 500) {
                toast({
                    icon: failed,
                    title: "Erro ao alterar senha!",
                    description: `${error?.response.data.message}`,
                })
            }
        } finally {
            setIsLoading(false);
        }


        resetPasswordFields();
    }

    return (
        <main className="flex flex-col-reverse w-screen h-screen overflow-x-hidden md:flex-row">
            <section className="h-full w-full flex justify-center items-start md:w-1/2 md:items-center">
                <div className="flex flex-col items p-3 max-w-[500px] md:w-2/3 md:max-w-[500px]">
                    <HeroForms />
                    <article className="mb-3 mt-[20%] md:mt-0">
                        <h1 className="font-semibold text-2xl tracking-wider mb-4">Recuperar senha</h1>
                        <p className="text-justify">
                            {stepForm === 0 ?
                                "Digite seu e-mail correspondente e enviaremos um código para ajudar-lo a recuperar sua conta."
                                :
                                `Enviamos o código para o e-mail ${email}. Confira no seu e-mail e redefina sua senha para recuperar o acesso a sua conta.`
                            }
                        </p>
                    </article>

                    {stepForm === 0 &&
                        <form onSubmit={handleEmailSendCode(onSubmitHandler)}>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="p-1">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    className="border h-8 bg-transparent rounded-md p-2"
                                    required
                                    {...registerEmail("email")}
                                />
                                {errorsEmail.email && <p className="text-red-600 text-sm ml-2">{errorsEmail.email.message}</p>}
                            </div>
                            <div className="flex justify-center mt-10">
                                <button type="submit" className="w-56 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md">{isLoading ? <Loading /> : "Enviar"}</button>
                            </div>
                        </form>
                    }
                    {stepForm === 1 &&
                        (
                            <form onSubmit={handleNewPasswordSet(onSubmitHandler)}>
                                <div>
                                    <label htmlFor="code" className="p-1">Código:</label>
                                    <div className="flex border bg-transparent rounded-md px-2">
                                        <input
                                            type="number"
                                            className="h-8 w-full"
                                            required
                                            id="code"
                                            {...registerNewPassoword("code")}
                                        />
                                    </div>
                                    {errorsNewPassword.code && <p className="text-red-600 text-sm ml-2">{errorsNewPassword.code.message}</p>}
                                    <br />
                                    <label htmlFor="password" className="p-1">Nova senha:</label>
                                    <div className="flex border bg-transparent rounded-md px-2">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className="h-8 w-full"
                                            required
                                            {...registerNewPassoword("newPassword")}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <Eye className="text-gray-400" size={20} /> : <EyeClosed className="text-gray-400" size={20} />}
                                        </button>
                                    </div>
                                    {errorsNewPassword.newPassword && <p className="text-red-600 text-sm ml-2">{errorsNewPassword.newPassword.message}</p>}

                                    <br />

                                    <label htmlFor="confirmPassword" className="p-1">Confirmar nova senha:</label>
                                    <div className="flex border bg-transparent rounded-md px-2">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="h-8 w-full"
                                            required
                                            {...registerNewPassoword("confirmPassword")}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <Eye className="text-gray-400" size={20} /> : <EyeClosed className="text-gray-400" size={20} />}
                                        </button>
                                    </div>
                                    {errorsNewPassword.confirmPassword && <p className="text-red-600 text-sm ml-2">{errorsNewPassword.confirmPassword.message}</p>}
                                </div>
                                <div className="flex justify-between mt-10">
                                    <button type="button" className="w-36 h-10 bg-white rounded-lg text-[#858484] border border-[#858484] hover:shadow-md transition delay-200 hover:bg-[#CACACA]" onClick={() => handleButtonCLick()}>Anterior</button>
                                    <button type="submit" className="w-36 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md">{isLoading ? <Loading /> : "Recuperar"}</button>
                                </div>
                            </form>
                        )
                    }
                </div>
            </section>
            <section className="bg-bgLogin bg-cover bg-center h-[45%] left-1/2 md:block md:fixed md:w-1/2 md:h-screen"></section>
        </main >
    )
}