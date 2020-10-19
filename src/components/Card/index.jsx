import React from 'react'
import './Card.css'
import CardHeader from './CardHeader'

const Card = (props) => {

    const renderCardHeader = () => {
        if (props.headerText) {
            return (
                <CardHeader>
                    {props.headerText}
                </CardHeader>
            )
        } else {
            return undefined
        }
    }

    return (
        <div className={`card ${props.className ? props.className : ''}`}>
            {renderCardHeader()}
            <div className="card-content">
                {props.children}
            </div>
        </div>
    )
}

export default Card
