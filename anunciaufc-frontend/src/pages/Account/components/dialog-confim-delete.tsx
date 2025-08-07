import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import deleteIcon from "../../../assets/icons/failed.svg";
import { Loading } from "@/components/Loading/loading";
import { useDeleteUser } from "@/hooks/useDeleteUser";

type deleteConfirmProps = {
    openDeleteModal: boolean;
    setOpenDeleteModal: (open: boolean) => void;
}

export const ConfirmDeleteDialog = ({ openDeleteModal, setOpenDeleteModal }: deleteConfirmProps) => {
    const { mutate: deleteMutate, isPending: isPendingDelete } = useDeleteUser();

    const handleChangeOpen = () => {
        setOpenDeleteModal(!openDeleteModal);
    }

    const handleDeleteUser = () => {
        deleteMutate();
    }

    return (
        <Dialog open={openDeleteModal} onOpenChange={handleChangeOpen}>
            <DialogContent className="flex flex-col justify-center items-center ">
                <DialogHeader>
                    <DialogTitle className="flex flex-col justify-center items-center">
                        <img src={deleteIcon} alt="email icon" className="w-10 m-5 " />
                        Confirmação de Exclusão
                    </DialogTitle>
                    <DialogDescription>
                        Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full flex flex-col gap-3 md:gap-1">
                    <button
                        className="w-full py-3 rounded-md border-2 font-semibold hover:text-gray-500 focus:outline-none"
                        onClick={() => handleChangeOpen()}
                    > Cancelar</button>
                    <button
                        className="w-full py-3 rounded-md text-white font-semibold bg-[#D92D20] hover:bg-[#D92D20] focus:outline-none"
                        onClick={() => handleDeleteUser()}
                    >
                        {isPendingDelete ? <Loading /> : "Confirmar"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}