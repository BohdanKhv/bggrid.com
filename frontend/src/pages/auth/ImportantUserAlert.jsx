import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../../components';
import { useLocation } from 'react-router-dom';

const ImportantUserAlert = () => {
    const { user } = useSelector(state => state.auth);
    const { pathname } = useLocation();

    return (
        !pathname.startsWith('/settings') &&
        user && user?.accountType === 'jobSeeker' ?
            !user?.jobSeeker?.firstName || !user?.jobSeeker?.lastName || !user?.jobSeeker?.avatar ?
            <div className="pt-header w-100 z-2">
                <div className="h-set-50-px w-100 tag-primary">
                    <div className="w-max-md mx-auto h-100">
                        <div className="container h-100 px-sm-2">
                            <div className="flex align-center justify-between h-100 gap-2">
                                <h5>
                                    Completing your profile will help you to find a job faster.
                                </h5>
                                <Button
                                    label="Complete Profile"
                                    to="/account/resume"
                                    variant="secondary"
                                    type="default"
                                    className="flex-shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : null
        : 
        pathname === '/new' &&
        <div className="pt-header z-2 w-100">
            <div className="w-100 tag-primary py-2">
                <div className="w-max-md mx-auto h-100">
                    <div className="container h-100 px-sm-2">
                        <div className="flex align-center justify-between h-100 gap-2">
                            <h5 className="weight-500">
                                Use <strong className="bold">WELCOME90</strong> coupon code at the checkout for 90% discount on all job postings. <span className="bold">Limited time offer!</span>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportantUserAlert