import logo from "../../assets/logo.svg"

export const Logo = ({style}: any) => {
    return (
        <>
            <div className={`flex items-center ${style}`}>
                <img src={logo} alt="icon-logo" width={35}/>
                <p className="text-2xl font-bold">ANUNCIA<span className="text-[#00629B]">UFC</span></p>
            </div>
        </>
    )
}