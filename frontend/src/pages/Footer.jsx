import { Button } from '../components'
import { emailIcon, instagramIcon, loginIcon } from '../assets/img/icons'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Footer = () => {
    const { pathname } = useLocation()

    const { user } = useSelector(state => state.auth)

    return (
        (['/','/terms','/faq','/pricing','/privacy'].includes(pathname) || pathname.startsWith('/salaries') || pathname.startsWith('/interviews')) &&
        <footer className="bg-black container px-sm-2 py-6 flex flex-col">
            <div className="w-max-md mx-auto h-100 flex flex-col flex-1 gap-6">
                <div className="flex justify-between flex-1 flex-sm-col gap-sm-6">
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            SITE MAP
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Home"
                            to="/"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Salaries"
                            to="/salaries"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Interviews"
                            to="/interviews"
                        />
                        {user && user.accountType === 'employer' ?
                        <>
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Account"
                            to="/account/account"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Company Settings"
                            to="/account/company"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Company Profile"
                            to={`/employers/${user._id}`}
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Jobs"
                            to="/jobs"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Manage Jobs"
                            to="/manage-jobs"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Post Job"
                            to="/new"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Post for Free"
                            to="/free"
                        />
                        </>
                        : user && user.accountType === 'jobSeeker' ?
                        <>
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Account"
                                to="/account/account"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Resume"
                                to="/account/resume"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Jobs"
                                to="/jobs"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Saved Jobs"
                                to="/my-jobs/saved"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Recently Viewed"
                                to="/my-jobs/viewed"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Applied"
                                to="/my-jobs/applied"
                            />
                        </>
                        : 
                        <>
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Jobs"
                                to="/jobs"
                            />
                            <Button
                                muted
                                className="text-white justify-start weight-400"
                                variant="link"
                                label="Login"
                                to="/login"
                            />
                        </>
                        }
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            About
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Pricing"
                            to="/pricing"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="FAQ"
                            to="/faq"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Privacy Policy"
                            to="/privacy"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Terms of Service"
                            to="/terms"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="fs-14 weight-600 text-white text-uppercase pb-4">
                            Contact
                        </div>
                        <Button
                            muted
                            className="text-white justify-start weight-400 fill-white"
                            variant="link"
                            icon={emailIcon}
                            label="contact@increw.cafe"
                            to="mailto:contact@increw.cafe"
                            target="_blank"
                        />
                        <Button
                            muted
                            className="text-white justify-start weight-400"
                            variant="link"
                            label="Instagram"
                            icon={instagramIcon}
                            to="https://www.instagram.com/increw.cafe/"
                        target="_blank"
                        />
                    </div>
                </div>
                    <div className="fs-12 text-white opacity-75 text-center">
                        © 2024 In Crew Cafe. All rights reserved.
                    </div>
            </div>
        </footer>
    )
}

export default Footer