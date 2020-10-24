import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../../contexts/auth'
import { useHistory } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { saveAs } from 'file-saver'
import { airfoilAPI, runAPI, userAPI } from '../../api/aerodbApi'
import { QueryBuilder } from 'odata-query-builder'

import Card from '../../components/Card'
import CardSection from '../../components/Card/CardSection'
import CopyPanel from '../../components/CopyPanel'
import DownloadButton from '../../components/DownloadButton'
import FilterDropdown from '../../components/FilterDropdown'

import toCamelCase from '../../functions/toCamelCase'
import formatSelig from '../../functions/formatSelig'

import './Airfoil.css'
import SelectionListContext from '../../contexts/SelectionListContext'

const AirfoilPage = (props) => {

    return (
        <div className='airfoil-page-wrapper'>

            <AirfoilCard airfoilId={props.match.params.id} />

            <RunsCard airfoilId={props.match.params.id} />

        </div>
    )
}

const AirfoilCard = ({ airfoilId }) => {

    const { isLogged, userData, userRef } = useContext(AuthContext)

    const [currentAirfoil, setCurrentAirfoil] = useState({})
    const [isFavorite, setIsFavorite] = useState(userData ? (userData.favoriteAirfoils ? userData.favoriteAirfoils.includes(airfoilId) : false) : false)
    const [isAirfoilFetched, setIsAirfoilFetched] = useState(false)

    const history = useHistory()

    useEffect(() => {
        airfoilAPI.getOneAirfoil(airfoilId).then((airfoilResponse) => {
            airfoilResponse.data.postedDate = new Date(airfoilResponse.data.postedDate)
            setCurrentAirfoil(airfoilResponse.data)
            setIsAirfoilFetched(true)
        })
    }, [airfoilId])

    useEffect(() => {
        if (userData) {
            if (userData.favoriteAirfoils) {
                setIsFavorite(userData.favoriteAirfoils.includes(airfoilId))
            }
        }
    }, [userData, airfoilId])

    if (isAirfoilFetched) {

        const plotAirfoilData = () => {

            const AirfoilGeometrieFormatedData = currentAirfoil.geometrie.x.map((x, index) => {
                return { x, y: currentAirfoil.geometrie.y[index] }
            })

            return (<Line
                data={{
                    datasets: [
                        {
                            label: '',
                            data: AirfoilGeometrieFormatedData,
                            radius: 0,
                            borderColor: 'rgba(36, 34, 34,0.5)',
                            borderWidth: 1.6,
                            fill: 'none'
                        }
                    ]
                }}
                options={{
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            type: 'linear',
                            gridLines: {
                                // drawOnChartArea: false,
                            },
                            ticks: {
                                min: -0.5,
                                max: 0.5,
                                fontColor: 'rgba(36, 34, 34,0.5)',
                                fontSize: 10,
                            }
                        }],
                        xAxes: [{
                            type: 'linear',
                            gridLines: {
                                // drawOnChartArea: false,
                            },
                            ticks: {
                                min: 0,
                                max: 1,
                                fontColor: 'rgba(36, 34, 34,0.5)',
                                fontSize: 10,
                            }
                        }]
                    }
                }}
            />)
        }

        const handleFavorite = () => {

            if (isLogged) {
                setIsFavorite(currentValue => {
                    userAPI.updateUser(userRef)
                    return !currentValue
                })
            } else {
                history.push('/login')
            }
        }



        return (
            <div className="airfoil-card-wrapper">
                <div className="posted-by-row">
                    <span>
                        Posted by <span className="posted-by-link" onClick={() => history.push(`/user/${currentAirfoil.creator}`)}>{currentAirfoil.creator.userName}</span> on <span className="posted-date">{currentAirfoil.postedDate.toDateString()}</span>
                    </span>
                </div>
                <Card
                    headerText={
                        <div className='airfoil-card-header'>
                            <div className="favorite-btn-wrapper">
                                <button className="favorite-btn" onClick={handleFavorite} >
                                    <i className="material-icons favorite-icon">{isFavorite ? "favorite" : "favorite_border"}</i>
                                </button>
                            </div>
                            <span>{currentAirfoil.name}</span>
                        </div>
                    }
                >

                    <CardSection headerText="Geometrie" className='airfoil-plot' >
                        {plotAirfoilData()}
                    </CardSection>

                    <CardSection headerText="Characteristics" className='airfoil-characteristics'>
                        <div className="characteristic">
                            <div className="characteristic-header">
                                Thickness
                            </div>
                            <div className="characteristic-detail">
                                {currentAirfoil.thickness}
                            </div>
                        </div>
                        <div className="characteristic">
                            <div className="characteristic-header">
                                X Thickness
                            </div>
                            <div className="characteristic-detail">
                                {currentAirfoil.xThickness}
                            </div>
                        </div>
                        <div className="characteristic">
                            <div className="characteristic-header">
                                Camber
                            </div>
                            <div className="characteristic-detail">
                                {currentAirfoil.camber}
                            </div>
                        </div>
                        <div className="characteristic">
                            <div className="characteristic-header">
                                X Camber
                            </div>
                            <div className="characteristic-detail">
                                {currentAirfoil.xCamber}
                            </div>
                        </div>
                    </CardSection>

                    <CardSection className='get-geometrie' headerText="Get Geometrie">
                        <CopyPanel
                            title={'REST API URL'}
                            copyText={`https://firestore.googleapis.com/v1/projects/aero-no-sql-dev/databases/(default)/documents/airfoils/${airfoilId}`}
                        />
                        <DownloadButton
                            itens={['JSON', 'DAT', 'MAT']}
                            onDownload={(currentExtention) => {
                                if (currentExtention === 'JSON') {
                                    const airfoilBlob = new Blob([JSON.stringify({ name: currentAirfoil.name, thickness: currentAirfoil.thickness, xThickness: currentAirfoil.xThickness, camber: currentAirfoil.camber, xCamber: currentAirfoil.xCamber, geometrie: currentAirfoil.geometrie }, null, '\t')], { type: "application/json" })
                                    saveAs(airfoilBlob, `${toCamelCase(currentAirfoil.nameLowerCase)}.json`)
                                } else if (currentExtention === 'DAT') {
                                    const airfoilBlob = new Blob([formatSelig(currentAirfoil.geometrie, currentAirfoil.name)], { type: 'text/plain;charset=utf-8' })
                                    saveAs(airfoilBlob, `${toCamelCase(currentAirfoil.nameLowerCase)}.dat`)
                                } else if (currentExtention === 'MAT') {
                                    window.location.href = `https://us-central1-aero-no-sql-dev.cloudfunctions.net/airfoilMatFileDownload?airfoilId=${airfoilId}`
                                }
                            }}
                        />
                    </CardSection>
                </Card>
            </div>
        )
    } else {
        return (
            <>
            </>
        )
    }
}

const RunsCard = ({ airfoilId }) => {

    const { runsData, addRunData, removeRunData, addAirfoilData, includesRun, includesAirfoil } = useContext(SelectionListContext)

    const [plotedRuns, setPlotedRuns] = useState([])
    const [plotType, setPlotType] = useState('cl')
    const [currentResultRuns, setcurrentResultRuns] = useState([])

    const [openedCollapseIndex, setOpenedCollapseIndex] = useState(-1)
    const [hoveredPlotedRunIndex, setHoveredPlotedRunIndex] = useState(-1)

    const [filtersList, setFiltersList] = useState([])
    const [currentFilterValues, setCurrentFilterValues] = useState({ field: { key: 'field', value: '' }, type: { key: 'type', value: '' }, value: '' })

    const [paginationVariables, setPaginationVariables] = useState({ nPages: 1, itensPerPage: 5, totalPages: undefined, page: 1, nextPage: 2, prevPage: null, hasNextPage: true, hasPrevPage: false, totalDocs: undefined, query: {} })

    const colorOrder = [[0, 0.447, 0.7410], [0, 0.85, 0.325, 0.0980], [0.929, 0.6940, 0.125], [0.4940, 0.1840, 0.5560], [0.4660, 0.6740, 0.1880], [0.3010, 0.7450, 0.9330], [0.6350, 0.0780, 0.1840]]

    const allFields = [{ key: '<', value: 'lt' }, { key: '<=', value: 'le' }, { key: '==', value: 'eq' }, { key: '>=', value: 'ge' }, { key: '>', value: 'gt' }]

    useEffect(() => {

        const query = new QueryBuilder().filter( f => f.filterExpression('airfoilID','eq',airfoilId))

        runAPI.getRunsPage(query ,{page:1, limit: 5}).then( runsResponse =>  {
            const {limit, paginingCounter, docs, ...runsPaginationData} = runsResponse.data
            setPaginationVariables(currentValue => { return {...currentValue, query, ...runsPaginationData} })
            setcurrentResultRuns(docs)
        })

    }, [airfoilId])

    useEffect(() => {

        if (filtersList.length === 0) return

        const query = new QueryBuilder()
        
        query.filter(f => filtersList.reduce( (acu, filter) => acu.filterExpression(filter.field.value, filter.type.value, filter.value),f),'and')

        runAPI.getRunsPage(query, { limit: paginationVariables.itensPerPage }).then( runsResponse => {
            const {limit, paginingCounter, docs, ...runsPaginationData} = runsResponse.data
            setPaginationVariables(currentValue => { return {...currentValue, query, ...runsPaginationData} })
            setcurrentResultRuns(docs)
        })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [airfoilId, filtersList, paginationVariables.itensPerPage])

    const handleRunAddRemove = (run) => {
        if (includesRun(run.runID, airfoilId)) {
            // Remove
            removeRunData(run.runID, airfoilId)
        } else {
            // Add
            if (!includesAirfoil(airfoilId)) {
                airfoilAPI.getOneAirfoil(airfoilId).then( airfoilResponse => {
                    addAirfoilData({ airfoilID: airfoilId, name: airfoilResponse.data.name, geometrie: airfoilResponse.data.geometrie, runsData: [] })
                    addRunData({ runID: run.runID, name: `Run ${run.runID}`, mach: run.mach, reynolds: run.reynolds }, airfoilId)
                })
            } else {
                addRunData({ runID: run.runID, name: `Run ${run.runID}`, mach: run.mach, reynolds: run.reynolds }, airfoilId)
            }
        }
    }

    const handleSelectAllResults = () => {
        if (!includesAirfoil(airfoilId)) {
            airfoilAPI.getOneAirfoil(airfoilId).then(airfoil => {
                const airfoilData = airfoil.data
                addAirfoilData({ airfoilID: airfoilData.airfoilID, name: airfoilData.name, geometrie: airfoilData.geometrie, runsData: [] })
            })
        }

        currentResultRuns.map(run => addRunData({ runID: run.runID, name: `Run ${run.runID}`, mach: run.mach, reynolds: run.reynolds }, airfoilId))
    }

    const handleUnselectAllResults = () => {
        currentResultRuns.map(run => removeRunData(run.runID, airfoilId))
    }

    const handleAddFilter = () => {
        setFiltersList(currentValue => [...currentValue, currentFilterValues])
        setCurrentFilterValues({ field: { key: 'field', value: '' }, type: { key: 'type', value: '' }, value: '' })
    }

    const handleRemoveFilter = (index) => {
        setFiltersList(currentValue => currentValue.filter((value, indexInside) => indexInside !== index))
    }

    const plotRunsData = () => {

        let maxAlpha = 0
        let minAlpha = 0

        let maxPlotType = 0
        let minPlotType = 0

        const runsFormatedDataSets = plotedRuns.map((plotedRun, index) => {
            if (plotedRun.polar.alpha[0] < minAlpha) {
                minAlpha = plotedRun.polar.alpha[0]
            }

            if (plotedRun.polar.alpha[plotedRun.polar.alpha.length - 1] > maxAlpha) {
                maxAlpha = plotedRun.polar.alpha[plotedRun.polar.alpha.length - 1]
            }

            if (Math.max(...plotedRun.polar[plotType]) > maxPlotType) {
                maxPlotType = Math.max(...plotedRun.polar[plotType])
            }

            if (Math.min(...plotedRun.polar[plotType]) < minPlotType) {
                minPlotType = Math.min(...plotedRun.polar[plotType])
            }

            return {
                label: `Run ${plotedRun.id}`,
                data: plotedRun.polar.alpha.map((alpha, index) => {
                    return { x: alpha, y: plotedRun.polar[plotType][index] }
                }),
                radius: 0,
                borderColor: `rgb(${colorOrder[index][0] * 255},${colorOrder[index][1] * 255},${colorOrder[index][2] * 255})`,
                borderWidht: 1.6,
                fill: 'none',
            }
        })

        return (
            <>
                <Line
                    data={{
                        datasets: runsFormatedDataSets,
                    }}
                    options={{
                        scales: {
                            yAxes: [{
                                type: 'linear',
                                ticks: {
                                    min: minPlotType - 0.1,
                                    max: maxPlotType + 0.1,
                                }
                            }],
                            xAxes: [{
                                type: 'linear',
                                ticks: {
                                    min: minAlpha - 5,
                                    max: maxAlpha + 5,
                                }
                            }]
                        }
                    }}
                />
            </>
        )
    }

    const handlePageChange = (actionType) => {

        setOpenedCollapseIndex(-1)

        if (actionType === 'next') {
            if(!paginationVariables.hasNextPage) return

            runAPI.getRunsPage(paginationVariables.query, { page: paginationVariables.nextPage, limit: paginationVariables.itensPerPage}).then( runsResponse => {
                const {limit, paginingCounter, docs, ...runsPaginationData} = runsResponse.data
                setPaginationVariables(currentValue => {
                    runsPaginationData.query = currentValue.query
                    runsPaginationData.itensPerPage = currentValue.itensPerPage
                    return runsPaginationData
                })
                setcurrentResultRuns(docs)
            })

        } else if (actionType === 'previous') {
            if (!paginationVariables.hasPrevPage) return

            runAPI.getRunsPage(paginationVariables.query, { page: paginationVariables.prevPage, limit: paginationVariables.itensPerPage}).then( runsResponse => {
                const {limit, paginingCounter, docs, ...runsPaginationData} = runsResponse.data
                setPaginationVariables(currentValue => {
                    runsPaginationData.query = currentValue.query
                    runsPaginationData.itensPerPage = currentValue.itensPerPage
                    return runsPaginationData
                })
                setcurrentResultRuns(docs)
            })
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const PolarPropertieSection = ({ color, run, index }) => {

        const [isOpened, setIsOpened] = useState(true)

        const polarPropertiesKeyValue = [{ key: 'clMax', value: 'Cl<sub>&nbsp;max</sub>' }, { key: 'alphaStall', value: 'Alpha<sub>&nbsp;stall</sub>' }, { key: 'clAlpha', value: 'Cl<sub>&nbsp;&alpha;</sub>' }, { key: 'cl0', value: 'Cl<sub>&nbsp;0</sub>' }, { key: 'alpha0Cl', value: 'Alpha<sub>&nbsp;Cl=0</sub>' }, { key: 'cdMin', value: 'Cd<sub>&nbsp;min</sub>' }, { key: 'cdMax', value: 'Cd<sub>&nbsp;max</sub>' }, { key: 'cm0', value: 'Cm<sub>&nbsp;0</sub>' }, { key: 'clCdMax', value: 'Cl/Cd<sub>&nbsp;max</sub>' }, { key: 'alphaClCdMax', value: 'Alpha<sub>&nbsp;Cl/Cd=max</sub>' }]


        return (
            <div className="ploted-run-polar-properties" key={index}>
                <div className="ploted-run-polar-properties-header"
                    style={{ backgroundColor: `rgb(${color[0]*255},${color[1]*255},${color[2]*255})` }}
                    onClick={() => setIsOpened(currentValue => !currentValue)}
                >
                    {`Run ${run.runID}`}
                    <i className="material-icons collapse-icon">{isOpened ? "expand_less" : "expand_more"}</i>
                </div>
                <div className="ploted-run-polar-properties-details" >
                    <div className={`collapse ${isOpened ? 'show' : ''}`} style={{backgroundColor: `rgba(${color[0]*255},${color[1]*255},${color[2]*255},0.5)`}}>
                        {polarPropertiesKeyValue.map((KeyValue, index) => {
                            return (
                                <div className='propertie-wrapper' key={index}>
                                    <div className="propertie-header" dangerouslySetInnerHTML={{ __html: KeyValue.value }}></div>
                                    <div className="propertie-detail">{run.polarProperties[KeyValue.key]}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card headerText={'Runs'} className='runs-card'>
            <CardSection headerText="Plot" className='runs-card-plot'>
                <div className="active-plots-list">
                    <div className="active-plots-list-header">
                        <span id="active-plots-run-id">Run ID</span>
                        <span id="active-plots-reynolds">Reynolds</span>
                        <span id="active-plots-mach">Mach</span>
                    </div>
                    <div className="active-plots-list-details">
                        {plotedRuns.map((run, index) => {
                            return (
                                <div className="run-item" key={index} onMouseEnter={() => setHoveredPlotedRunIndex(index)} onMouseLeave={() => setHoveredPlotedRunIndex(-1)}>
                                    <div className="remove-run-item-btn">
                                        {hoveredPlotedRunIndex === index ? <i className="material-icons remove-ploted-run" onClick={() => setPlotedRuns(currentData => currentData.filter(runData => runData.id !== run.runID))}>clear</i> : undefined}
                                    </div>
                                    <div className="information-area">
                                        <span className="run-item-information" id="run-item-run-id">{run.runID}</span>
                                        <span className="run-item-information" id="run-item-reynolds">{run.reynolds}</span>
                                        <span className="run-item-information" id="run-item-mach">{run.mach}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="plot-type-control-row">
                    <div className={`plot-type-control-btn ${plotType === 'cl' ? 'selected' : ''}`} id='cl' onClick={() => setPlotType('cl')}>Cl</div>
                    <div className={`plot-type-control-btn ${plotType === 'cd' ? 'selected' : ''}`} id='cd' onClick={() => setPlotType('cd')}>Cd</div>
                    <div className={`plot-type-control-btn ${plotType === 'cm' ? 'selected' : ''}`} id='cm' onClick={() => setPlotType('cm')}>Cm</div>
                </div>

                <div className="runs-plot-area">
                    {plotRunsData()}
                </div>
            </CardSection>

            <CardSection headerText="Polar Properties" className='runs-polar-properties'>
                {plotedRuns.map((plotedRun, runIndex) => {
                    return (
                        <PolarPropertieSection
                            run={plotedRun}
                            color={colorOrder[runIndex]}
                            index={runIndex}
                        />
                    )
                })}
            </CardSection>

            <CardSection headerText="Filter" className='runs-card-filter'>
                <div className="add-filter-row">
                    <div className="add-filter-btn" onClick={handleAddFilter}>
                        <i className="material-icons add-filter-icon">add</i>
                        <span>Add filter</span>
                    </div>

                    <FilterDropdown
                        keyValueList={[{ key: 'creator', value: 'creator.name' }, { key: 'Reynolds', value: 'reynolds' }, { key: 'Mach', value: 'mach' }, { key: 'Cl Max', value: 'polarProperties.clMax' }, { key: 'alpha Stall', value: 'polarProperties.alphaStall' }, { key: 'Cl alpha', value: 'polarProperties.clAlpha' }, { key: 'Cl 0', value: 'polarProperties.cl0' }, { key: 'Cm 0', value: 'polarProperties.cm0' }, { key: 'alpha Cl=0', value: 'polarProperties.alpha0Cl' }, { key: 'Cl/Cd max', value: 'polarProperties.clCdMax' }, { key: 'Cd Min', value: 'polarProperties.cdMin' }]}
                        value={currentFilterValues.field.key}
                        onChange={(value) => setCurrentFilterValues(currentValue => { return { ...currentValue, field: value } })}
                    />

                    <FilterDropdown
                        keyValueList={filtersList.length > 0 ? [{ key: '==', value: '==' }] : allFields}
                        value={currentFilterValues.type.key}
                        onChange={(value) => setCurrentFilterValues(currentValue => { return { ...currentValue, type: value } })}
                    />

                    <div className="add-filter-input">
                        <input type='text' placeholder='value' className="add-filter-dropdown-value" value={currentFilterValues.value} onChange={({ target }) => setCurrentFilterValues(currentValue => { return { ...currentValue, value: target.value } })} onKeyPress={({ key }) => key === 'Enter' ? handleAddFilter() : null} />
                    </div>
                </div>

                <div className="active-filters">
                    {filtersList.map((filter, index) => {
                        return (
                            <div className="active-filter" key={index}>
                                <span className="active-filter-text active-filter-field">{filter?.field?.key}</span>
                                <span className="active-filter-text active-filter-type">{filter?.type?.key}</span>
                                <span className="active-filter-text ative-filter-value">{isNumeric(filter?.value) ? parseFloat(filter.value).toLocaleString() : filter.value}</span>
                                <i className="material-icons ative-filter-icon" onClick={() => handleRemoveFilter(index)}>clear</i>
                            </div>
                        )
                    })}
                </div>
            </CardSection>

            <CardSection headerText="Results" className='runs-card-results'>
                <div className="controls-row">
                    <div className="result-control-btn" id='select-all-results' onClick={handleSelectAllResults}>
                        <i className="material-icons result-control-btn-icon">library_add</i>
                        <span className='result-control-btn-text'>Select All Results</span>
                    </div>
                    <div className="result-control-btn" id='unselect-all-results' onClick={handleUnselectAllResults}>
                        <i className="material-icons result-control-btn-icon">clear</i>
                        <span className='result-control-btn-text'>Unselect All Results</span>
                    </div>
                </div>

                <div className="run-results-list">
                    {currentResultRuns?.map((run, index) => {
                        return (
                            <div className='run-result-item' key={run.runID}>
                                <div className={`run-result-item-header ${openedCollapseIndex === index ? 'opened' : 'closed'}`}>
                                    <i className="material-icons add-remove-run-result-icon" onClick={() => handleRunAddRemove(run)}>{`${runsData.some(({ id }) => id === run.runID) ? 'remove' : 'add'}`}</i>
                                    <div className="click-area" onClick={() => openedCollapseIndex === index ? setOpenedCollapseIndex(-1) : setOpenedCollapseIndex(index)}>
                                        <span className="run-name">{`Run ${run.runID}`}</span>
                                        <div className="column-information">
                                            <span className="column-information-header">Mach</span>
                                            <span className="column-information-detail">{run.mach}</span>
                                        </div>
                                        <div className="column-information">
                                            <span className="column-information-header">Reynolds</span>
                                            <span className="column-information-detail">{run.reynolds.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="run-result-item-options">
                                    <div className={`collapse ${openedCollapseIndex === index ? 'show' : ''}`}>
                                        <div className="run-result-item-option" id={plotedRuns.some(runData => runData.id === run.runID) ? 'remove-from-comparisson' : 'add-to-comparisson'}
                                            onClick={() => setPlotedRuns(
                                                (currentValue) => {
                                                    if (currentValue.some(runData => runData.id === run.runID)) {
                                                        return currentValue.filter(runData => runData.id !== run.runID)
                                                    } else {
                                                        return [...currentValue, run]
                                                    }
                                                }
                                            )}>
                                            <i className="material-icons option-icon">{plotedRuns.some(runData => runData.id === run.runID) ? 'clear' : 'compare_arrows'}</i>
                                            <span className="option-detail">{plotedRuns.some(runData => runData.id === run.runID) ? 'Remove From Comparisson' : 'Add To Comparisson'}</span>
                                        </div>
                                        <div className="run-result-item-option" id='view-details'>
                                            <i className="material-icons option-icon">description</i>
                                            <span className="option-detail">View Details</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="pagination-nav-row">
                    <div className="change-page-btn" onClick={() => handlePageChange('previous')}>Previous</div>
                    <div className="change-page-btn" onClick={() => handlePageChange('next')}>Next</div>
                </div>
            </CardSection>
        </Card>
    )
}

export default AirfoilPage
