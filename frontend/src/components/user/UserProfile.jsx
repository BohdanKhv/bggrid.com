import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, Button, Dropdown, Icon } from "../../components"
import { appIcon, bookmarkIcon, businessIcon, chatIcon, closeIcon, filterIcon, flagIcon, gamesIcon, historyIcon, homeIcon, largePlusIcon, libraryIcon, listIcon, locationIcon, loginIcon, logoutIcon, menuIcon, moneyIcon, patchPlusIcon, priceMoreIcon, searchIcon, settingsIcon, starEmptyIcon, starsIcon, userCardIcon, userIcon, usersIcon, vendorIcon } from "../../assets/img/icons"
import { logout } from "../../features/auth/authSlice"

const UserProfile = () => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth);


    return (
        <div>
            <Dropdown
                closeOnSelect
                closeOnEscape
                mobileDropdown
                classNameDropdown="p-0 w-min-200-px"
                dropdownLabel="Menu"
                customDropdown={
                    <Button
                        borderRadius="lg"
                        variant="default"
                        className="border"
                        icon={menuIcon}
                        iconRight={
                            user &&
                            user?.accountType === "jobSeeker" ?
                            <Avatar
                                img={user && user?.jobSeeker?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.jobSeeker?.avatar}` : null}
                                name={user ? `${user?.jobSeeker?.firstName?.slice(0,1)}${user?.jobSeeker?.lastName?.slice(0,1)}` : null}
                                rounded
                                defaultColor={user}
                                icon={userIcon}
                                len={2}
                                avatarColor="0"
                                size="xs"
                            />
                            : user?.accountType === "employer" ?
                                <Avatar
                                    img={user && user?.employer?.logo ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.employer?.logo}` : null}
                                    name={user ? `${user?.employer?.companyName?.slice(0,2)}` : null}
                                    rounded
                                    defaultColor={user}
                                    icon={vendorIcon}
                                    len={2}
                                    avatarColor="0"
                                    size="xs"
                                />
                            : null
                        }
                        dataTooltipContent={user ? user.email : null}
                    />
                }
            >
                <div className="flex flex-col overflow-hidden">
                <div className="flex flex-col py-2">
                        {user ?
                        <>
                        <div className="flex flex-col border-bottom border-secondary overflow-hidden w-max-300-px w-set-sm-auto">
                            {user?.accountType === "jobSeeker" ?
                                <Link className="flex gap-3 overflow-hidden pt-3 pb-3 bg-secondary-hover pointer w-sm-100"
                                    to="/account/account"
                                >
                                    <div className="ps-2">
                                        <Avatar
                                            img={user && user?.jobSeeker?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.jobSeeker?.avatar}` : null}
                                            name={user ? `${user?.email}` : null}
                                            rounded
                                            defaultColor={user}
                                            len={2}
                                            avatarColor="0"
                                        />
                                    </div>
                                    <div className="pe-4">
                                        {user.firstName || user.lastName ?
                                        <div className="fs-16 text-ellipsis-1">
                                            {user?.firstName} {user?.lastName}
                                        </div>
                                        : null}
                                        <div className="fs-14 text-ellipsis-1">
                                            {user?.email}
                                        </div>
                                        <div className="fs-12 text-ellipsis-1 pt-2 text-primary weight-500">
                                            {user?.accountType === "jobSeeker" ? "Job Seeker" : "Employer"}
                                        </div>
                                    </div>
                                </Link>
                            : user?.accountType === "employer" ?
                                <Link className="flex gap-3 overflow-hidden pt-3 pb-3 bg-secondary-hover pointer w-sm-100"
                                    to="/account/account"
                                >
                                    <div className="ps-2">
                                        <Avatar
                                            img={user && user?.employer?.logo ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.employer?.logo}` : null}
                                            name={user ? `${user?.email}` : null}
                                            rounded
                                            defaultColor
                                            len={2}
                                            avatarColor="0"
                                        />
                                    </div>
                                    <div className="pe-4">
                                        {user.accountType === "jobSeeker" ?
                                            user?.jobSeeker.firstName || user?.jobSeeker.lastName ?
                                                <div className="fs-16 text-ellipsis-1">
                                                    {user?.jobSeeker?.firstName} {user?.jobSeeker?.lastName}
                                                </div>
                                            : null
                                        : user?.accountType === "employer" && user?.employer?.companyName ?
                                            <div className="fs-16 text-ellipsis-1">
                                                {user?.employer?.companyName}
                                            </div>
                                        : null}
                                        <div className="fs-14 text-ellipsis-1">
                                            {user?.email}
                                        </div>
                                        <div className="fs-12 text-ellipsis-1 pt-2 text-primary weight-500">
                                            {user?.accountType === "jobSeeker" ? "Job Seeker" : "Employer"}
                                        </div>
                                    </div>
                                </Link>
                            : null
                            }
                        </div>
                        </>
                        : null}
                        {user?.accountType === "jobSeeker" ?
                        <>
                            <Button
                                size="lg"
                                label="Resume"
                                icon={userIcon}
                                variant="text"
                                className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                                to="/account/resume"
                                />
                            <div className="border-bottom"/>
                            </>
                        : user?.accountType === "employer" ?
                        <>
                            <Button
                                size="lg"
                                label="Company"
                                icon={vendorIcon}
                                variant="text"
                                className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                                to="/account/company"
                            />
                            <div className="border-bottom"/>
                            </>
                        : null}
                        <Button
                            size="lg"
                            label="Home"
                            icon={homeIcon}
                            variant="text"
                            className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                            to="/"
                        />
                        <Button
                            size="lg"
                            label="Games"
                            icon={gamesIcon}
                            variant="text"
                            className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                            to={`/games`}
                            // to={`/jobs${user && user.position ? `?q=${user.position}` : ""}${user && user.city && user.state ? `&location=${user.city},+${user.state}` : ""}`}
                        />
                        <Button
                            size="lg"
                            label="Your library"
                            icon={libraryIcon}
                            variant="text"
                            className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                            to="/library"
                        />
                        <Button
                            size="lg"
                            label="Crew"
                            icon={usersIcon}
                            variant="text"
                            className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                            to="/crew"
                        />
                        {user ?
                        <>
                        </>
                        : null}
                            {/* <Button
                                size="lg"
                                label="Saved games"
                                variant="text"
                                to="/my-jobs/saved"
                                icon={bookmarkIcon}
                                className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                            /> */}
                            <div className="border-bottom"/>
                            {user ?
                            <>
                                <Button
                                    size="lg"
                                    label="Log out"
                                    variant="text"
                                    icon={logoutIcon}
                                    className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                                    onClick={() => dispatch(logout())}
                                />
                            </>
                            :
                            <Button
                                size="lg"
                                to="/login"
                                label="Log in"
                                icon={loginIcon}
                                className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                                variant="text"
                            />
                        }
                    </div>
                </div>
            </Dropdown>
        </div>
    )
}

export default UserProfile