export type Product = {
    id: number;
    userId: number;
    title: string;
    campus: string;
    category: string;
    price: string;
    state: string;
    description: string;
    images: File[];
    date: string;
    user_telephone: string;
}

export type FilterParams = {
    campus: string;
    state: string;
    order_az: boolean;
    order_price: boolean;
}