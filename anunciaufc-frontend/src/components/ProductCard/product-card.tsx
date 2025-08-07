import { MapPin } from "lucide-react"
import { TypeProductCard } from "./types/type-product-card"
import { useNavigate } from "react-router-dom";


export const ProductCard = ({ id, image, price, description, campus, date }: TypeProductCard) => {
    const navigate = useNavigate();

    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate()}/${d.getUTCMonth() < 10 ? "0" + d.getUTCMonth() : d.getUTCMonth()}/${d.getUTCFullYear()},`;
    };
    

    return (
        <div onClick={() => navigate(`/produto/${id}`)}className="mx-8 flex items-center bg-[#ECEFF3] rounded-3xl cursor-pointer hover:shadow-xl transition-all duration-150 md:flex-col md:w-[310px] md:max-h-[450px] md:mx-0">
            <div className="h-full w-1/2 mr-2 md:w-full md:h-1/2 md:mr-0">
                <img src={`data:image/png;base64,${image}`} alt="produto" className="max-h-[250px] w-full rounded-l-3xl  md:rounded-tr-3xl md:rounded-l-none md:rounded-tl-3xl" />
            </div>
            <div className="w-2/3 h-full flex flex-col justify-between p-4 md:w-full md:py-2">
                <div className="my-4 md:my-0">
                    <h2 className="font-bold text-xl">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(price)/100)}</h2>
                    <p className="text-[#424242] text-justify text-sm line-clamp-3 overflow-hidden text-ellipsis md:line-clamp-3">
                        {description}
                    </p>
                </div>
                <div className="my-2 text-xs">
                    <div className="flex text-[#00629B]">
                        <MapPin size={15} />
                        <span className="ml-1">{campus}</span>
                    </div>
                    <div className="flex text-[10px]">
                        <p>
                            {
                               formatDate(date)
                            }
                        </p>
                        <p className="ml-1">{new Date(date).getUTCHours()}:{new Date(date).getUTCMinutes()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}