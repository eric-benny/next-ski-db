import { Manufacturer } from "../Manufacturers";
import { ServiceError } from "../Utils";

export interface SkiFamily {
    _id: string
    manufacturer: Manufacturer
    name: string
}


export const fetchSkiFamilies = async (): Promise<Array<SkiFamily>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skiFamilies`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const skiFamilies = response.data
    return skiFamilies
}

export const postFamily = async (newFam: SkiFamily): Promise<SkiFamily | ServiceError> => {

    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skiFamilies`, { method: 'POST', body: JSON.stringify(newFam), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const family = response.data
        return family
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}