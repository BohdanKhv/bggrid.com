import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, Flip, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Alerts.css'
import Button from './Button';
import { closeIcon } from '../../assets/img/icons';

const Alerts = () => {
    const theme = useSelector((state) => state.local.theme);
    const [currTheme, setCurrTheme] = useState(theme);

    useEffect(() => {
        if(theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setCurrTheme(systemTheme);
        } else if (theme === 'dark') {
            setCurrTheme('dark');
        } else {
            setCurrTheme('light');
        }
    }, [theme]);
    
    return (
        <ToastContainer
            position="bottom-right"
            theme={currTheme === 'dark' ? 'dark' : 'light'}
            autoClose={3000}
            transition={Slide}
            closeButtonClassName="toast-close"
            className="toast-container"
            stacked
            draggable={false}
            hideProgressBar={true}
            closeOnClick={true}
            closeButton={
                ({ closeToast }) => (
                    <Button icon={closeIcon} className="mx-2" variant="link" onClick={closeToast} />
                )
            }
        />
    )
}

export default Alerts