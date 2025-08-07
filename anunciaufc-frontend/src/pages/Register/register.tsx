import { Link, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Eye, EyeClosed } from "lucide-react"
import { useEffect, useState } from "react"
import { HeroForms } from "../../components/HeroForms/hero-forms"
import { InputForm } from "../../components/InputForm/input-form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User } from "@/types/user"
import { api } from "@/service/api"
import { useToast } from "@/hooks/use-toast"

import failed from "../../assets/icons/failed.svg"
import attetion from "../../assets/icons/attetion.svg"
import sucess from "../../assets/icons/sucess.svg"
import { ConfirmEmailDialog } from "./components/dialog-confirm-email"
import { Loading } from "@/components/Loading/loading"



const emailSchema = yup.object().shape({
   email: yup.string().email("Digite um e-mail válido").matches(
      /^[a-zA-Z0-9._%+-]+@(alu|crateus)\.ufc\.br$/,
      'O e-mail deve institucional da Universidade Federal do Ceará'
   ).required("O e-mail é obrigatório"),
})

const registerSchema = yup.object().shape({
   password: yup.string().min(8, "A senha deve conter pelo menos 8 caracteres").max(32, "A senha deve conter no máximo 32 carecteres").required("A senha é obrigatória"),
   confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required("A confirmação de senha é obrigatória"),
   name: yup.string().matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}( [A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/,
      "Digite o nome e o sobrenome"
   ).required("O nome e o sobrenome são obrigatórios"),
   phoneNumber: yup.string().min(13, "O número deve conter 11 digitos").required("O número de celular é obrigatório"),
   cpf: yup.string().matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF inválido"
   ).min(14, "O CPF deve conter 11 digitos").max(14, "O CPF deve conter 12 digitos").required("O CPF é obrigatório"),
   campus: yup.string().required("O campus é obrigatório"),
   sexo: yup.string().required("Escolha um sexo")
})


type RegisteUser = {
   password: string;
   name: string;
   phoneNumber: string;
   cpf: string;
   campus: string;
   sexo: string;
}

export const Register = () => {
   const { register: emailRegister, handleSubmit: handleEmailVerification, formState: { errors: errorsEmail } } = useForm({ resolver: yupResolver(emailSchema) })
   const { register, handleSubmit, formState: { errors }, setValue } = useForm({ resolver: yupResolver(registerSchema), mode: "all" })
   const [showPassword, setShowPassword] = useState(false)
   const [isCodeSent, setIsCodeSent] = useState(false)
   const [stepForm, setStepForm] = useState(0);
   const [openSelect, setOpenSelect] = useState(false);
   const [user, setUser] = useState<User>({} as User);
   const [isLoading, setIsLoading] = useState(false);

   const { toast } = useToast()
   const navigate = useNavigate();

   const onSubmitHandler = (data: RegisteUser) => {
      setUser((prev) => ({
         ...prev,
         name: data?.name,
         password: data?.password,
         telephone: data?.phoneNumber,
         cpf: data?.cpf,
         gender: data?.sexo,
         campus: data?.campus
      }));

   };

   const previusPage = () => {
      setStepForm(prev => prev - 1);
   }

   const nextPage = () => {
      setStepForm(prev => prev + 1);
   }

   const handleSendCodeVerification = async (data: {email: string}) => {
      setUser(prev => ({ ...prev, ...data }));

      try {
         if (data) {
            setIsLoading(true);

            const response = await api.post("/confirmaemail", {
               ...data
            })

            if (response.status === 200) {
               toast({
                  icon: sucess,
                  title: "E-mail enviado com sucesso!",
                  description: "Verifique o código no seu e-mail!",
               })

               setIsCodeSent(true);
               onOpenModal(true);

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
   }

   const formatPhoneNumber = (data: React.ChangeEvent<HTMLInputElement>) => {
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

   const checkErros = () => {
      if (errors.password || errors.confirmPassword) {
         setStepForm(1);
      } else if (errors.name || errors.phoneNumber) {
         setStepForm(2);
      }
      if (errors.cpf, errors.campus) {
         setStepForm(3);
      }
   }


   const handleRegister = async () => {
      try {
         if (user) {
            const response = await api.post("/register", {
               ...user
            })

            if (response?.status === 200) {
               toast({
                  icon: sucess,
                  title: "Conta cadastrada com sucesso!",
                  description: "Você está sendo redirecionado para a página de login.",
               })

               navigate("/entrar")
            }
         }
      } catch (error: any) {
         if (error?.status === 409) {
            toast({
               icon: attetion,
               title: "Conta não cadastrada!",
               description: `${error?.response.data.message}`,
            })
            setStepForm(0);
         }
         if (error?.status === 500) {
            toast({
               icon: failed,
               title: "Erro inesperado!",
               description: `${error?.response.data.error}`,

            })
         }
      }
   }

   const onOpenModal = (open: boolean) => {
      setIsCodeSent(open)
   }


   useEffect(() => {
      if (user.name)
         handleRegister()
      
   }, [user])

   return (
      <main className="flex flex-col-reverse w-screen h-screen overflow-x-hidden md:flex-row">
         <section className="h-full w-full flex justify-center items-start md:w-1/2 md:items-center">
            <div className="flex flex-col items p-3 max-w-[500px] md:w-2/3 md:max-w-[500px]">
               <HeroForms />
               <article className="mb-5 mt-[20%] md:mt-0">
                  <h1 className="font-semibold text-2xl tracking-wider mb-4">Cadastre-se</h1>
                  {stepForm === 0 &&
                     <p className="text-justify">
                        Bem-vindo ao sistema de anúncios da UFC! Este espaço foi criado para que alunos e servidores da Universidade Federal do Ceará negociem produtos de forma prática e segura. Cadastre-se agora usando o seu                                     <strong>e-mail institucional </strong>
                        e aproveite!
                     </p>
                  }
                  {stepForm === 1 &&
                     <p className="text-justify">E-mail verificado com sucesso! Para continuar a sua inscrição na nossa plataforma, cadastre uma senha segura para entrar na sua conta.</p>
                  }
                  {stepForm === 2 &&
                     <p className="text-justify">Continue preenchendo suas informações para usufruir da nossa plataforma! Certifique-se que seu número de celular está correto, pois ele será utilizado para as negociações. </p>
                  }
               </article>

               {stepForm === 0 &&
                  <form onSubmit={handleEmailVerification(handleSendCodeVerification)}>
                     <InputForm label="Email Institucional" id="email" type="email" register={emailRegister} classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2">
                        {errorsEmail.email && <p className="text-red-600 text-sm ml-2">{errorsEmail.email.message}</p>}
                     </InputForm>

                     <div className="flex justify-center mt-10">
                        <button type="submit" className="w-56 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md">{isLoading ? <Loading /> : "Verificar e-mail"}</button>
                     </div>
                     <div className="text-center absolute inset-x-0 bottom-2 md:mt-0 md:static">
                        <span className="text-[12px]">Já tem uma conta?</span>
                        <Link to="/entrar" className="text-[12px] text-[#00629B] ml-1 underline underline-offset-1">Entre na sua conta aqui</Link>
                     </div>
                  </form>
               }

               <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className={`${stepForm === 1 ? "block" : "hidden"}`}>
                     <div>
                        <InputForm label="Senha" id="password" type={showPassword ? "text" : "password"} register={register} classNameDiv="flex border bg-transparent rounded-md px-2" classNameInput="h-8 w-full">
                           <button type="button" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <Eye className="text-gray-400" size={20} /> : <EyeClosed className="text-gray-400" size={20} />}
                           </button>
                        </InputForm>
                        {errors.password && <p className="text-red-600 text-sm ml-2">{errors.password.message}</p>}


                        <br />

                        <InputForm label="Confitmar senha" id="confirmPassword" type={showPassword ? "text" : "password"} register={register} classNameDiv="flex border bg-transparent rounded-md px-2" classNameInput="h-8 w-full">
                           <button type="button" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <Eye className="text-gray-400" size={20} /> : <EyeClosed className="text-gray-400" size={20} />}
                           </button>
                        </InputForm>
                        {errors.confirmPassword && <p className="text-red-600 text-sm ml-2">{errors.confirmPassword.message}</p>}
                     </div>
                     <div className="flex justify-between mt-10">
                        <button type="button" className="w-36 h-10 bg-transparent rounded-lg text-[#858484] border border-[#858484] hover:shadow-md" onClick={() => previusPage()}>Anterior</button>
                        <button type="button" className="w-36 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md" onClick={() => nextPage()}>Proximo</button>
                     </div>
                  </div>


                  <div className={`${stepForm === 2 ? "block" : "hidden"}`}>
                     <div>
                        <InputForm label="Nome e Sobrenome" id="name" type="text" register={register} classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2">
                           {errors.name && <p className="text-red-600 text-sm ml-2">{errors.name.message}</p>}
                        </InputForm>

                        <br />

                        <InputForm label="Número de Celular" id="phoneNumber" type="text" register={register} onInput={formatPhoneNumber}
                           classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2">
                           {errors.phoneNumber && <p className="text-red-600 text-sm ml-2">{errors.phoneNumber.message}</p>}
                        </InputForm>
                     </div>
                     <div className="flex justify-between mt-10">
                        <button type="button" className="w-36 h-10 bg-transparent rounded-lg text-[#858484] border border-[#858484] hover:shadow-md" onClick={() => previusPage()}>Anterior</button>
                        <button type="button" className="w-36 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md" onClick={() => nextPage()}>Proximo</button>
                     </div>
                  </div>

                  <div className={`${stepForm === 3 ? "block" : "hidden"} h-300`}>
                     <div>
                        <InputForm label="CPF" id="cpf" type="text" register={register}
                           classNameDiv="flex flex-col" classNameInput="border h-8 bg-transparent rounded-md p-2" onInput={formatCPF}>
                           {errors.cpf && <p className="text-red-600 text-sm ml-2">{errors.cpf.message}</p>}
                        </InputForm>

                        <br />
                        <div className="flex flex-col">
                           <label htmlFor="campus" className="p-1">Selecione o seu campus</label>
                           <Select onValueChange={(value) => setValue("campus", value, { shouldValidate: true })}>
                              <SelectTrigger className="w-[180px] h-8 border rounded-md" onClick={() => setOpenSelect(!openSelect)}>
                                 <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border w-[180px]" id="campus">
                                 <SelectGroup>
                                    <SelectItem value="Crateús" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Crateús</SelectItem>
                                    <SelectItem value="Quixadá" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Quixadá</SelectItem>
                                    <SelectItem value="Russas" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Russas</SelectItem>
                                    <SelectItem value="Fortaleza" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Fortaleza</SelectItem>
                                    <SelectItem value="Itapajé" className=" transition delay-150 hover:bg-[#dcdbdb]  rounded-md cursor-pointer">Itapajé</SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                           {errors.campus && <p className="text-red-600 text-sm ml-2">{errors.campus.message}</p>}
                        </div>

                        <br />
                        <div >
                           <p className="p-1">Sexo</p>
                           <RadioGroup className="flex gap-8" onValueChange={(value) => { setValue("sexo", value, { shouldValidate: true }) }}>
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
                        {errors.sexo && <p className="text-red-600 text-sm ml-2">{errors.sexo.message}</p>}

                        <br />


                     </div>
                     <div className="flex justify-between mt-10">
                        <button type="button" className="w-36 h-10 bg-transparent rounded-lg text-[#858484] border border-[#858484] hover:shadow-md" onClick={() => previusPage()}>Anterior</button>
                        <button type="submit" className="w-36 h-10 bg-[#00629B] rounded-lg text-white hover:shadow-md" onClick={() => checkErros()}>Cadastrar</button>
                     </div>
                  </div>
               </form>
            </div>
         </section>

         {isCodeSent &&
            <ConfirmEmailDialog email={user?.email} onOpen={isCodeSent} onOpenChange={onOpenModal} nextPage={nextPage} handleSendCodeVerification={handleSendCodeVerification} />
         }

         <section className="bg-bgLogin bg-cover bg-center h-[45%] left-1/2 md:block md:fixed md:w-1/2 md:h-screen"></section>
      </main >
   )
}