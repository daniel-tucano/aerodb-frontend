import React from 'react'
import plotAirfoilData from '../../functions/plotAirfoilData'

import List from '../List'

import './SearchResultList.css'
import { useHistory } from 'react-router-dom'

type SearchResultProps = {
    itensName: string[],
    itensImageGeometrie: {x: [], y:[]},
    pathToPush: string[],
} & typeof defaultSearchResultProps 

const defaultSearchResultProps = {
    itensName: [''],
    itensImageGeometrie: {x: [], y: []},
    pathToPush: [''],
}

const SearchResultList: React.FC<SearchResultProps> = (props: SearchResultProps) => {

    let history = useHistory()

    return (
        <>
            <List>
                {Array.isArray(props.itensName) && props.itensName.map( (itensName, index) => {
                    return(
                        <li key={index} onClick={() => history.push(props.pathToPush[index])}>
                            {Array.isArray(props.itensImageGeometrie) && 
                                <div className='search-result-list-image'>
                                    {plotAirfoilData(props.itensImageGeometrie[index],{scale:100, strokeWidth:2})}
                                </div>
                            }
                            <div className="search-result-list-text">
                                {itensName}
                            </div>
                        </li>
                    )
                })}
            </List>
        </>
    )
}

export default SearchResultList
