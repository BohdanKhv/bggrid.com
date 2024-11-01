import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { logoSvg } from '../../assets/img/logo'
import { Button } from "../../components"


const Auth = ({children}) => {
    const { pathname } = useLocation()

    return (
        <main className="flex-1 h-min-100 animation-fade-in bg-secondary bg-sm-main flex-grow-1 flex justify-center align-center">
            <div className="flex-1 flex-grow-1 flex flex-col w-max-500-px w-100 h-100 w-min-500-px w-sm-min-auto w-sm-available">
                <div className="flex-grow-1 flex justify-center flex-1 align-center mx-sm-0">
                    <div className="flex-grow-1 flex justify-center">
                        <div className="flex flex-col flex-grow-1 gap-3">
                            <div className="flex flex-col gap-5 bg-main border border-radius-lg p-6 border-radius-sm-none justify-sm-center px-sm-3">
                                <div className="flex flex-col justify-sm-center justify-between flex-1">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Auth