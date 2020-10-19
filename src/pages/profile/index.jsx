import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../contexts/auth'
import Card from '../../components/Card'
import plotAirfoilData from '../../functions/plotAirfoilData'

// import Plot from 'react-plotly.js'

import './Profile.css'

const Profile = () => {

    const { isLogged, user, userData } = useContext(AuthContext)

    const [airfoilName, setAirfoilName] = useState('')

    const [airfoilPlotSVG, setAirfoilPlotSVG] = useState(undefined)

    useEffect( () => {
        if (userData) {
            userData.userAirfoils[3].get().then((result) => {
                setAirfoilName(result.data().name)
                setAirfoilPlotSVG(plotAirfoilData(result.data().geometrie))
            })
        }
    },[userData])

    return (
        <div className='profile-wrapper'>
            <Card>
                <div className="card-header-row">
                    <img src={isLogged ? user.photoURL : ''} alt="" className="profile-pic" />
                    <span className='user-name'>{user ? user.displayName : ''}</span>
                </div>
            </Card>
            <Card>
                <div className="card-header-row">
                    <span className='title'>Airfoils</span>
                </div>
                <div className="main-card-area">
                    <div className="plot">
                        <span className='airfoil-name'>{airfoilName}</span>
                        {airfoilPlotSVG}
                    </div>
                    <div className="buttons-row">
                        <Link className="all-airfoils link-button" to='/profile/airfoils' >
                            <span>See all Airfoils</span>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}



export default Profile
