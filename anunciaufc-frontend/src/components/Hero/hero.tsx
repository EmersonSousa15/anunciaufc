import { Navbar } from "../Navbar/navbar"
import banner from "../../assets/banner.png"

export const Hero = ({ showImage }: { showImage: boolean }) => {
    return (
        <section className={`w-screen `}>
            <Navbar />
            {showImage &&
                <div className="w-full">
                    <img src={banner} className="h-[140px] w-full md:h-[200px]" />
                    <h1 className="text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_60%)] font-bold text-2xl absolute top-36 left-5 md:top-52 md:left-[10%] md:text-4xl">UFC ANÚNCIOS</h1>
                </div>}
        </section>
    )
}