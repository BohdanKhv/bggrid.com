import { useDispatch, useSelector } from 'react-redux'
import { logoRevertSvg } from '../../assets/img/logo'
import { checkIcon, linkIcon, loginIcon, settingsIcon } from '../../assets/img/icons'
import { applyToListing } from '../../features/apply/applySlice'
import Button from '../ui/Button'
import { useMemo, useState } from 'react'


const UserApply = ({ listing, size, className }) => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    const { isLoading, myApplies } = useSelector(state => state.apply)
    const [clickedApply, setClickedApply] = useState(false)

    const applyListingIds = useMemo(() => { return myApplies.map(apply => apply.listing?._id) }, [myApplies])

    return (
        !user ?
            <Button
                smSize="lg"
                size={size || ""}
                type="primary"
                borderRadius="lg"
                className={className || ''}
                variant="filled"
                label="Login to Apply"
                to="/login"
            />
        : user?.accountType === "employer" ?
            null
        : user?.email === listing?.email ? 
            <Button
                smSize="lg"
                size={size || ""}
                type="warning"
                borderRadius="lg"
                className={className || ''}
                variant="default"
                isLoading={isLoading}
                icon={settingsIcon}
                label="Manage"
                target={"_blank"}
                to={`/manage-jobs/${listing?._id}/applications`}
            />
        : applyListingIds.includes(listing?._id) ?
            <Button
                smSize="lg"
                size={size || ""}
                type="success"
                borderRadius="lg"
                className={className || ''}
                variant={"text"}
                isLoading={isLoading}
                label="Applied"
                target={"_blank"}
                to="/my-jobs/applied"
            />
        : listing?.premium?.applyUrl ?
        <>
        {clickedApply ?
            <div className="flex gap-3 justify-between align-center flex-sm-col border-radius animation-slide-in">
                <div className="flex flex-col">
                    <div className="fs-14 weight-600 text-nowrap">
                        Did you apply?
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button
                        smSize="lg"
                        size={size || ""}
                        label="Yes"
                        variant="filled"
                        type="primary"
                        disabled={isLoading}
                        borderRadius="lg"
                        onClick={() => {
                            dispatch(applyToListing(listing?._id))
                            setClickedApply(false)
                        }}
                        className="flex-shrink-0"
                    />
                    <Button
                        smSize="lg"
                        size={size || ""}
                        label="No"
                        variant="outline"
                        type="secondary"
                        disabled={isLoading}
                        borderRadius="lg"
                        onClick={() => {
                            setClickedApply(false)
                        }}
                        className="flex-shrink-0"
                    />
                </div>
            </div>
        :
            <Button
                smSize="lg"
                size={size || ""}
                type="primary"
                borderRadius="lg"
                className={className || ''}
                variant={"filled"}
                isLoading={isLoading}
                label="Apply"
                icon={linkIcon}
                dataTooltipContent={listing?.premium?.applyUrl}
                target={"_blank"}
                to={listing?.premium?.applyUrl}
                onClick={() => {
                    setClickedApply(true)
                }}
            />
        }
        </>
        :
        <Button
            smSize="lg"
            size={size || ""}
            type="primary"
            borderRadius="lg"
            className={className || ''}
            variant={"filled"}
            isLoading={isLoading}
            label={"Easy Apply"}
            icon={logoRevertSvg}
            onClick={() => {
                dispatch(applyToListing(listing?._id))
            }}
        />
    )
}

export default UserApply