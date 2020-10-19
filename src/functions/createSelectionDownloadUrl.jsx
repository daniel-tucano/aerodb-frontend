const createSelectionDownloadUrl = (selectionListData, projectName) => {

    const baseUrl = `https://us-central1-aero-no-sql-dev.cloudfunctions.net/downloadSelectedData?projectName=${projectName}&airfoil=`

    let queryString = ''
    
    selectionListData.map( (airfoilData, index) => {

        queryString += `id=${airfoilData.id}@runs=`
        
        airfoilData.runsData.map( (runData, index) => {
            if (index === (airfoilData.runsData.length - 1)) {
                queryString += `${runData.id}`
            } else {
                queryString += `${runData.id};`
            }
            return undefined
        })

        
        if (index !== (selectionListData.length - 1)) {
            queryString += '+'
        }

        return null
    })

    return baseUrl + queryString

}

export default createSelectionDownloadUrl