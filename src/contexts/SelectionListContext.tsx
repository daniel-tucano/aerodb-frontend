import React, { createContext, useState, useContext } from 'react'
import { projectAPI } from '../api/aerodbApi'
import authContext from './auth'

type SelectionListContextType = {
    selectionListData: SelectionAirfoilDataType[],
    runsData: SelectionRunDataType[],
    projectName: string,
    setProjectName: React.Dispatch<React.SetStateAction<string>>,
    saveCurrentProject: (projectNameToSave: string) => void,
    updateSavedProject: () => void,
    selectSavedProject: (projectNameToSelect: string) => void,
    closeCurrentProject: () => void,
    isSaved: boolean,
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>,
    addAirfoilData: (airfoilData: SelectionAirfoilDataType) => void,
    removeAirfoilData: (airfoilID: number | string) => void,
    addRunData: (runData: SelectionRunDataType, airfoilID: number | string) => void,
    removeRunData: (runId: number | string, airfoilID: number | string) => void,
    includesRun: (runId: number, airfoilID: number) => boolean,
    includesAirfoil: (airfoilID: number) => boolean
    removeAllData: () => void,
}

export type SelectionAirfoilDataType = {
    airfoilID: number,
    name: string,
    geometrie: { x: number[], y: number[], side: string[] },
    runsData: SelectionRunDataType[],
}

export type SelectionRunDataType = {
    runID: number,
    mach: number,
    reynolds: number,
}

const SelectionListContext = createContext<SelectionListContextType>({} as SelectionListContextType)

export const SelectionListProvider: React.FC = ({ children }) => {

    const [selectionListData, setSelectionListData] = useState<SelectionAirfoilDataType[]>(JSON.parse(localStorage.getItem('currentSelectionListData') || '[]'))
    const [runsData, setRunsData] = useState<SelectionRunDataType[]>(JSON.parse(localStorage.getItem('currentSelectionListData') || '[]').map((airfoilData: SelectionAirfoilDataType) => airfoilData.runsData).flat())
    const [projectName, setProjectName] = useState(localStorage.getItem('currentProjectName') || 'Untitled Project')
    const [projectID, setProjectID] = useState<undefined | string>(undefined)    
    const [isSaved, setIsSaved] = useState(false)
    const { userData, updateUserData } = useContext(authContext)


    const saveCurrentProject = (projectNameToSave: string) => {

        if (!userData) return

        if (userData.projects.find( project => { return project.name === projectNameToSave})) {
            window.alert('project name already exist')
        } else {
            projectAPI.createProject({
                creator: userData._id,
                name: projectNameToSave,
                airfoils: selectionListData,
            }).then( (project) => {
                console.log('project ' + project.data.name + ' saved')
                localStorage.setItem('currentProjectName', projectNameToSave)
                setProjectName(projectNameToSave)
                setProjectID(project.data._id)
                setIsSaved(true)
            }).catch( () => {
                window.alert(`project could not be saved`)
            })

        }
    }

    const updateSavedProject = async () => {
        if (!userData || !projectID) return

        await projectAPI.updateProject(projectID, selectionListData).then((project) => {
            console.log('project ' + project.data.name + ' updated')
        })
    }

    // Atualmente Concertando, portanto esta quebrado. Preciso de fazer um metodo no auth context para atualizar os
    // dados do usuario atual, assim sempre vamos ter os dados mais atuais quando consultarmos os projetos de um usuario
    const selectSavedProject = async (projectNameToSelect: string) => {
        // Para realizar esta operacao e preciso estar logado
        if (!userData) return
        await updateUserData()
        const projectID = userData.projects.find( project => project.name === projectNameToSelect)?.projectID
        // Retorna caso nao ache o projeto com o nome descrito
        if (!projectID) return console.log('project not found')
        await projectAPI.getOneProject( projectID ).then( project => {
            localStorage.setItem('currentProjectName', project.data.name)
            setProjectName(project.data.name)
            setIsSaved(true)
            setSelectionListData(project.data.airfoils)
        })
    }

    const closeCurrentProject = () => {
        localStorage.setItem('currentProjectName', 'Untitled Project')
        setProjectName('Untitled Project')
        setIsSaved(false)
        setSelectionListData([])
    }

    const addAirfoilData = (newAirfoilData: SelectionAirfoilDataType) => {
        const airfoilExists = selectionListData.some(airfoilData => airfoilData.airfoilID === newAirfoilData.airfoilID)
        if (!airfoilExists) {
            setSelectionListData(currentData => { currentData.push(newAirfoilData); return currentData })
            localStorage.setItem('currentSelectionListData', JSON.stringify(selectionListData))
        } else {
            return
        }
    }

    const removeAirfoilData = (airfoilID: number | string) => {
        setSelectionListData(currentData => currentData.filter((airfoilData) => airfoilData.airfoilID !== airfoilID))
        setRunsData(currentData => {
            return currentData.filter( runsData => {
                return !selectionListData.find( airfoilData => airfoilData.airfoilID === airfoilID)?.runsData.some( selectionListRunData => selectionListRunData.runID === runsData.runID)
            })
        })
        localStorage.setItem('currentSelectionListData', JSON.stringify(selectionListData.filter((airfoilData) => airfoilData.airfoilID !== airfoilID)))
    }

    const addRunData = (newRunData: SelectionRunDataType, airfoilID: number | string) => {
        const airfoilIntended = selectionListData.find(airfoilData => airfoilData.airfoilID === airfoilID)
        if (airfoilIntended) {
            const airfoilIndex = selectionListData.findIndex( airfoilData => airfoilData.airfoilID === airfoilID)
            const runExists = airfoilIntended.runsData.some(runData => runData.runID === newRunData.runID)
            if (!runExists) {
                const newSelectionListData = [...selectionListData]
                newSelectionListData[airfoilIndex].runsData.push(newRunData)

                setSelectionListData(newSelectionListData)
                setRunsData(currentData => [...currentData, newRunData])
                localStorage.setItem('currentSelectionListData', JSON.stringify(selectionListData))
            } else {
                return
            }
        } else {
            return
        }
    }

    const removeRunData = (runId: number | string, airfoilID: number | string) => {
        setSelectionListData(currentData => {
            const airfoilIndex = currentData.findIndex((airfoilData) => airfoilData.airfoilID === airfoilID)
            const newAirfoilRunsData = currentData[airfoilIndex].runsData.filter((runData) => runData.runID !== runId)
            if (newAirfoilRunsData) {
                currentData[airfoilIndex].runsData = newAirfoilRunsData
            }
            localStorage.setItem('currentSelectionListData', JSON.stringify(currentData))
            return currentData
        })
        setRunsData(currentData => currentData.filter(runData => runData.runID !== runId))
    }

    const includesAirfoil = (airfoilID: number) => {
        return selectionListData.some(airfoilData => airfoilData.airfoilID === airfoilID)
    }

    const includesRun = (runId: number, airfoilID: number) => {
        return selectionListData.find(airfoilData => airfoilData.airfoilID === airfoilID)?.runsData.some(runData => runData.runID === runId)
    }

    const removeAllData = () => {
        setSelectionListData([])
        setRunsData([])
        localStorage.removeItem('currentSelectionListData')
    }

    return (
        <SelectionListContext.Provider value={{ projectName, setProjectName, saveCurrentProject, updateSavedProject, selectSavedProject, closeCurrentProject, isSaved, setIsSaved, selectionListData, runsData, addAirfoilData, removeAirfoilData, addRunData, includesRun, includesAirfoil, removeRunData, removeAllData } as SelectionListContextType}>
            {children}
        </SelectionListContext.Provider>
    )
}

export default SelectionListContext