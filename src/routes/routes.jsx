import React, { useContext } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import MainPage from '../components/MainPage'
import AuthContext from '../contexts/auth'

import Login from '../pages/login'
import Search from '../pages/search'
import Profile from '../pages/profile'
import ProfileAirfoilSearch from '../pages/profileAirfoilSearch'
import AirfoilPage from '../pages/airfoil'

const Routes = () => {

    const { isLogged } = useContext(AuthContext)

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' render={(routeProps) => (isLogged ? <Redirect to={{ pathname: '/', state: { from: routeProps.location } }} /> : <Login {...routeProps} />)} />

                <MainPage>
                    <Route exact path='/' component={Profile} />
                    <Route exact path='/search' component={Search} />
                    <Route exact path='/profile' component={Profile} />
                    <Route exact path='/profile/airfoils' component={ProfileAirfoilSearch} />
                    <Route exact path='/profile/airfoils/:id' component={ProfileAirfoilSearch} />
                    <Route exact path='/airfoils/:id' component={AirfoilPage} />
                </MainPage>
            </Switch>
        </BrowserRouter>
    )

}

export default Routes