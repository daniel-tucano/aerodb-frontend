import React from 'react'

import './List.css'

interface ListProps {
    className?: string,
}

const defaultListProps:ListProps = {
    className: '',
}

const List: React.FC<ListProps> = (props) => {
    return (
        <>
            <ul className={`styled-list ${props.className}`}>
                {props.children}
            </ul>
        </>
    )
}

List.defaultProps = defaultListProps

export default List