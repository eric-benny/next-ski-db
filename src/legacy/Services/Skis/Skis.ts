import { useQuery } from "@tanstack/react-query"
import { Manufacturer } from "../Manufacturers"
import { SkiFamily } from "../SkiFamilies"
import { MongoUser } from "../Users"
import { ServiceError } from "../Utils"

export interface SkiSpec {
    length: number
    measuredLength: number
    weightStated: number | undefined
    weightMeas: Array<number>
    dimTip: number
    dimWaist: number
    dimTail: number
    dimTipMeas: number
    dimWaistMeas: number
    dimTailMeas: number
    sidcutStated: number | undefined
    splayTip: number | undefined
    splayTail: number | undefined
    camberStated: string | undefined
    camberMeas: string | undefined
    core: string | undefined
    base: string | undefined
    mountPointFac: Array<string>
    mountPointBlist: Array<string>
    flexTip: string | undefined
    flexShovel: string | undefined
    flexFront: string | undefined
    flexFoot: string | undefined
    flexBack: string | undefined
    flexTail: string | undefined
}

export interface Note {
    user: MongoUser,
    note: string,
    lastUpdated: Date,
    skiDays: number
}

export interface NoteUpload {
    user: string,
    note: string,
    lastUpdated: Date,
    skiDays: number
}

export interface NotesUpload {
    notes: NoteUpload[]
}

export interface SkiComp {
    _id: string
    primarySki: {_id: string, model: string}
    secondarySki: {_id: string, model: string},
    comps: {attribute: string, quantifier: number}[]
    notes: string
}

export interface SkiCompUpload {
    _id?: string
    primarySki: string
    secondarySki: string
    comps: {attribute: string, quantifier: number}[]
    notes: string
}

export interface SkiLegacy {
    _id?: string
    yearCurrent: number
    yearReleased: number
    yearsActive: Array<number>
    retired: boolean
    manufacturer: Manufacturer
    model: string
    parent: SkiLegacy | undefined
    family: SkiFamily | undefined
    lengths: Array<number>
    specs: Array<SkiSpec>
    skiComps: Array<SkiComp>
    guideInfo: Array<any>
    notes: Array<Note>
    images: Array<any>
    url: string
    firstLook: string
    flashReview: string
    deepDive: string
}

export interface SkiData extends SkiLegacy {
    _id: string
}

interface SkiUpload {
    yearCurrent: number
    yearReleased: number
    yearsActive: Array<number>
    retired: boolean
    manufacturer: string
    model: string
    parent: string | undefined
    family: string | undefined
    lengths: Array<number>
    specs: Array<SkiSpec>
    notes?: Array<NoteUpload>
    url: string
}

export interface SkiSingle {
    mongo_id: string
    id: string
    yearCurrent: number
    yearReleased: number
    yearsActive: Array<number>
    retired: boolean
    manufacturer: string
    model: string
    parent: SkiLegacy | undefined
    family: SkiFamily | undefined
    lengths: Array<number>
    url: string
    length: number
    measuredLength: number
    weightStated: number
    weightMeas: Array<number>
    dimTip: number
    dimWaist: number
    dimTail: number
    dimTipMeas: number
    dimWaistMeas: number
    dimTailMeas: number
    sidcutStated: number
    splayTip: number
    splayTail: number
    camberStated: string
    camberMeas: string
    core: string
    mountPointFac: Array<string>
    mountPointBlist: Array<string>
    flexTip: string
    flexShovel: string
    flexFront: string
    flexFoot: string
    flexBack: string
    flexTail: string
}

// interface SkiResponse {
//     data: Array<SkiSingle>
// }

export const fetchSkis = async (): Promise<Array<SkiSingle>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const skisFull = response.data
    const skis = skisFull.reduce((skis: Array<SkiSingle>, ski: SkiLegacy) => {
        for (let i = 0; i < 1; i++) {
            const skiSingle = {
                mongo_id: ski._id,
                id: ski._id?.concat(i.toString()),
                yearCurrent: ski.yearCurrent,
                yearReleased: ski.yearReleased,
                yearsActive: ski.yearsActive,
                retired: ski.retired,
                manufacturer: ski.manufacturer ? ski.manufacturer.name : null,
                model: ski.model,
                parent: ski.parent,
                family: ski.family,
                lengths: ski.lengths,
                url: ski.url,
                ...ski.specs[i]
            } as SkiSingle
            skis.push(skiSingle)
        }
        return skis
    }, [])
    return skis
}


export const useSkis = (enabled: boolean = true) => useQuery(['skis'], fetchSkis, { enabled: enabled })

export const fetchSkisFull = async (): Promise<Array<SkiData>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const skisFull = response.data
    return skisFull
}

export const useSkisFull = (enabled: boolean = true) => useQuery(['skisFull'], fetchSkisFull, { enabled: enabled })

export const fetchSki = async (skiId: string): Promise<SkiLegacy> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis/${skiId}`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const ski = response.data

    return ski
}

export const updateSki = async (updateData: {skiId: string, skiData: SkiUpload | NotesUpload}): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis/${updateData.skiId}`, { method: 'PUT', body: JSON.stringify(updateData.skiData), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const postSki = async (newSki: SkiUpload): Promise<SkiLegacy | ServiceError> => {

    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis`, { method: 'POST', body: JSON.stringify(newSki), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const ski = response.data
        return ski
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}


export const postSkiComp = async (newComp: SkiCompUpload): Promise<SkiComp | ServiceError> => {

    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skiComps`, { method: 'POST', body: JSON.stringify(newComp), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const skiComp = response.data
        return skiComp
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const updateSkiComp = async (updateData: {skiCompId: string, skiCompData: SkiCompUpload}): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skiComps/${updateData.skiCompId}`, { method: 'PUT', body: JSON.stringify(updateData.skiCompData), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const deleteSki = async (skiId: string): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis/${skiId}`, { method: 'DELETE', headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const deleteSkiComp = async (skiCompId: string): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skiComps/${skiCompId}`, { method: 'DELETE', headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export interface GuideSki {
    _id: string
    ski: SkiData
    category: string,
    year: number,
    specLength: number
    blurb: string
}

export interface GuideSkiUpload {
    _id?: string
    ski: string
    category: string,
    year: number,
    specLength: number
    blurb: string
}

export const fetchGuideSkisYear = async (year: string): Promise<Array<GuideSki>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/guideSkis/${year}`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const skis = response.data
    return skis
}

export const postGuideSki = async (newGuideSki: GuideSkiUpload): Promise<GuideSki | ServiceError> => {

    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/guideSkis`, { method: 'POST', body: JSON.stringify(newGuideSki), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const guideSki = response.data
        return guideSki
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const updateGuideSki = async (updateData: {guideSkiId: string, guideSkiData: GuideSkiUpload | {blurb: string}}): Promise<{message: string, id: string} | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/guideSkis/${updateData.guideSkiId}`, { method: 'PUT', body: JSON.stringify(updateData.guideSkiData), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const deleteGuideSki = async (guideSkiId: string): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/guideSkis/${guideSkiId}`, { method: 'DELETE', headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});

    if (res.ok) {
        const response = await res.json()
        const message = response.data
        return message
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}

export const fetchGuideSkisSki = async (skiId: string): Promise<Array<GuideSki>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skis/${skiId}/guideSkis`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const skis = response.data
    return skis
}