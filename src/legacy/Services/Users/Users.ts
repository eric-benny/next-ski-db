import { ServiceError } from "../Utils"

export interface MongoUser {
    _id: string
    username: string
    authId: string
    favorites: string[]
}


export const fetchUser = async (userid: string | undefined, isAuthenticated: boolean): Promise<MongoUser | undefined>=> {
    if (userid && isAuthenticated) {
        const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/${userid}`, {headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" }});
        const response = await res.json()
        const user = response.data[0]
        return { _id: user._id, username: user.username, authId: user.authId, favorites: user.favorites }
    } else {
        return undefined
    }

}

export const updateUserFavorite = async (updateData: {userId: string, skiId: string, action: string}): Promise<string | ServiceError> => {
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/${updateData.userId}/favorites/${updateData.skiId}`, { method: updateData.action, headers: {'x-api-key': process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "" } });

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