import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { logoSvg } from '../../assets/img/logo'
import { Button, Image } from "../../components"


const Auth = ({children}) => {
    const { pathname } = useLocation()

    return (
        <main className="flex-1 h-min-100 animation-fade-in bg-sm-main flex-grow-1 flex justify-center align-center">
            <div className="flex-1 align-center flex w-max-500-px w-100 w-min-500-px w-sm-min-auto w-sm-available">
                <div className="container px-sm-3 flex-1">
                    {children}
                </div>
            </div>
            <div className="flex-1 h-100dvh d-sm-none">
                <Image
                    img='/assets/login-bg.png'
                    classNameContainer="h-100 w-100 object-cover cursor-default"
                    classNameImg="h-100 w-100 object-cover"
                />
            </div>
        </main>
    )
}

export default Auth