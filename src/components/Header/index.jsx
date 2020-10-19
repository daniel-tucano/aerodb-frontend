import React, { useContext } from 'react'
import SideBarContext from '../../contexts/SideBarContext'

import './Header.css'

import hamburguerIcon from '../../assets/icons/menu-24px.svg'
import AeroDBLogoName from '../../assets/icons/AeroDB_logo_name.svg'

const Header = () => {

    const { activeLeftSideBar, activeRightSideBar } = useContext(SideBarContext)

    return (
        <div className="header">
            <button className="menu-hamburger" onClick={activeLeftSideBar}>
                <img src={hamburguerIcon} alt=""/>
            </button>
            <img src={AeroDBLogoName} alt="" className="logo-nome"/>
            <div className="open-right-side-bar-btn" onClick={activeRightSideBar}>
                <i className="material-icons open-right-side-bar-icon">inbox</i>
            </div>
        </div>
    )
}

export default Header
