import React from 'react'

import './CardHeader.css'

const CardHeader: React.FC = (props) => {
    return (
        <div className="card-header">
            <span className="title">
                {props.children}
            </span>
        </div>
    )
}

export default CardHeader
