import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FilterParams } from "@/types/product";
import { Description } from "@radix-ui/react-toast";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

type FilterProps = {
    openFilter: boolean;
    handleOpenFilter: (value: boolean) => void;
    setFilterParams: Dispatch<SetStateAction<FilterParams>>;
    filterParams: FilterParams;
};

export const Filter = ({ openFilter, handleOpenFilter, setFilterParams, filterParams }: FilterProps) => {
    const { handleSubmit, setValue } = useForm({
        defaultValues: {
            campus: filterParams.campus,
            state: filterParams.state,
            order_az: filterParams.order_az,
            order_price: filterParams.order_price,
        },
    });

    const [selectedCampus, setSelectedCampus] = useState(filterParams.campus);
    const [selectedState, setSelectedState] = useState(filterParams.state);
    const [orderAZ, setOrderAZ] = useState(filterParams.order_az);
    const [orderPrice, setOrderPrice] = useState(filterParams.order_price);

    const handleChangeOrderAZ = (value: boolean) => {
        setOrderAZ(value);
        setValue("order_az", value);
    };

    const handleChangeOrderPrice = (value: boolean) => {
        setOrderPrice(value);
        setValue("order_price", value);
    };

    const handleFilter = (data: FilterParams) => {
        setFilterParams(data);
        handleOpenFilter(false)
    };

    const handleClearFilter = () => {
        setOrderAZ(false);
        setOrderPrice(false);
        setSelectedCampus("");  
        setSelectedState("");  

        const data = {
            campus: "",
            state: "",
            order_az: false,
            order_price: false,
        }

        handleFilter(data);
        handleOpenFilter(false)
    };

    return (
        <Dialog open={openFilter} onOpenChange={handleOpenFilter}>
            <DialogContent className="w-[400px] m-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#00629B]">Filtros</DialogTitle>
                    <Description></Description>
                </DialogHeader>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleFilter)}>
                    <div>
                        <label htmlFor="campus" className="font-semibold text-sm mb-2">Campus</label>
                        <Select 
                            value={selectedCampus} 
                            onValueChange={(value) => {
                                setSelectedCampus(value);
                                setValue("campus", value);
                            }}
                        >
                            <SelectTrigger className="h-8 border rounded-md">
                                <SelectValue placeholder="Selecionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border" id="campus">
                                <SelectGroup>
                                    <SelectItem value="Crateús">Crateús</SelectItem>
                                    <SelectItem value="Quixadá">Quixadá</SelectItem>
                                    <SelectItem value="Russas">Russas</SelectItem>
                                    <SelectItem value="Fortaleza">Fortaleza</SelectItem>
                                    <SelectItem value="Itapajé">Itapajé</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="font-semibold text-sm mb-2">Estado</p>
                        <RadioGroup 
                            value={selectedState}
                            onValueChange={(value) => {
                                setSelectedState(value);
                                setValue("state", value);
                            }} 
                            className="border-2 rounded-lg p-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="novo" id="novo" />
                                <label htmlFor="novo" className="text-sm font-semibold ml-3">Novo</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="usado" id="usado" />
                                <label htmlFor="usado" className="text-sm font-semibold ml-3">Usado</label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <p className="font-semibold text-sm mb-2">Ordenar por</p>
                        <div className="border-2 rounded-lg p-1">
                            <div className="flex mb-2">
                                <Switch id="a-z" onCheckedChange={handleChangeOrderAZ} checked={orderAZ} />
                                <p className="text-sm font-semibold ml-3">A - Z</p>
                            </div>
                            <div className="flex mt-2">
                                <Switch id="price" onCheckedChange={handleChangeOrderPrice} checked={orderPrice} />
                                <p className="text-sm font-semibold ml-3">Preço (Menor ao Maior)</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleClearFilter}
                            className="w-full bg-transparent text-[#00629B] font-semibold border-[#00629B] border py-2 px-4 rounded-md hover:bg-[#E6E6E6] focus:outline-none transition-all duration-300"
                        >
                            Limpar filtros
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-[#00629B] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#004B75] focus:outline-none transition-all duration-300"
                        >
                            Aplicar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
