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
                classNameDropdown="p-0 w-min-200-px"
                dropdownLabel="Menu"
                customDropdown={
                    <Button
                        borderRadius="lg"
                        variant="default"
                        className="px-1"
                        // icon={menuIcon}
                        iconRight={
                            user ?
                            <Avatar
                                img={user && user?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.avatar}` : null}
                                name={user ? `${user?.email}` : null}
                                rounded
                                avatarColor="1"
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
                        {/* <div className="flex flex-col border-bottom border-secondary overflow-hidden w-max-300-px w-set-sm-auto">
                            <Link className="flex gap-3 overflow-hidden pt-3 pb-3 bg-secondary-hover pointer w-sm-100 align-center"
                                to="/settings/account"
                            >
                                <div className="ps-2">
                                    <Avatar
                                        img={user && user?.avatar ? `${import.meta.env.VITE_USERS_S3_API_URL}/${user?.avatar}` : null}
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
                                </div>
                            </Link>
                        </div> */}
                        </>
                        : null}
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
                            {/* <div className="border-bottom"/> */}
                            {user ?
                            <>
                                <Button
                                    size="lg"
                                    label="Profile"
                                    variant="text"
                                    icon={userIcon}
                                    className="text-start justify-start weight-400 border-radius-none border-none bg-secondary-hover"
                                    to="/settings/account"
                                />
                            <div className="border-bottom"/>
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