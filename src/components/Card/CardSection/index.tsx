import React, { useState } from 'react'

import './CardSection.css'

type CardSectionProps = {
    headerText: string,
    className?: string,
}

const CardSection: React.FC<CardSectionProps> = (props) => {

    const [collapseIsOpen, setCollapseIsOpen] = useState(true)

    return (
        <div className={`card-section ${props.className ? props.className : '' }`}  >

            <div className="card-section-header">
                <span className="header-title">
                    {props.headerText}
                </span>
                <button className="open-close-collapse" onClick={() => setCollapseIsOpen((currentValue) => (!currentValue))}>
                    <i className='material-icons md-24'>{collapseIsOpen ? "expand_less" : "expand_more"}</i>
                </button>
            </div>

            <div className="card-section-content">
                <div className={`collapse ${collapseIsOpen ? 'show' : ''}`}>
                    {props.children}
                </div>
            </div>

        </div>
    )
}

export default CardSection
