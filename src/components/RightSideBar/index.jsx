import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SideBarContext from '../../contexts/SideBarContext'
import AuthContext from '../../contexts/auth'
import SelectionListContext from '../../contexts/SelectionListContext'

import plotAirfoilData from '../../functions/plotAirfoilData'
import createSelectionDownloadUrl from '../../functions/createSelectionDownloadUrl'

import './RIghtSideBar.css'

const RightSideBar = () => {

    const { rightSideBarIsActive, desactiveRightSideBar } = useContext(SideBarContext)
    const { isLogged } = useContext(AuthContext)
    const { selectionListData, projectName, isSaved, closeCurrentProject, updateSavedProject } = useContext(SelectionListContext)

    const history = useHistory()


    const renderSaveButton = () => {

        if (isLogged) {
            if (isSaved) {
                return (
                    <>
                        <i className="material-icons project-row-icon" onClick={updateSavedProject} >save</i>
                        <i className="material-icons project-row-icon" onClick={closeCurrentProject} >clear</i>
                    </>
                )
            } else {
                return (
                    <>
                        <i className="material-icons project-row-icon" data-toggle="modal" data-target="#save-project-dialog-modal" >save</i>
                        <i className="material-icons project-row-icon" data-toggle="modal" data-target="#select-existing-project-dialog-modal" >folder</i>
                    </>
                )
            }
        } else {
            return (
                <i className="material-icons project-row-icon" data-toggle="modal" onClick={() => history.push('/login')} >save</i>
            )
        }
    }

    const handleDownload = async () => {
        window.location.href = createSelectionDownloadUrl(selectionListData, projectName)
    }

    return (
        <div className={`right-side-bar-wrapper ${rightSideBarIsActive ? 'open' : ''}`}>
            <div className="right-side-bar-header">
                <div className="side-bar-title-row">
                    <span className="side-bar-title-text">Selected Data</span>
                    <i className="material-icons right-side-bar-close-icon" onClick={desactiveRightSideBar}>clear</i>
                </div>

                <div className="current-project-row">
                    <span className="current-project-name">{projectName}</span>
                    {renderSaveButton()}
                </div>
            </div>

            <div className="right-side-bar-main">
                <SelectionList selectionListData={selectionListData} />
            </div>

            <div className="right-side-bar-footer">
                <div className="delete-all-selection-btn" data-toggle="modal" data-target="#removeAllDataConfirmModal">
                    <i className="material-icons delete-all-selection-icon">clear</i>
                    <span>Delete All Selection</span>
                </div>
                <div className="right-side-bar-footer-content">
                    <div className="download-selected-data-btn" onClick={handleDownload}>
                        <span>
                            Download
                            <i className="material-icons download-selected-data-icon">get_app</i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

}

const SelectionList = ({ selectionListData }) => {

    const { removeAirfoilData, removeRunData } = useContext(SelectionListContext)

    const AirfoilListItem = ({ airfoilData }) => {
        const [collapseIsOpen, setCollapseIsOpen] = useState(true)
        const [optionsIsOpen, setOptionsIsOpen] = useState(false)
        const history = useHistory()

        const renderAirfoilOptions = (airfoilId) => {
            if (optionsIsOpen) {
                return (
                    <ul className="airfoil-options">
                        <li className="visit-airfoil airfoil-option" key='visit-airfoil' onClick={() => history.push(`/airfoils/${airfoilId}`)}>
                            <i className="material-icons airfoil-options-icon">description</i>
                            <span>more</span>
                        </li>
                        <li className="remove-airfoil airfoil-option" key='remove-airfoil' onClick={() => removeAirfoilData(airfoilId)}>
                            <i className="material-icons airfoil-options-icon">clear</i>
                            <span>remove</span>
                        </li>
                    </ul>
                )
            }
        }

        return (
            <div className={`airfoil-list-item`}>
                <div className="airfoil-list-item-header">
                    <div className="airfoil-geometrie">
                        {plotAirfoilData(airfoilData.geometrie, {scale: 110, strokeWidth: 1.5})}
                    </div>

                    <span className="header-title">
                        {airfoilData.name}
                    </span>

                    <div className="airfoil-list-item-options" onClick={() => setOptionsIsOpen(currentValue => !currentValue)}>
                        <i className="material-icons item-options-icon">more_horiz</i>
                        {renderAirfoilOptions(airfoilData.id)}
                    </div>

                    <div className="open-close-collapse" onClick={() => setCollapseIsOpen((currentValue) => (!currentValue))}>
                        <i className='material-icons open-close-collapse-icon'>{collapseIsOpen ? "expand_less" : "expand_more"}</i>
                    </div>
                </div>

                <div className="airfoil-list-item-content">
                    <div className="run-list">
                        <div className={`collapse ${collapseIsOpen ? 'show' : ''}`}>
                            {airfoilData.runsData.map((run, index) => {
                                return (
                                    <div className="run-list-item" key={index}>
                                        <div className="remove-selected-run-btn" onClick={() => removeRunData(run.id, airfoilData.id)}>
                                            <i className="material-icons remove-selected-run-icon">remove</i>
                                        </div>

                                        <span className="run-name">{run.name}</span>

                                        <div className="run-info">
                                            <div className="mach-info">
                                                <span className="info-title">Mach</span>
                                                <span className="info">{run.mach}</span>
                                            </div>

                                            <div className="reynolds-info">
                                                <span className="info-title">Reynolds</span>
                                                <span className="info">{run.reynolds}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="airfoil-list">
            {selectionListData.map((airfoilData) => {
                return <AirfoilListItem airfoilData={airfoilData} key={airfoilData.id} />
            })}
        </div>
    )
}

export default RightSideBar