import { QueryBuilder } from 'odata-query-builder'
import axios, { AxiosResponse } from 'axios'
import { SelectionAirfoilDataType } from '../contexts/SelectionListContext'

const { REACT_APP_API_URL } = process.env

export type AirfoilDataType = {
    _id: string,
    airfoilID: number,
    name: string,
    nameLowerCase: string,
    filename: string,
    geometrie: {
        side: string[],
        x: number[],
        y: number[],
    },
    thickness: number,
    xThickness: number,
    camber: number,
    xCamber: number,
    source: string,
    creator: {
        name: string,
        userName: string,
        userID: string
    },
    postedDate: Date,
    runs: {
        runIDs: number[]
        runObjIDs: string[]
    }
}

export type RunDataType = {
    _id: string,
    runID: number,
    airfoilID: number,
    airfoilObjID: string,
    reynolds: number,
    mach: number,
    polar: {
        alpha: number[],
        cl: number[],
        cd: number[],
        cm: number[],
    },
    polarProperties: {
        clMax: number,
        cl0: number,
        clAlpha: number,
        cdMin: number,
        cdMax: number,
        clCdMax: number,
        cm0: number,
        alphaStall: number,
        alpha0Cl: number,
        alphaClCdMax: number,
    },
    source: string,
    additionalData: object,
    creator: string,
    postedDate: Date,
}

export type UserDataType = {
    _id: string,
    uid: string,
    name: string,
    userName: string,
    email: string,
    gender: string,
    yearOfBirth: Date,
    institution?: string,
    about: string,
    projects: {
        name: string,
        projectID: string
    }[],
    userAirfoils: string[],
    favoriteAirfoils: string[],
} 

export type ProjectDataType = {
    _id?: string,
    creator: string,
    name: string,
    airfoils: SelectionAirfoilDataType[],
}

export type PaginationResult<T> = {
    docs: T[],
    totalDocs: number,
    limit: number,
    totalPages: number,
    page: number,
    paginingCounter: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    prevPage: boolean,
    nextPage: boolean,
}

export const airfoilAPI = {
    async getOneAirfoil (airfoilId: number) {
        return await axios.get<any,AxiosResponse<AirfoilDataType>>(REACT_APP_API_URL+`/airfoils/${airfoilId}`)
    },

    async deleteAirfoil (airfoilId: number) {
        return await axios.delete(REACT_APP_API_URL+`/airfoils/${airfoilId}`)
    },

    async getAirfoilsPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}) {
        return await axios.get<any,AxiosResponse<PaginationResult<AirfoilDataType>>>(REACT_APP_API_URL+`/airfoils?page=${options.page}&limit=${options.limit}`)
    },

    async updateAirfoil (airfoilId: string, updateData: Object) {
        return await axios.put<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/airfoils/${airfoilId}`,updateData)
    },
}

export const runAPI = { 
    async getOneRun (runId: number) {
        return await axios.get<any,AxiosResponse<RunDataType>>(REACT_APP_API_URL+`/runs/${runId}`)
    },

    async deleteRun (runId: number) {
        return await axios.delete(REACT_APP_API_URL+`/runs/${runId}`)
    },

    async getRunsPage (query?: QueryBuilder, options: {page?: number, limit?: number} = { page: 1, limit: 10}) {
        let queryString
        if (query?.filter) {
            // Converte a query para string, retira o '?' no comeco e adicina um & ao final
            queryString = query.toQuery().substring(1) + '&'
        }

        return await axios.get<any,AxiosResponse<PaginationResult<RunDataType>>>(REACT_APP_API_URL+`/runs?${queryString}page=${options.page}&limit=${options.limit}`)
    },

    async updateRun (runId: string, updateData: Object) {
        return await axios.put<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/runs/${runId}`,updateData)
    },
}

export const userAPI = { 
    async getOneUser (userID: string) {
        return await axios.get<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/users/${userID}?uid=true`)
    },
    
    async deleteUser (userID: string) {
        return await axios.delete(REACT_APP_API_URL+`/users/${userID}`)
    },
    
    async getUsersPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}) {
        return await axios.get<any,AxiosResponse<PaginationResult<UserDataType>>>(REACT_APP_API_URL+`/users?page=${options.page}&limit=${options.limit}`)
    },

    async updateUser (userID: string, updateData: Object) {
        return await axios.put<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/users/${userID}`,updateData)
    }
}

export const projectAPI = { 
    async getOneProject (projectID: string) {
        return await axios.get<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects/${projectID}`)
    },

    async deleteProject (projectID: string) {
        return await axios.delete(REACT_APP_API_URL+`/projects/${projectID}`)
    },

    async getProjectsPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}) {
        return await axios.get<any,AxiosResponse<PaginationResult<ProjectDataType>>>(REACT_APP_API_URL+`/projects?page=${options.page}&limit=${options.limit}`)
    },

    async updateProject (projectID: string, updateData: Object) {
        return await axios.put<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects/${projectID}`,updateData)
    },

    async createProject (project: ProjectDataType) {
        return await axios.post<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects`, project)
    }
}