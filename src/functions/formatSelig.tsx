
const formatSelig = (geometrie: {x: number[], y: number[]}, name: string) => {

    let formattedData = ''


    geometrie.x.map( (x, index) => {
        if(index === 0) {
            formattedData += name + '\n'
        } else {
            formattedData += `  ${x.toFixed(6)} ${(geometrie.y[index] < 0 )? geometrie.y[index].toFixed(6): ' ' + geometrie.y[index].toFixed(6)}\n`
        }
        return null
    })

    return formattedData
}

export default formatSelig
