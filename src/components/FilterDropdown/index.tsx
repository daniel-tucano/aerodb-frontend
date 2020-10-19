import React, { useState } from 'react'


import './FIlterDropdown.css'

interface FilterDropdownProps {
    keyValueList: { key: string, value: string }[],
    value: { key: string, value: string },
    onChange: (keyValue: { key: string, value: string }) => void,
    resetDropdown: boolean,
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ keyValueList, value, onChange }) => {

    const [drowpdownIsOpen, setDrowpdownIsOpen] = useState(false)

    const renderDropdownList = () => {

        if (drowpdownIsOpen) {
            return (
                <ul className="filter-dropdown-list">
                    {keyValueList.map((keyValue, index) => {
                        return <li className="filter-dropdown-list-value" key={index} onClick={() => {onChange(keyValue); setDrowpdownIsOpen(false)}}>{keyValue.key}</li>
                    })}
                </ul>
            )
        } else {
            return undefined
        }
    }

    return (
        <div className='filter-dropdown-wrapper'>
            <div className="filter-dropdown-btn" onClick={() => { drowpdownIsOpen ? setDrowpdownIsOpen(false) : setDrowpdownIsOpen(true) }}>
                <div className="filter-dropdown-value">{value}</div>
                <i className="material-icons dropdown-state-icon">{`${drowpdownIsOpen ? "expand_less" : "expand_more"}`}</i>
            </div>
            {renderDropdownList()}
        </div>
    )
}

export default FilterDropdown
