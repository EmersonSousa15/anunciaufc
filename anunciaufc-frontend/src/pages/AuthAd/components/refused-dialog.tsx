import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-toast";
import refused from "../../../assets/icons/refused.svg";
import { dataAuthAd, useAuthAd } from "@/hooks/useAuthAd";
import { toast } from "@/hooks/use-toast";


type RefusedProps = {
    openRefused: boolean;
    handleOpenRefused: (value: boolean) => void;
    dataAuthAd: dataAuthAd
};

export const RefusedDialog = ({ openRefused, handleOpenRefused, dataAuthAd }: RefusedProps) => {
    const mutation = useAuthAd();


    const handleCancelRefused = () => {
        handleOpenRefused(false);
    }


    const handleRefusedAd = () => {
        mutation.mutate(dataAuthAd)
    }


    if (mutation.isSuccess) {
        toast({
            title: "Anúncio recusado!",
            description: "Um e-mail foi enviado para o usuário."
        })

        handleCancelRefused();
    }

    return (
        <Dialog open={openRefused} onOpenChange={handleOpenRefused}>
            <DialogContent className="w-[400px] m-auto">
                <DialogHeader>
                    <img src={refused} alt="recusar" className="w-12 mb-3"/>
                    <DialogTitle className="text-[#00629B]">Não autorizar anúncio</DialogTitle>
                    <Description>Você realmente deseja não autorizar a publicação desse anúncio?</Description>
                </DialogHeader>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={handleCancelRefused}
                        className="w-full bg-transparent text-[#00629B] font-semibold border-[#00629B] border py-2 px-4 rounded-md hover:bg-[#E6E6E6] focus:outline-none transition-all duration-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleRefusedAd}
                        className="w-full bg-[#00629B] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#004B75] focus:outline-none transition-all duration-300"
                    >
                        Confirmar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
