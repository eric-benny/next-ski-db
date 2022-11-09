import { ServiceError } from "../Utils";

export interface Manufacturer {
    _id: string
    name: string
}



export const fetchManufacturers = async (): Promise<Array<Manufacturer>> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/manufacturers`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
    const response = await res.json()

    const manufacturers = response.data
    return manufacturers
}

export const postManufacturer = async (newMan: Manufacturer): Promise<Manufacturer | ServiceError> => {

    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/manufacturers`, { method: 'POST', body: JSON.stringify(newMan), headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

    if (res.ok) {
        const response = await res.json()
        const manufacturer = response.data
        return manufacturer
    } else {
        const response = await res.json()
        return {
            code: res.status,
            name: "Mongo Error",
            description: response.message ? response.message : "an error occured"
        }
    }
}