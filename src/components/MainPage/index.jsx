import React, { useContext, useState, useRef } from 'react'
import AuthContext from '../../contexts/auth'
import SideBarContext from '../../contexts/SideBarContext'
import SelectionListContext from '../../contexts/SelectionListContext'

import Header from '../../components/Header'
import LeftSideBar from '../../components/LeftSideBar'
import RightSideBar from '../../components/RightSideBar'

import './MainPage.css'

const MainPage = ({ children }) => {

    const { leftSideBarIsActive, desactiveLeftSideBar, rightSideBarIsActive, desactiveRightSideBar } = useContext(SideBarContext)

    return (
        <div className="main-page-wrapper">
            <Header />
            <LeftSideBar />
            <RightSideBar />
            <div className="scrollable-area" style={leftSideBarIsActive || rightSideBarIsActive ? { overflowY: 'hidden' } : {}} onClick={leftSideBarIsActive ? desactiveLeftSideBar : (rightSideBarIsActive ? desactiveRightSideBar : null)} >
                <div className="scrollable-area-content container">
                    {children}
                </div>
            </div>
            
            <RemoveAllDataConfirmModal />
            <SaveProjectModal />
            <SelectProjectModal />
        </div>
    )
}


const RemoveAllDataConfirmModal = () => {

    const { removeAllData } = useContext(SelectionListContext)

    return (
        <div className="modal fade" id="removeAllDataConfirmModal" tabIndex="-1" aria-labelledby="removeAllDataConfirmModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Confirm Action</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        Are you sure you wanna delete all selected airfoils?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary modal-btn" id='modal-bottom-close-btn' data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary modal-btn" id='delete-all-selection-data-modal-btn' data-dismiss="modal" onClick={removeAllData}>Delete All Selection Data</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SaveProjectModal = () => {

    const closeBtnRef = useRef()

    const { saveCurrentProject } = useContext(SelectionListContext)

    const [projectName, setProjectName] = useState('')


    const handleProjectNameChange = ({ target }) => {
        setProjectName(target.value)
    }

    const handleProjectSave = () => {
        saveCurrentProject(projectName)
        closeBtnRef.current.click()
    }

    return (
        <div className="modal fade" id="save-project-dialog-modal" tabIndex="-1" aria-labelledby="Save Project Dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Save Project</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="project-name" className="col-form-label">Project Name</label>
                                <input type="text" className="form-control" id="project-name" onChange={handleProjectNameChange} placeholder='Untitled Project'></input>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary modal-btn" id='modal-bottom-close-btn' data-dismiss="modal" ref={closeBtnRef}>Close</button>
                        <button type="button" className="btn btn-primary modal-btn" id='save-project-modal-btn' onClick={handleProjectSave}>Save Project</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

const SelectProjectModal = () => {

    const closeBtnRef = useRef()

    const [selectedOption, setSelectedOption] = useState('')

    const {userData} = useContext(AuthContext)
    const { selectSavedProject } = useContext(SelectionListContext)

    return (
        <div className="modal fade" id="select-existing-project-dialog-modal" tabIndex="-1" aria-labelledby="Select Project Dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Select Project</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="project-name" className="col-form-label">Project Name</label>
                                <select className="form-control" id="saved-projects-names" onChange={({target}) => setSelectedOption(target.value)}>
                                    {userData?.projects.map( (project, index) => <option value={project.name} key={index}>{project.name}</option>)}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary modal-btn" id='modal-bottom-close-btn' data-dismiss="modal" ref={closeBtnRef} >Close</button>
                        <button type="button" className="btn btn-primary modal-btn" id='save-project-modal-btn' onClick={() => {selectSavedProject(selectedOption); closeBtnRef.current.click()}}>Select Project</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MainPage
