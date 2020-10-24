import { AxiosResponse } from 'axios'

export type airfoilDataType = {
	_id: string,
	airfoilID: number,
	name: string,
	nameLowerCase: string,
	filename: string,
	source: string,
	geometrie: {
		side: string[],
		x: number[],
		y: number[],
	},
	creator: {
		name: string,
		userName: string,
		userID: string,
	},
	postedDate: Date,
	camber: number,
	xCamber: number,
	thickness: number,
	xThickness: number,
	runs: {
		runID: number[],
		runObjIDs: string[],
	},
}

export type runDataType = {
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


export type projectDataType = {
	creator: string,
	name: string,
	airfoils: {
		airfoilID: number,
		name: string,
		geometrie: {
			side: string[],
			x: number[],
			y: number[],
		},
		runsData: {
			runID: number,
			mach: number,
			reynolds: number,
		}[]
	}[]
}

export type userDataType = {
	uid: string:
	name: string,
	userName: string,
	email: string,
	gender: string,
	yearOfBirth: Date,
	institution: string,
	about: string,
	projects: {
		name: string,
		projectID: string,
	}[],
	userAirfoils: string[],
	favoriteAirfoils: string[],
}

