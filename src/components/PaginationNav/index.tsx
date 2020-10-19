import React from 'react'
// import { Redirect } from 'react-router-dom'

import './PaginationNav.css'

import navLeftIcon from '../../assets/icons/chevron_left-24px.svg'
import navRightIcon from '../../assets/icons/chevron_right-24px.svg'

type PaginationNavProps = {
    nPages: number,
    currentPage: number,
    pagesInNav: number,
    onPageChange?: (currentPage: number) => (void | Promise<void>),
} & typeof defaultPaginationNavProps;

const defaultPaginationNavProps = {
    nPages: 1,
    currentPage: 1,
    pagesInNav: 1,
    onPageChange: (_currentPageNumber: number) => { },
}

const PaginationNav: React.FC<PaginationNavProps> = (props: PaginationNavProps) => {

    const renderPagNavItens = (nPages: number, currentPage: number, pagesInNav: number) => {

        // modelo seguido :     [] -> PaginationNav  () -> currentPage = 4  |       Caso esteja no começo -> isAtStart = true
        //                            nPages = 7|                           |
        //        middleNavItemIndex = 1|       |                           |
        //                              v       v                           |
        //                      1 2 [3 (4) 5] 6 7                           |       [(1) 2 3] 4 5 6 7
        //         firstItemLeft = 3 Î
        //            pagesInNav = 3|<----->|         

        //
        pagesInNav = (pagesInNav > nPages) ? nPages : pagesInNav

        // Indice do item que fica no meio da barra de navegação, começa em 0, por isso o floor
        const middleNavItemIndex = Math.floor(pagesInNav / 2);
        // Indica se a pagina atual passou do item que fica no meio da barra de navegação, usado para mudar o comportamento da barra quando ela atinge esse valor
        const isAtStart = ((currentPage - 1) < middleNavItemIndex) && (pagesInNav < nPages) ? true : false
        const isAtEnd = ((currentPage + middleNavItemIndex) >= nPages) || (pagesInNav >= nPages) ? true : false
        // Se o esta no inicio o primeiro numero a aparecer na barra de navegação é 1, se esta no final é a o numero de paginas - o numero de paginas que aparece mais 1
        // caso contrario é a pagina atual menos o indice do item do meio

        let currentActiveItemIndex = 1
        let firstItemLeft = 1
        const threePointsLastPage = []

        if (isAtStart) {
            firstItemLeft = 1
            currentActiveItemIndex = currentPage - 1
            threePointsLastPage.push(<li className='page-item' style={{ cursor: 'default' }} key='three-points'>...</li>)
            threePointsLastPage.push(<li className='page-item' onClick={() => (props.onPageChange(nPages))} key='last-page'><span className="page-link">{nPages}</span></li>)
        } else if (isAtEnd) {
            firstItemLeft = nPages - pagesInNav + 1
            currentActiveItemIndex = pagesInNav - (nPages - currentPage) - 1
        } else {
            firstItemLeft = (currentPage - middleNavItemIndex)
            currentActiveItemIndex = middleNavItemIndex
            threePointsLastPage.push(<li className='page-item' style={{ cursor: 'default' }} key='three-points'>...</li>)
            threePointsLastPage.push(<li className='page-item' onClick={() => (props.onPageChange(nPages))} key='last-page'><span className="page-link">{nPages}</span></li>)
        }

        const JSXToRender = []

        for (let i_pag_nav = 0; i_pag_nav <= (pagesInNav - 1); i_pag_nav++) {
            if (i_pag_nav === currentActiveItemIndex) {
                JSXToRender.push(<li className="page-item active" style={{ cursor: 'default' }} key={i_pag_nav}><span className="page-link">{firstItemLeft + i_pag_nav}</span></li>)
            } else {
                JSXToRender.push(<li className="page-item" onClick={() => (props.onPageChange(firstItemLeft + i_pag_nav))} key={i_pag_nav}><span className="page-link">{firstItemLeft + i_pag_nav}</span></li>)
            }
        }

        return ([
            <li className="page-item" onClick={() => (currentPage === 1 ? null : props.onPageChange(currentPage - 1))} style={{ cursor: (currentPage === 1 ? 'default' : 'pointer') }} key='previous-page-btn'>
                <img src={navLeftIcon} alt="previous page" className="page-link" />
            </li>,
            ...JSXToRender,
            ...threePointsLastPage,
            <li className="page-item" onClick={() => (currentPage === nPages ? null : props.onPageChange(currentPage + 1))} style={{ cursor: (currentPage === nPages ? 'default' : 'pointer') }} key='next-page-btn'>
                <img src={navRightIcon} alt="next page" className="page-link" />
            </li>])
    }


    return (
        <div className="nav-pagination">
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    {renderPagNavItens(props.nPages, props.currentPage, props.pagesInNav)}
                </ul>
            </nav>
        </div>
    )
}

PaginationNav.defaultProps = defaultPaginationNavProps

export default PaginationNav
