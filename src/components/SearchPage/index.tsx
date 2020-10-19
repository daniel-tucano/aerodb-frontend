import React, { useState, useEffect, ReactNode } from 'react'

import { db } from '../../firebase/fireApp'

import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import SearchBar from '../../components/SearchBar'
import PaginationNav from '../../components/PaginationNav'
import { UserData } from '../../contexts/auth'

import './SearchPage.css'

interface searchOptionsType {
    collection: string,
    field: string,
    userID?: string,
    order: 'asc' | 'desc'
}

type SearchPageProps = {
    children: ReactNode,
    pageName: string ,
    searchCollection: string,
    searchField: string,
    constSearchFields?: (string | firebase.firestore.FieldPath)[],
    constSearchTypes?: firebase.firestore.WhereFilterOp[],
    constSearchValues?: any[],
    deconstructorFunction?: (inputData: { [key: string]: string | object }) => (object | string),
    renderSuggestionFunction: (suggestion: object) => Element,
    searchBarResultLimit?: number,
    pagesInNav?: number,
    handleDocsFunction: (docs: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]) => object,
    userRef?: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
    userData?: UserData,
    baseQuery?: firebase.firestore.Query<firebase.firestore.DocumentData> | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
    itensPerPage?: number,
    onSearchResultItensChange: (searchResultItens: object) => {}
} & typeof defaultSearchPageProps

const defaultSearchPageProps = {
    constSearchFields: [],
    constSearchTypes: [],
    constSearchValues: [],
    searchBarResultLimit: 3,
    pagesInNav: 3,
    itensPerPage: 5,
    baseQuery: db.collection('airfoils'),
}


const SearchPage: React.FC<SearchPageProps> = (props: SearchPageProps) => {

    let history = useHistory()
    let location = useLocation()

    const [filteredSearch, setFilteredSearch] = useState<Array<any>>([])

    const [firstDocumentSnapshot, setFirstDocumentSnapshot] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | undefined>(undefined)
    const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | undefined>(undefined)
    const [currentDbQuery, setCurrentDbQuery] = useState<firebase.firestore.Query<firebase.firestore.DocumentData>>(props.baseQuery as firebase.firestore.Query<firebase.firestore.DocumentData> | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>)

    const [nPages, setNPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)


    useEffect(() => {
        const query = queryString.parse(location.search)
        // Código a ser rodado quando o usuário preciona ENTER no campo de pesquisa e muda a "?query=" no url
        if (Object.keys(query).length !== 0 && props.userRef) {

            query.query?.toString().toLowerCase()
            // Para determinar quantas paginas de resultados vamos ter com essa busca executamos a seguinte função e setamos o numero de paginas de acordo
            determineNPages(db, query.query as string, props.itensPerPage, { collection: props.searchCollection, field: props.searchField, userID: props.userRef.id, order: 'asc' }, setNPages, setFilteredSearch)

            // Restabelece a primeira pagina
            setCurrentPage(1)

            // Pesquisa no banco de dados pela query solicitada como um prefixo
            props.baseQuery.where(props.searchField, '>=', query.query).where(props.searchField, '<=', query.query + '\uf8ff').orderBy(props.searchField, 'asc').limit(props.itensPerPage).get().then((results) => {
                handleDocs(results.docs)
            })

            // Substitui a query atual do banco de dados pela nova
            setCurrentDbQuery(props.baseQuery.where(props.searchField, '>=', query.query).where(props.searchField, '<=', query.query + '\uf8ff'))

        } else if (Object.keys(query).length !== 0) {

            query.query?.toString().toLowerCase()
            // Para determinar quantas paginas de resultados vamos ter com essa busca executamos a seguinte função e setamos o numero de paginas de acordo
            determineNPages(db, query.query as string, props.itensPerPage, { collection: props.searchCollection, field: props.searchField, order: 'asc' }, setNPages, setFilteredSearch)

            // Restabelece a primeira pagina
            setCurrentPage(1)

            // Pesquisa no banco de dados pela query solicitada como um prefixo
            props.baseQuery.where(props.searchField, '>=', query.query).where(props.searchField, '<=', query.query + '\uf8ff').orderBy(props.searchField, 'asc').limit(props.itensPerPage).get().then((results) => {
                handleDocs(results.docs)
            })

            // Substitui a query atual do banco de dados pela nova
            setCurrentDbQuery(props.baseQuery.where(props.searchField, '>=', query.query).where(props.searchField, '<=', query.query + '\uf8ff'))
        
        } else {
            props.baseQuery.orderBy(props.searchField, 'asc').limit(props.itensPerPage).get().then((results) => {
                handleDocs(results.docs)
            })
            setCurrentDbQuery(props.baseQuery)
            // Código a ser rodado quando a pagina carrega os dados do usuário
            if (props.userRef && props.userData) {
                determineNPages(db, 'all', props.itensPerPage, { collection: props.searchCollection, field: props.searchField, userID: props.userRef.id, order: 'asc' }, setNPages, setFilteredSearch)
            }  else {                
                determineNPages(db, 'all', props.itensPerPage, { collection: props.searchCollection, field: props.searchField, order: 'asc' }, setNPages, setFilteredSearch)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, props.userRef, props.userData, props.itensPerPage, props.searchField])


    // Código a ser rodado ao mudar a pagina para uma a frente ou uma atras, ou no caso do clique em um botão de número
    const handlePageChange = async (currentPageNumber: number) => {
        if (currentPageNumber === currentPage + 1) {
            const queryResultDocs = await currentDbQuery.orderBy(props.searchField, 'asc').limit(props.itensPerPage).startAfter(lastDocumentSnapshot).get()
            handleDocs(queryResultDocs.docs)
        } else if (currentPageNumber === currentPage - 1) {
            const queryResultDocs = await currentDbQuery.orderBy(props.searchField, 'desc').startAfter(firstDocumentSnapshot).limit(props.itensPerPage).get()
            handleDocs(queryResultDocs.docs.reverse())
        } else {
            const currentPageFirstDoc = await currentDbQuery.where(props.searchField, '==', filteredSearch[(currentPageNumber - 1) * props.itensPerPage]).get()
            const queryResultDocs = await currentDbQuery.orderBy(props.searchField, 'asc').limit(props.itensPerPage).startAt(currentPageFirstDoc.docs[0]).get()
            handleDocs(queryResultDocs.docs)
        }

        setCurrentPage(currentPageNumber)
        return
    }


    const handleDocs = (docs: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]) => {

        const tempSearchResultItens = props.handleDocsFunction(docs)

        setFirstDocumentSnapshot(docs[0])
        setLastDocumentSnapshot(docs[docs.length - 1])
        props.onSearchResultItensChange(tempSearchResultItens)
    }


    const determineNPages = (db: firebase.firestore.Firestore, searchText: string, itensPerPage: number, searchOptions: searchOptionsType, nPagesSetter: React.Dispatch<React.SetStateAction<number>>, filteredSearchSetter: React.Dispatch<React.SetStateAction<Array<any>>>) => {

        const getDocPath = (searchOptions: searchOptionsType, searchText: string) => {
            if (searchOptions.userID) {
                return `users/${searchOptions.userID}/search/${searchOptions.collection}/${searchOptions.field}/${searchText === 'all' || searchText === '' ? 'all' : searchText[0]}`
            } else {
                return `search/${searchOptions.collection}/${searchOptions.field}/${searchText === 'all' || searchText === '' ? 'all' : searchText[0]}`
            }
        }

        const filterExpression = searchText === 'all' || searchText === '' ? '' : `^${searchText}`

        db.doc(getDocPath(searchOptions, searchText)).get().then((result) => {
            if (result.exists) {
                const resultData = result.data() as firebase.firestore.DocumentData
                const filteredSearch = resultData.value.filter((word: string) => {
                    return word.search(filterExpression) !== -1
                })

                if (searchOptions.order === 'asc') {
                    filteredSearch.sort()
                } else if (searchOptions.order === 'desc') {
                    filteredSearch.sort()
                    filteredSearch.reverse()
                } else {
                    console.error('order must be asc or desc')
                }

                const npages = Math.ceil(filteredSearch.length / itensPerPage)

                filteredSearchSetter(filteredSearch)
                nPagesSetter(npages)
            } else {
                console.error('não foi achado nenhum resultado começando com a letra procurada, programar um retorno visual')
            }
        })
    }

    return (
        <div className='search-page-wrapper'>
            <div className="search-bar-row">
                <SearchBar
                    dbInstance={db}
                    collection={props.searchCollection}
                    searchFields={[...props.constSearchFields, props.searchField]}
                    searchTypes={[...props.constSearchTypes, 'prefix']}
                    searchValues={[...props.constSearchValues, '*input']}
                    deconstructorFunction={props.deconstructorFunction}
                    renderSuggestion={props.renderSuggestionFunction}
                    onEnter={(searchText) => (history.push(`${props.pageName}?query=${searchText}`))}
                    limit={props.searchBarResultLimit}
                />
            </div>

            <div className="search-page-result-list">
                {props.children}
            </div>

            <div className="search-page-nav">
                <PaginationNav
                    currentPage={currentPage}
                    pagesInNav={props.pagesInNav}
                    nPages={nPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

SearchPage.defaultProps = defaultSearchPageProps

export default SearchPage


// (suggestions) => (
//     <div className='suggestion-wrapper' onClick={() => history.push(`airfoils/${suggestions.id}`)}>
//         <div className="airfoil-plot-placeholder" id={suggestions.fileName}>{plotAirfoilData(suggestions.geometrie, { strokeWidth: 2, scale: 120 })}</div>
//         <span className="suggestion-main-text">{suggestions.name}</span>
//     </div>
// )