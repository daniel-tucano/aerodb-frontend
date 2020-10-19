import React, { useState, ReactNode } from 'react'
import Autosuggest from 'react-autosuggest'
import InputBox from '../../components/InputBox'

import './SearchBar.css'

import searchIcon from '../../assets/icons/search-24px.svg'

type searchValuesType = '*input' & string 
type searchTypesType = 'prefix' | firebase.firestore.WhereFilterOp 

interface SearchBarProps {
    dbInstance: firebase.firestore.Firestore,
    collection: string,
    searchFields: (string | firebase.firestore.FieldPath)[],
    searchTypes: searchTypesType[],
    searchValues: searchValuesType[],
    renderSuggestion: (suggestions: any) => ReactNode | Element,
    deconstructorFunction?: (inputData: {[key:string]: string | object}) => (object | string),
    renderSuggestionsContainer?: any,
    limit?: number,
    onEnter?: (serachText: string) => any,
}


const defaultSearchBarProps = {
    renderSuggestionsContainer: undefined,
    limit: 5,
    onEnter: () => {},
}

interface inputValueType {
    value: string
}


const SearchBar:React.FC<SearchBarProps> = (props: SearchBarProps) => {


    
    const [searchText, setSearchText] = useState<string>('')
    const [searchResults, setSearchResults] = useState<object[]>([])


    const onSearchChange = ({ value }:inputValueType) => {
        getSearchPartialResults(value.trim().toLowerCase(), props, props.deconstructorFunction ?  props.deconstructorFunction : (inputData: {[key:string]: string | object}) => (inputData[props.searchFields[props.searchFields.length - 1] as string]) )
    }

    const getSearchPartialResults = (inputText: string, props: SearchBarProps, deconstructorFunction: any) => {
        
        if ( inputText === '') {
            return null
        }

        let collectionInstance: firebase.firestore.Query<firebase.firestore.DocumentData> | firebase.firestore.CollectionReference<firebase.firestore.DocumentData> = props.dbInstance.collection(props.collection)
        
        if (Array.isArray(props.searchFields)) {
            props.searchFields.map((currentField, index, array) => {
                if (props.searchValues[index] === '*input' ) {
                    collectionInstance = addWhereToQuery(collectionInstance, currentField, props.searchTypes[index], inputText)
                } else {
                    collectionInstance = addWhereToQuery(collectionInstance, currentField, props.searchTypes[index], props.searchValues[index])
                }
                return null
            })
        }
        
        collectionInstance.limit(props.limit as number).get().then((queryResult) => {
            const tempSearchResults: object[] = []
            // A partir do resultado da Query, percorremos os documentos encontrados
            queryResult.docs.map( (doc) => {
                // Obtemos de cada documento o valor do campo que estamos interessados
                const fieldsResults = deconstructorFunction(doc.data())
                // Adicionamos o valor dos campos ao tempSearchResults e o id do documento
                tempSearchResults.push({...fieldsResults, id: doc.id})
                // e então passamos para o próximo documento
                return null
            })
            setSearchResults(tempSearchResults)
        })
    }

    const addWhereToQuery = (collectionInstance:firebase.firestore.CollectionReference<firebase.firestore.DocumentData> | firebase.firestore.Query<firebase.firestore.DocumentData>, searchField: (string | firebase.firestore.FieldPath), searchType: searchTypesType, searchValue:string) => {

        if (searchType === 'prefix') {
            return collectionInstance.where(searchField, '>=' , searchValue).where(searchField, '<=', searchValue + '\uf8ff')
        } else {
            return collectionInstance.where(searchField, searchType as firebase.firestore.WhereFilterOp , searchValue)
        }
    }

    return (
        <div className='search-bar-wrapper'>
            <Autosuggest
                suggestions={searchResults}
                onSuggestionsFetchRequested={onSearchChange}
                onSuggestionsClearRequested={() => ( setSearchResults([]) )}
                getSuggestionValue={ (suggestion: any) => (suggestion.name)}
                renderSuggestion={ props.renderSuggestion }
                renderSuggestionsContainer={ props.renderSuggestionsContainer }
                renderInputComponent = {(inputProps) => (<InputBox Icon={searchIcon} PlaceHolder='Search' inputProps={inputProps} onEnter={() => (props.onEnter ? props.onEnter(searchText) : null)}/>)}
                inputProps={{
                    value: searchText,
                    onChange: (event, { newValue, method }) => {setSearchText(newValue)},
                }}
            />
        </div>
    )
}

SearchBar.defaultProps = defaultSearchBarProps

export default SearchBar
