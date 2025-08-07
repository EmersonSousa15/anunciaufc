import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import emialIcon from "../../../assets/icons/email.svg"
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/service/api";

import failed from "../../../assets/icons/failed.svg"
import sucess from "../../../assets/icons/sucess.svg"
import { Loading } from "@/components/Loading/loading";

type ConfirmEmailDialogProp = {
    email: string;
    onOpen: boolean;
    onOpenChange: (open: boolean) => void;
    nextPage: () => void;
    handleSendCodeVerification: (data: any) => void
}

export const ConfirmEmailDialog = ({ email, onOpen, onOpenChange, nextPage, handleSendCodeVerification }: ConfirmEmailDialogProp) => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleConfirmCode = async () => {
        try {
            setIsLoading(true);

            const response = await api.post("/verifyemail", {
                code: code,
                email: email
            })

            if (response?.status === 200) {
                toast({
                    icon: sucess,
                    title: "Código validado!",
                    description: "Continue com o cadastro da sua conta.",
                })

                onOpenChange(false);
                nextPage();
            }

        } catch (error: any) {
            if (error?.status === 400) {
                toast({
                    icon: failed,
                    title: "Código inválido",
                    description: "Verifique o e-mail e tente novamente!",
                })
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Dialog open={onOpen} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col justify-center items-center">
                <DialogHeader>
                    <DialogTitle className="flex flex-col justify-center items-center">
                        <img src={emialIcon} alt="email icon" className="w-10 m-5 " />
                        Verifique o seu e-mail
                    </DialogTitle>
                    <DialogDescription>
                        Foi enviado um código para {email}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                        <InputOTPGroup className="flex gap-2 text-[#00629B] font-bold text-2xl">
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={0} />
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={1} />
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={2} />
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={3} />
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={4} />
                            <InputOTPSlot className="w-14 h-14 rounded-md outline-none border-2 border-[#00629B] " index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="text-[#535862] text-sm justify-center py-2 flex gap-2">
                        <p>Não recebeu o código? </p>
                        <button className="underline cursor-pointer" onClick={() => handleSendCodeVerification({ email: email })}>Clique aqui para reenviar</button>
                    </div>
                </div>
                <DialogFooter className="flex justify-between w-full">
                    <button
                        className="w-full py-3 rounded-md border-2 font-semibold hover:text-gray-500 focus:outline-none"
                        onClick={() => onOpenChange(false)}
                    > Cancelar</button>
                    <button
                        className="w-full py-3 rounded-md text-white font-semibold bg-[#00629B] hover:bg-[#005A8F] focus:outline-none"
                        onClick={() => handleConfirmCode()}
                    >
                        {isLoading ? <Loading /> : "Confirmar"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}