import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const redirectToHome = ['/login', '/login-with-email'];
const redirectToLogin = ['/settings', '/library']

const NotFound = () => {

    const { user } = useSelector(state => state.auth);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && redirectToHome.includes(pathname)) {
            navigate('/');
        } else if (!user && redirectToLogin.includes(pathname)) {
            navigate('/login');
        }
    }, [pathname, user]);

    return (
        user && pathname !== '/' &&
        <div className="h-sm-100 h-100 flex-1">
            <div className="h-100 w-100 flex justify-center align-center">
                <div className="title-2 border-right px-4 weight-500">
                    404
                </div>
                <div className="flex flex-col justify-start px-4">
                    <div className="fs-12">
                        This page could not be found.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound