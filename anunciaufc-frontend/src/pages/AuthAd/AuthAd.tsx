import { Loading } from "@/components/Loading/loading";
import { Logo } from "@/components/Logo/logo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdInfo, useGetAdUnauth } from "@/hooks/useGetAdUnauth";
import { ArrowLeft, Check, Clock, EyeIcon, Mail, User2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AcceptDialog } from "./components/accept-dialog";
import { RefusedDialog } from "./components/refused-dialog";
import { dataAuthAd } from "@/hooks/useAuthAd";

export function AuthAd() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetAdUnauth();
    const [openRefused, setOpenRefused] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [dataAuthAd, setDataAuthAd] = useState<dataAuthAd>({} as dataAuthAd);

    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate()}/${d.getUTCMonth() < 10 ? "0" + d.getUTCMonth() : d.getUTCMonth()}/${d.getUTCFullYear()}, ${new Date(date).getUTCHours()}:${new Date(date).getUTCMinutes()}`;
    };

    const handleAuthorization = (ad: AdInfo, status: string) => {

        const data = {
            id: ad.id,
            email: ad.email,
            status: status
        }

        setDataAuthAd(data);

        status === 'accept' ? setOpenConfirm(true) : setOpenRefused(true)
    }


    return (
        <>
            <header className="w-screen p-3 shadow-md">
                <Logo />
            </header>
            <main className="h-dvh w-screen flex flex-col items-center bg-[#EDEDED]">
                <div className="w-full mt-10 flex">
                    <button onClick={() => navigate(-1)} className="absolute left-10">
                        <ArrowLeft color="#00629B" size={30} />
                    </button>
                    <h1 className="text-[#00629B] text-xl text-center w-full">
                        Autorizar anúncios
                    </h1>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <Table className="w-[80%] m-auto mt-5">
                        <TableHeader className="uppercase">
                            <TableHead className="text-center">Nome</TableHead>
                            <TableHead className="text-center">E-mail</TableHead>
                            <TableHead className="text-center">Data</TableHead>
                            <TableHead className="text-center">Verificar Anúncio</TableHead>
                            <TableHead className="text-center">Autorização</TableHead>
                        </TableHeader>
                        <TableBody className="w-full ">
                            {data?.data && data?.data.length > 0 && data?.data.map((ad) => {
                                return (
                                    <TableRow key={ad.id} className="bg-white shadow-lg hover:bg-white">
                                        <TableCell>
                                            <div className="text-center flex justify-center items-center gap-2">
                                                <User2 />
                                                <p>{ad.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center flex justify-center items-center gap-2">
                                                <Mail />
                                                <p>{ad.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell >
                                            <div className="text-center flex justify-center items-center gap-2">
                                                <Clock />
                                                <p>{formatDate(ad.created_at)}</p>
                                            </div>

                                        </TableCell>
                                        <TableCell>
                                            <button onClick={() => navigate("/produto/:id")} className="rounded-md bg-[#00629B] w-full text-white flex justify-center items-center gap-2 py-1 text-md font-semibold">
                                                <EyeIcon color="#FFFF" />
                                                <p>Ver anúncio</p>
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center flex justify-center items-center gap-10 ">
                                                <button onClick={() => handleAuthorization(ad, "accept")}>
                                                    <Check color="#0C6700" />
                                                </button>
                                                <button onClick={() => handleAuthorization(ad, "refused")}>
                                                    <X color="#FF0000" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            }
                            {!isLoading && data?.data.length === 0 &&
                                <TableRow className="w-full text-center bg-white shadow-lg hover:bg-white">
                                    <TableCell colSpan={6} className="text-xl">
                                        Nenhum anúnio pendente
                                    </TableCell>
                                </TableRow>
                            }

                            {isLoading &&
                                <TableRow className="w-full text-center">
                                    <TableCell colSpan={6}>
                                        <Loading />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </div>

                {openConfirm &&
                    <AcceptDialog dataAuthAd={dataAuthAd} handleOpenConfirm={setOpenConfirm} openConfirm={openConfirm} />
                }

                {openRefused &&
                    <RefusedDialog dataAuthAd={dataAuthAd} handleOpenRefused={setOpenRefused} openRefused={openRefused} />
                }
            </main >
        </>
    )
}