import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ErrorInfo, Button } from "../../components";
import { errorIcon } from "../../assets/img/icons";
import { useSelector } from "react-redux";

const redirectToHome = ['/login', '/login-with-email'];
const redirectToLogin = ['/manage-jobs', '/my-jobs', '/settings', '/free', '/account']

const NotFound = () => {

    const { user } = useSelector(state => state.auth);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && redirectToHome.includes(pathname)) {
            navigate('/');
        } if (!user && redirectToLogin.find(path => pathname.startsWith(path))) {
            navigate('/login');
        }
    }, [pathname, user]);

    return (
        <div className="flex-grow-1 flex flex-col align-center justify-center flex-1 h-min-100">
            <div className="h-100 w-100 flex flex-col justify-center align-center">
                <div className="fs-96 bold line-height-1">
                    404
                </div>
                <div className="flex flex-col justify-start px-4">
                    <div className="fs-12">
                        This page could not be found.
                    </div>
                    <Button
                        variant="filled"
                        type="secondary"
                        size="sm"
                        className="mt-4"
                        to="/jobs"
                        label="Find Jobs"
                    />
                </div>
            </div>
        </div>
    )
}

export default NotFound