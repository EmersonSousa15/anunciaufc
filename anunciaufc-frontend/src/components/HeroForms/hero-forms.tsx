import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Logo } from "../Logo/logo"
import imgLogo from "../../assets/logo.svg"

export const HeroForms = () => {
    const styleLogo = "hidden md:flex"
    const nativgate = useNavigate()

    return (
        <>
            <div className="absolute h-10 w-10 bg-white z-50 top-5 left-5 rounded-full flex justify-center items-center shadow-md">
                <button onClick={() => nativgate(-1)}>
                    <ChevronLeft className="text-[#00629B]" size={30} />
                </button>
            </div>
            <div className="mb-5 m-auto absolute left-[calc(50%-2.5rem)] top-[27%] flex justify-center items-center shadow-md bg-white rounded-full w-20 h-20 md:mt-0 md:rounded-none md:w-auto md:shadow-none md:static">
                <Logo style={styleLogo} />
                <img src={imgLogo} alt="logo" className="block mt-2 w-16 md:hidden" />
            </div>
        </>
    )
}