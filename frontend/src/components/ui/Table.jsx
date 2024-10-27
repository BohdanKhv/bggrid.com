import { useEffect, useState } from 'react'
import './styles/Table.css'
import Icon from './Icon'
import { downArrowIcon, leftArrowSmIcon, largePlusIcon, rightArrowIcon, upArrowIcon, arrowUpShortIcon, moreHorizontalIcon } from '../../assets/img/icons'
import IconButton from './IconButton'
import SelectBasic from './SelectBasic'
import Dropdown from './Dropdown'
import CheckBox from './CheckBox'
import Avatar from '../ui/Avatar'
import Button from './Button'

const Table = ({
    rows,
    columns,
    fixed,
    addFields,
    allColumns,
}) => {
    const [sort, setSort] = useState({
        field: null,
        order: null
    })
    const [selectedColumns, setSelectedColumns] = useState(columns)

    const handleSort = (field) => {
        let order = 'asc'
        if(sort.field === field && sort.order === 'asc') order = 'desc'
        setSort({ field, order })
    }


    return (
        <>
        <div className="pos-relative flex flex-col flex-grow-1 h-max-100-pct overflow-y-scroll">
        {addFields ?
            <div className="em-table-add-fields">
                <Dropdown
                    customDropdown={
                        <IconButton 
                            icon={largePlusIcon}
                            size="sm"
                        />
                    }
                >
                    <CheckBox
                        onClick={() => {
                            if(selectedColumns.length === allColumns.length) {
                                setSelectedColumns([])
                            } else {
                                setSelectedColumns(allColumns)
                            }
                        }}
                        checked={selectedColumns?.length === allColumns?.length}
                        label="All fields"
                        className="px-4 py-3 hover border-radius-none"
                    />
                    {allColumns.map((column) => (
                        <CheckBox
                            key={`field-${column.field}`}
                            onClick={() => {
                                if(selectedColumns.find(a => a.field === column.field)) {
                                    setSelectedColumns(selectedColumns.filter(a => a.field !== column.field))
                                } else {
                                    setSelectedColumns([...selectedColumns, column])
                                }
                            }}
                            checked={selectedColumns.find(a => a.field === column.field)}
                            label={column.headerName}
                            className="px-4 py-3 hover border-radius-none"
                        />
                    ))}
                </Dropdown>
            </div> 
        : null}
        <div className="overflow-x-auto flex-grow-1">
            <div className="w-min-600-px">
            <table className={`em-table${fixed ? ' em-table-fixed' : ''}${addFields ? ' em-table-addable' : ''}`}>
                <thead>
                    <tr>
                        {selectedColumns.map((column) => (
                            <th key={column.field} className={`em-table-cell pointer${column.className ? ` ${column.className}` : ''}`}
                                onClick={() => column.sortable ? handleSort(column.field) : null}
                            >
                                <div className="em-table-cell-inner">
                                    {column.headerName}
                                    {column.sortable
                                    && sort.field === column.field
                                    ? (
                                        <div className="ms-2">
                                            <Icon
                                                className={
                                                    `transition-duration ${sort.field === column.field && sort.order === 'desc' ?
                                                        "transform-rotate-180"
                                                    : ''}`
                                                }
                                                size="sm"
                                                icon={arrowUpShortIcon}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ?
                        <tr>
                            <td className={`em-table-cell text-secondary`}>
                                No results found
                            </td>
                        </tr>
                    : selectedColumns.length === 0 ?
                        <tr>
                            <td className={`em-table-cell text-secondary`}>
                                No fields selected
                            </td>
                        </tr>
                    : null}
                    {rows
                    .map((row, i) => (
                        <tr key={`${i}-col`}>
                            {selectedColumns.map((column) => (
                                <td key={column.field} className={`em-table-cell${row.onClick ? ' pointer' : ""}${row[column.field] && row[column.field].className ? ` ${row[column.field].className}` : ''}`}
                                    onClick={() => row[column.field]?.type !== 'action' && row.onClick ? row.onClick() : null}
                                >
                                    {row[column.field] && (row[column.field].className || row[column.field].value) ? row[column.field].value : row[column.field] || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
        </div>
        </>
    )
}

export default Table