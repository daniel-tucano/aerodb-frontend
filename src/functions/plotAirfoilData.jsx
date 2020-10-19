import React from 'react'


const plotAirfoilData = (geometrie, options = {scale:90 , strokeWidth:0.5}) => {
    const dataToPlot = []

    geometrie.x.map((xValue) => (
        dataToPlot.push([xValue * options.scale + 3])
    ))
    geometrie.y.map((yValue, index) => (
        dataToPlot[index].push(-yValue * options.scale + 50)
    ))


    return (
        <svg version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100" style={{ height: '100%', width: '100%' }}>
            <polygon points={dataToPlot.flat().toString()} fill="none" stroke="black" strokeWidth={String(options.strokeWidth)} preserveAspectRatio="xMidYMid meet" />
        </svg>
    )
}

export default plotAirfoilData