import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import {db} from '../../firebase/fireApp'
import plotAirfoilData from '../../functions/plotAirfoilData'

import SearchPage from '../../components/SearchPage'
import SearchResultList from '../../components/SearchResultList'

const Search = () => {

    const history = useHistory()

    const [searchResultItens, setsearchResultItens] = useState({ name: [], geometrie: [], id: [] })


    // Trecho usado constantemente para extrair os dados da busca e setar os resultados
    const handleAirfoilDocs = (docs) => {
        const tempSearchResultItens = { name: [], geometrie: [], id: [] }

        docs.map((result) => {
            const { name, geometrie } = result.data()
            tempSearchResultItens.name.push(name)
            tempSearchResultItens.geometrie.push(geometrie)
            tempSearchResultItens.id.push(`airfoils/${result.id}`)
            return null
        })
        return tempSearchResultItens
    }

    const handleSearchResultItensChange = (searchResultItens) => {
        setsearchResultItens(searchResultItens)
    }


    return (
        <div className='search-page'>
            <SearchPage
                baseQuery={db.collection('airfoils')}
                pageName='search'
                searchCollection={'airfoils'}
                searchField={'nameLowerCase'}
                handleDocsFunction={handleAirfoilDocs}
                onSearchResultItensChange={handleSearchResultItensChange}
                itensPerPage={5}
                deconstructorFunction={({ name, fileName, geometrie, id }) => ({ name, fileName, geometrie, id })}
                renderSuggestionFunction={(suggestions) => (
                    <div className='suggestion-wrapper' onClick={() => history.push(`/airfoils/${suggestions.id}`)}>
                        <div className="airfoil-plot-placeholder" id={suggestions.fileName}>{plotAirfoilData(suggestions.geometrie, { strokeWidth: 2, scale: 120 })}</div>
                        <span className="suggestion-main-text">{suggestions.name}</span>
                    </div>
                )}
            >
                <SearchResultList
                    itensName={searchResultItens.name}
                    itensImageGeometrie={searchResultItens.geometrie}
                    pathToPush={searchResultItens.id}
                />
            </SearchPage>
        </div>
    )
}

export default Search
