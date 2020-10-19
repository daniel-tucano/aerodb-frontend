import React, { createContext, useState } from 'react'


const SideBarContext = createContext({leftSideBarIsActive:false , activeLeftSideBar: () => {}, desactiveLeftSideBar:  ()=>{}, rightSideBarIsActive:false , activeRightSideBar: () => {}, desactiveRightSideBar:  ()=>{}})


export const SideBarProvider: React.FC = ({children}) => {

    const [leftSideBarIsActive, setLeftSideBarIsActive] = useState(false)
    const [rightSideBarIsActive, setRightSideBarIsActive] = useState(false)


    const activeLeftSideBar = () => {
        setLeftSideBarIsActive(true)
    }

    const desactiveLeftSideBar = () => {
        setLeftSideBarIsActive(false)
    }

    const activeRightSideBar = () => {
        setRightSideBarIsActive(true)
    }

    const desactiveRightSideBar = () => {
        setRightSideBarIsActive(false)
    }

    return (
        <SideBarContext.Provider value={{leftSideBarIsActive, activeLeftSideBar, desactiveLeftSideBar, rightSideBarIsActive, activeRightSideBar, desactiveRightSideBar}}>
            {children}
        </SideBarContext.Provider>

    )
}

export default SideBarContext
