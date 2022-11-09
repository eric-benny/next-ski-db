
export interface ServiceError {
    code: number
    name: string
    description: string
}

export const isServiceError = (value: any): value is ServiceError => {
    return value.code && value.name && value.description;
}
