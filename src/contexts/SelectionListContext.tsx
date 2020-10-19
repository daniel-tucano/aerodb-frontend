import React, { createContext, useState, useContext } from 'react'
import authContext from './auth'

type SelectionListContextType = {
    selectionListData: AirfoilDataType[],
    runsData: RunDataType[],
    projectName: string,
    setProjectName: React.Dispatch<React.SetStateAction<string>>,
    saveCurrentProject: (projectNameToSave: string) => void,
    updateSavedProject: () => void,
    selectSavedProject: (projectNameToSelect: string) => void,
    closeCurrentProject: () => void,
    isSaved: boolean,
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>,
    addAirfoilData: (airfoilData: AirfoilDataType) => void,
    removeAirfoilData: (airfoilId: number | string) => void,
    addRunData: (runData: RunDataType, airfoilId: number | string) => void,
    removeRunData: (runId: number | string, airfoilId: number | string) => void,
    includesRun: (runId: number, airfoilId: number) => boolean,
    includesAirfoil: (airfoilId: number) => boolean
    removeAllData: () => void,
}

type AirfoilDataType = {
    id: number | string,
    name: string,
    geometrie: { x: number[], y: number[], side: string[] },
    runsData: RunDataType[],
}

type RunDataType = {
    id: number | string,
    name: string,
    mach: number,
    reynolds: number,
}

const SelectionListContext = createContext<SelectionListContextType>({} as SelectionListContextType)

export const SelectionListProvider: React.FC = ({ children }) => {

    const [selectionListData, setSelectionListData] = useState<AirfoilDataType[]>(JSON.parse(localStorage.getItem('currentSelectionListData') || '[]'))
    const [runsData, setRunsData] = useState<RunDataType[]>(JSON.parse(localStorage.getItem('currentSelectionListData') || '[]').map((airfoilData: AirfoilDataType) => airfoilData.runsData).flat())
    const [projectName, setProjectName] = useState(localStorage.getItem('currentProjectName') || 'Untitled Project')
    const [isSaved, setIsSaved] = useState(false)
    const { userData, userRef } = useContext(authContext)


    const saveCurrentProject = (projectNameToSave: string) => {

        if (!userData || !userRef) return

        if (userData.projectsName.includes(projectNameToSave)) {
            window.alert('project name already exist')
        } else {
            userRef.collection('projects').add({
                projectName: projectNameToSave,
                projectData: selectionListData,
            }).then(() => {
                console.log('project ' + projectNameToSave + ' saved')
            })

            localStorage.setItem('currentProjectName', projectNameToSave)
            setProjectName(projectNameToSave)
            setIsSaved(true)
        }
    }

    const updateSavedProject = async () => {
        if (!userRef) return

        const currentProjectQuery = await userRef.collection('projects').where('projectName', '==', projectName).get()
        currentProjectQuery.docs[0].ref.update({
            projectData: selectionListData,
        }).then(() => {
            console.log('project ' + projectName + ' updated')
        })
    }

    const selectSavedProject = (projectNameToSelect: string) => {
        userRef?.collection('projects').where('projectName', '==', projectNameToSelect).get().then((projectQuery) => {
            const projectData = projectQuery.docs[0].data()

            localStorage.setItem('currentProjectName', projectData.projectName)
            setProjectName(projectData.projectName)
            setIsSaved(true)
            setSelectionListData(projectData.projectData)
        })
    }

    const closeCurrentProject = () => {
        userRef?.update({
            activeProject: '',
        })

        localStorage.setItem('currentProjectName', 'Untitled Project')
        setProjectName('Untitled Project')
        setIsSaved(false)
        setSelectionListData([])
    }

    const addAirfoilData = (newAirfoilData: AirfoilDataType) => {
        const airfoilExists = selectionListData.some(airfoilData => airfoilData.id === newAirfoilData.id)
        if (!airfoilExists) {
            setSelectionListData(currentData => { currentData.push(newAirfoilData); return currentData })
            localStorage.setItem('currentSelectionListData', JSON.stringify(selectionListData))
        } else {
            return
        }
    }

    const removeAirfoilData = (airfoilId: number | string) => {
        setSelectionListData(currentData => currentData.filter((airfoilData) => airfoilData.id !== airfoilId))
        setRunsData(currentData => {
            return currentData.filter( runsData => {
                return !selectionListData.find( airfoilData => airfoilData.id === airfoilId)?.runsData.some( selectionListRunData => selectionListRunData.id === runsData.id)
            })
        })
        localStorage.setItem('currentSelectionListData', JSON.stringify(selectionListData.filter((airfoilData) => airfoilData.id !== airfoilId)))
    }

    const addRunData = (newRunData: RunDataType, airfoilId: number | string) => {
        const airfoilIntended = selectionListData.find(airfoilData => airfoilData.id === airfoilId)
        if (airfoilIntended) {
            const airfoilIndex = selectionListData.findIndex( airofoilData => airofoilData.id === airfoilId)
            const runExists = airfoilIntended.runsData.some(runData => runData.id === newRunData.id)
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

    const removeRunData = (runId: number | string, airfoilId: number | string) => {
        setSelectionListData(currentData => {
            const airfoilIndex = currentData.findIndex((airfoilData) => airfoilData.id === airfoilId)
            const newAirfoilRunsData = currentData[airfoilIndex].runsData.filter((runData) => runData.id !== runId)
            if (newAirfoilRunsData) {
                currentData[airfoilIndex].runsData = newAirfoilRunsData
            }
            localStorage.setItem('currentSelectionListData', JSON.stringify(currentData))
            return currentData
        })
        setRunsData(currentData => currentData.filter(runData => runData.id !== runId))
    }

    const includesAirfoil = (airfoilId: number) => {
        return selectionListData.some(airfoilData => airfoilData.id === airfoilId)
    }

    const includesRun = (runId: number, airfoilId: number) => {
        return selectionListData.find(airfoilData => airfoilData.id === airfoilId)?.runsData.some(runData => runData.id === runId)
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
