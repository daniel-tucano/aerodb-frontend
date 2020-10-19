import React from 'react'

import './InputBox.css'

const InputBox = (props) => {

    const renderLateralIcon = (props) => {
        if (props.Icon) {
            return (
                <img src={props.Icon} alt="" className='input-icon' />
            )
        } else {
            return
        }
    }

    const onInputChange = (e) => {
        if (props.onChange) {
            props.onChange(e.target.value)
        }
        return
    }

    return (
        <div className='input-box'>
            <input
                type="text"
                name={props.Name ? props.Name : ''}
                placeholder={props.PlaceHolder ? props.PlaceHolder : ''}
                onChange={onInputChange}
                onKeyPress={(e) => (e.key === 'Enter' ? props.onEnter() : null)}
                { ...props.inputProps }
            />
            {renderLateralIcon(props)}
        </div>
    )
}

export default InputBox
