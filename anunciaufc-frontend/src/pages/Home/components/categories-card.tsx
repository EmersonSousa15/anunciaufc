import { Link } from "react-router-dom";

interface CategoriesProp {
    image: string;
    label: string;
    route: string;
}

export const CategoriesCard = ({ image, label, route }: CategoriesProp) => {


    return (
        <Link to={route} className="w-32 mx-5 text-center cursor-pointer">
            <div className="w-32 p-2 rounded-xl flex items-center justify-center bg-[#D9D9D9]" id="category">
                <img src={image} alt="image-category" className="w-full h-24" />

            </div>
            <label htmlFor="category">{label}</label>
        </Link>
    )
}