import buildQuery, { QueryOptions } from 'odata-query'
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
export interface BasicAPI<T> {
    getPage: (options: {page?: number, limit?: number}, filter?: Partial<QueryOptions<T>>) => Promise<AxiosResponse<PaginationResult<T>>>
    getOne: (id: string | number) => Promise<AxiosResponse<T>>
    deleteOne: (id: string | number) => Promise<AxiosResponse<undefined>>
    updateOne: (id: string | number, updateData: T) => Promise<AxiosResponse<T>>
    createOne?: (data: T) => Promise<AxiosResponse<T>>
}

export const airfoilAPI: BasicAPI<AirfoilDataType> = {
    async getOne (id: string | number) {
        return await axios.get<any,AxiosResponse<AirfoilDataType>>(REACT_APP_API_URL+`/airfoils/${id}`)
    },

    async deleteOne (id: string | number) {
        return await axios.delete(REACT_APP_API_URL+`/airfoils/${id}`)
    },

    async getPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}, filter?: Partial<QueryOptions<AirfoilDataType>>) {
        const queryParameters = buildQuery(filter)
        return await axios.get<any,AxiosResponse<PaginationResult<AirfoilDataType>>>(REACT_APP_API_URL+`/airfoils${filter ? queryParameters + "&" : "?"}page=${options.page}&limit=${options.limit}`)
    },

    async updateOne (id: string | number, updateData: AirfoilDataType) {
        return await axios.put<any,AxiosResponse<AirfoilDataType>>(REACT_APP_API_URL+`/airfoils/${id}`,updateData)
    },
}

export const runAPI: BasicAPI<RunDataType> = { 
    async getOne (id: string | number) {
        return await axios.get<any,AxiosResponse<RunDataType>>(REACT_APP_API_URL+`/runs/${id}`)
    },

    async deleteOne (id: string | number) {
        return await axios.delete(REACT_APP_API_URL+`/runs/${id}`)
    },

    async getPage (options: {page?: number, limit?: number} = { page: 1, limit: 10}, filter?: Partial<QueryOptions<RunDataType>>) {
        const queryParameters = buildQuery(filter)
        return await axios.get<any,AxiosResponse<PaginationResult<RunDataType>>>(REACT_APP_API_URL+`/runs${filter ? queryParameters + "&" : "?"}page=${options.page}&limit=${options.limit}`)
    },

    async updateOne (id: string | number, updateData: RunDataType) {
        return await axios.put<any,AxiosResponse<RunDataType>>(REACT_APP_API_URL+`/runs/${id}`,updateData)
    },
}

export const userAPI: BasicAPI<UserDataType> = { 
    async getOne (id: string | number) {
        return await axios.get<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/users/${id}?uid=true`)
    },
    
    async deleteOne (id: string | number) {
        return await axios.delete(REACT_APP_API_URL+`/users/${id}`)
    },
    
    async getPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}, filter?: Partial<QueryOptions<UserDataType>>) {
        const queryParameters = buildQuery(filter)
        return await axios.get<any,AxiosResponse<PaginationResult<UserDataType>>>(REACT_APP_API_URL+`/users${filter ? queryParameters + "&" : "?"}page=${options.page}&limit=${options.limit}`)
    },

    async updateOne (id: string | number, updateData: UserDataType) {
        return await axios.put<any,AxiosResponse<UserDataType>>(REACT_APP_API_URL+`/users/${id}`,updateData)
    }
}

export const projectAPI: BasicAPI<ProjectDataType> = { 
    async getOne (id: string | number) {
        return await axios.get<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects/${id}`)
    },

    async deleteOne (id: string | number) {
        return await axios.delete(REACT_APP_API_URL+`/projects/${id}`)
    },

    async getPage (options: { page?: number, limit?: number} = { page: 1, limit: 10}, filter?: Partial<QueryOptions<ProjectDataType>>) {
        const queryParameters = buildQuery(filter)
        return await axios.get<any,AxiosResponse<PaginationResult<ProjectDataType>>>(REACT_APP_API_URL+`/projects${filter ? queryParameters + "&" : "?"}page=${options.page}&limit=${options.limit}`)
    },

    async updateOne (id: string | number, updateData: Object) {
        return await axios.put<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects/${id}`,updateData)
    },

    async createOne (data: ProjectDataType) {
        return await axios.post<any,AxiosResponse<ProjectDataType>>(REACT_APP_API_URL+`/projects`, data)
    }
}