import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { ChevronDown, ChevronUp, Home, Plus, Search, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/service/api";
import { toast } from "@/hooks/use-toast";

import failed from "../../assets/icons/failed.svg"

export const Navbar = () => {
    const [statusMenu, setStatusMenu] = useState(false);
    const [selected, setSelected] = useState(0);
    const { token, onLogout, isAdmin } = useAuth();

    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            const response = api.post("/logout", {}, {
                headers: {
                    Authorization: `${token}`
                }
            })

            if ((await response).status === 200) {
                onLogout();
            }
            
        } catch (error: any) {
            if (error.status === 401) {
                toast({
                    icon: failed,
                    title: "Erro ao efetuar logout",
                    description: "Token inválido."
                })
                onLogout();
                navigate("/entrar");
            }
        }

    }

    return (
        <>
            <section className="h-20 w-screen hidden justify-between items-center shadow-2xl px-2 md:px-10 bg-white md:flex">
                <div>
                    <Link to="/">
                        <img src={Logo} alt="logo" className="w-12 " />
                    </Link>
                </div>
                <div className="flex">
                    <nav className="hidden md:block">
                        {token && !isAdmin &&
                            <ul className="flex gap-4">
                                <li className="mr-1">
                                    <Link to='/meus-anuncios' className="flex items-center gap-1 py-1 px-3 border rounded-full transition delay-200 hover:text-[#00629B]">
                                        <HiOutlineSpeakerphone size={20} />
                                        Meus anúncios
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/criar-anuncio' className="flex items-center gap-1 mr-5 bg-[#00629B] text-white py-1 px-3 rounded-full transition delay-200 hover:shadow-md">
                                        <Plus size={20} />
                                        Criar anúncio
                                    </Link>
                                </li>
                            </ul>
                        }
                        {
                            isAdmin &&
                            <ul className="flex gap-4">
                                <li className="mr-5">
                                    <Link to='/autorizar-anuncios' className="flex items-center gap-1 py-1 px-3 border rounded-full transition delay-200 hover:text-[#00629B]">
                                        <HiOutlineSpeakerphone size={20} />
                                        Autorizar anúncios
                                    </Link>
                                </li>
                            </ul>
                        }

                    </nav>
                    <DropdownMenu onOpenChange={() => setStatusMenu(!statusMenu)}>
                        <DropdownMenuTrigger className="flex mr-2">
                            <User />
                            {statusMenu ? <ChevronUp /> : <ChevronDown />}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 m-2 py-2 rounded-md text-center border bg-white md:w-36">
                            {!token &&
                                <DropdownMenuGroup className="flex flex-col items-center gap-3 py-3">
                                    <DropdownMenuItem className="mb-3 px-3 transition delay-200 hover:text-[#00629B]">
                                        <Link to='/registrar'>Cadastre-se</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className=" px-3 transition delay-200 hover:text-[#00629B]">
                                        <Link to='/entrar'>Entrar</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            }
                            {token &&
                                <>
                                    <DropdownMenuItem className="py-1 px-3 rounded transition delay-200 hover:text-[#00629B]">
                                        <Link to='/conta'>Perfil</Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuGroup className="flex flex-col items-center gap-3 py-2 md:hidden">
                                        <DropdownMenuItem>
                                            <Link to="/meus-anuncios" className="w-40 flex justify-center items-center gap-1 py-1 px-3 rounded transition delay-200 hover:text-[#00629B]">
                                                <HiOutlineSpeakerphone size={20} />
                                                Meus anúncios
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to="/criar-anuncio" className="w-40 flex items-center justify-center gap-1 bg-[#00629B] text-white py-1 px-3 rounded transition delay-250 hover:shadow-md">
                                                <Plus size={20} />
                                                Criar anúncio
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="my-2 border" />
                                    <DropdownMenuItem>
                                        <button className="text-red-500" onClick={() => handleLogout()}>Sair</button>
                                    </DropdownMenuItem>
                                </>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>

            <section className="h-20 w-screen fixed z-40 top-[calc(100%-5rem)] flex justify-between items-center inset-shadow-xs border px-2 md:px-10 bg-white md:hidden">
                <nav className="w-full h-full">
                    <ul className="w-full h-full flex justify-evenly items-center">
                        <li className={`${selected == 0 ? "bg-[#DAE2FF]" : ""} px-3 py-1 rounded-full`} onClick={() => setSelected(0)}>
                            <Link to="/">
                                <Home size={25} />
                            </Link>
                        </li>
                        <li className={`${selected == 1 ? "bg-[#DAE2FF]" : ""} px-3 py-1 rounded-full`} onClick={() => setSelected(1)}>
                            <Link to="/buscar">
                                <Search size={25} />
                            </Link>
                        </li>
                        {!isAdmin && <li className="bg-[#00629B] p-3 rounded-full text-white" onClick={() => setSelected(2)}>
                            <Link to="/criar-anuncio">
                                <Plus size={25} />
                            </Link>
                        </li>}
                        <li className={`${selected == 3 ? "bg-[#DAE2FF]" : ""} px-3 py-1 rounded-full`} onClick={() => setSelected(3)}>
                            <Link to={`${isAdmin ? "/autorizar-anuncios" : "/meus-anuncios"}`}>
                                <HiOutlineSpeakerphone size={25} />
                            </Link>
                        </li>
                        <li className={`${selected == 4 ? "bg-[#DAE2FF]" : ""} px-3 py-1 rounded-full`} onClick={() => setSelected(4)}>
                            <Link to="/profile">
                                <User size={25} />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section >
        </>
    )
}