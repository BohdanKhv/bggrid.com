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
            dropdownLabel={mobileDropdown ? `Filter by ${label}` : null}
            customDropdown={
                <div className={`filter-dropdown${applied.length > 0 ? " filter-applied": ""}`}>
                    <div className={`filter-dropdown-label`}>{ label || 'Filter' }</div>
                    { applied?.length > 0 ?
                    <>
                    <div className="border-left h-75 border-secondary"/>
                    <div className="filter-dropdown-applied bold text-nowrap">({applied?.length})</div>
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
                <dib className="flex gap-2 align-center justify-end mt-4 flex-sm-col">
                    <Button
                        label="Clear"
                        variant="outline"
                        type="secondary"
                        onClick={onClear}
                        smSize="lg"
                        className="text-center justify-center w-sm-100"
                    />
                    <Button
                        label="Apply"
                        variant="filled"
                        type="primary"
                        onClick={() => {
                            setIsOpen(false)
                            onApply()
                        }}
                        smSize="lg"
                        className="text-center justify-center w-sm-100"
                    />
                </dib>
                }
            </div>
        </Dropdown>
    )
}

export default FilterDropdown