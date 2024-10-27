import { useState } from "react"
import { arrowDownShortIcon, closeIcon, downArrowIcon, patchPlusIcon, xIcon } from "../../assets/img/icons"
import Button from "./Button"
import Dropdown from "./Dropdown"
import "./styles/FilterDropdown.css"
import IconButton from "./IconButton"

const FilterDropdown = ({ children, label, applied, onApply, onClear, mobileDropdown }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mobileDropdown={mobileDropdown}
            dropdownLabel={mobileDropdown ? label : null}
            customDropdown={
                <div className={`filter-dropdown bg-main`}>
                    <div className={`${applied?.length > 0 ? "filter-dropdown-icon-applied " : "pointer-events-none user-select-none "}filter-dropdown-icon`}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (applied?.length > 0) {
                                onClear()
                            }
                        }}
                    >
                        { applied?.length > 0 ? xIcon : patchPlusIcon }
                    </div>
                    <div className="filter-dropdown-label">{ label || 'Filter' }</div>
                    { applied?.length > 0 ?
                    <>
                    <div className="border-left h-75 border-secondary"/>
                    <div className="filter-dropdown-applied bold text-nowrap">{applied?.slice(0,3)?.map( a => a).join(', ')}{applied?.length > 3 ? ` ... +${applied?.length - 3}` : null}</div>
                    <div className={`pointer-events-none user-select-none filter-dropdown-icon`}>
                        {downArrowIcon}
                    </div>
                    </>
                    : null }
                </div>
            }
            
        >
            <div className="p-2">
                {
                mobileDropdown && window.innerWidth < 768 ? null :
                label &&
                <div className="flex justify-between gap-4 overflow-hidden pb-4">
                    <div className="fs-14 weight-600 text-ellipsis">Filter by <span className="text-lowercase">{label}</span></div>
                    <IconButton
                        icon={closeIcon}
                        size="xs"
                        type="secondary"
                        muted
                        variant="text"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
                }
                {children}
                { onApply &&
                    <Button
                        label="Apply"
                        variant="filled"
                        type="primary"
                        onClick={() => {
                            setIsOpen(false)
                            onApply()
                        }}
                        smSize="lg"
                        className="mt-4 text-center justify-center w-100"
                    />
                }
            </div>
        </Dropdown>
    )
}

export default FilterDropdown