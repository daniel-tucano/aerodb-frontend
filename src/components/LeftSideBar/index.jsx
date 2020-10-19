import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import SideBarContext from '../../contexts/SideBarContext'
import AuthContext from '../../contexts/auth'
import List from '../List'

import './LeftSideBar.css'

import hamburguerIconBlack from '../../assets/icons/menu-24px-black.svg'
import profileIcon from '../../assets/icons/account_circle-24px.svg'
import loginIcon from '../../assets/icons/login-24px.svg'
import logoutIcon from '../../assets/icons/logout.svg'
import searchIcon from '../../assets/icons/search-24px.svg'
import docsIcon from '../../assets/icons/menu_book-24px.svg'

function LeftSideBar() {

    const { leftSideBarIsActive, desactiveLeftSideBar } = useContext(SideBarContext)
    const { isLogged, signOut } = useContext(AuthContext)

    const renderLogOut = (isLogged) => {
        if (isLogged) {
            return (
                <List className='logout-list'>
                    <li className="logout-item">
                        <button onClick={signOut}>
                            <img src={logoutIcon} alt="" />
                            <span>Log Out</span>
                        </button>
                    </li>
                </List>
            )
        } else {
            return
        }
    }

    return (
        <div className={`left-side-bar-wrapper ${leftSideBarIsActive ? 'open' : ''}`}>
            <div className="menu-area">
                <div className="menu-line">
                    <button onClick={desactiveLeftSideBar}>
                        <img src={hamburguerIconBlack} alt="Close Menu" />
                    </button>
                    <span>Menu</span>
                </div>
            </div>
            <div className="list-area">
                <List className='list'>
                    <li className="login-profile-item">
                        <Link to={isLogged ? '/profile' : '/login'} className='link-button'>
                            <img src={isLogged ? profileIcon : loginIcon} alt="Profile" />
                            <span>{isLogged ? 'Profile' : 'Sign In'}</span>
                        </Link>
                    </li>
                    <li className="search-item">
                        <Link to='/search' className='link-button'>
                            <img src={searchIcon} alt="" />
                            <span>Search</span>
                        </Link>
                    </li>
                    <li className="docs-item">
                        <Link to='/docs' className='link-button'>
                            <img src={docsIcon} alt="" />
                            <span>Docs</span>
                        </Link>
                    </li>
                </List>
                {renderLogOut(isLogged)}
            </div>
        </div>
    )

}

export default LeftSideBar