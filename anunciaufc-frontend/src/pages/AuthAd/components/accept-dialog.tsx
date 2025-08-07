import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-toast";
import attetion from "../../../assets/icons/attetion.svg";
import { dataAuthAd, useAuthAd } from "@/hooks/useAuthAd";
import { toast } from "@/hooks/use-toast";


type ConfirmProps = {
    openConfirm: boolean;
    handleOpenConfirm: (value: boolean) => void;
    dataAuthAd: dataAuthAd;
};

export const AcceptDialog = ({ openConfirm, handleOpenConfirm, dataAuthAd }: ConfirmProps) => {
    const mutation = useAuthAd();

    const handleCancelConfirm = () => {
        handleOpenConfirm(false);
    }

    const handleAceptAd = () => {
        mutation.mutate(dataAuthAd);
    }

    if (mutation.isSuccess) {
        toast({
            title: "Anúncio aceito!",
            description: "Um e-mail foi enviado para o usuário e o anúncio foi publicado."
        })

        handleCancelConfirm();
    }


    return (
        <Dialog open={openConfirm} onOpenChange={handleOpenConfirm}>
            <DialogContent className="w-[400px] m-auto">
                <DialogHeader>
                    <img src={attetion} alt="atenção" className="w-12 mb-3"/>
                    <DialogTitle className="text-[#00629B]">Autorizar anúncio</DialogTitle>
                    <Description>Você realmente deseja autorizar a publicação desse anúncio?</Description>
                </DialogHeader>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={handleCancelConfirm}
                        className="w-full bg-transparent text-[#00629B] font-semibold border-[#00629B] border py-2 px-4 rounded-md hover:bg-[#E6E6E6] focus:outline-none transition-all duration-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleAceptAd}
                        className="w-full bg-[#00629B] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#004B75] focus:outline-none transition-all duration-300"
                    >
                        Confirmar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
