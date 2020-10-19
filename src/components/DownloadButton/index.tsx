import React, { useState, useEffect } from 'react'

import './DownloadButton.css'

type DownloadButtonProps = {
    itens: string[],
    onDownload: (currentDropdownValue: string | null) => void,
}

const DownloadButton: React.FC<DownloadButtonProps> = (props) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [currentDropdownValue, setCurrentDropdownValue] = useState<string | null>(null)

    useEffect(() => {
        if (props.itens.length > 0) {
            setCurrentDropdownValue(props.itens[0])
        }
    }, [props.itens])

    const renderDropdownList = () => {
        if (isDropdownOpen) {
            return (
                <ul className="dropdown-list">
                    {props.itens.map((item, index) => (
                        <li className="dropdown-item" key={index} onClick={() => setCurrentDropdownValue(item)} ><span>{item}</span></li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <div className='download-btn-wrapper'>
            <div className="download-btn" onClick={() => props.onDownload(currentDropdownValue)}>
                <span>Dowload</span>
                <i className="material-icons download-icon">get_app</i>
            </div>
            <div className="download-extention-dropdown" onClick={() => setIsDropdownOpen((currentState) => !currentState)}>
                <div className="download-extention-dropdown-btn">
                    {currentDropdownValue}
                    <i className="material-icons dropdown-state-icon">{`${isDropdownOpen ? "expand_less" : "expand_more"}`}</i>
                </div>
                {renderDropdownList()}
            </div>
        </div>
    )
}

export default DownloadButton
