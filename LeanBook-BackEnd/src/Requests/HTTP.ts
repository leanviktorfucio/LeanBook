/**
 * STATUS CODES
 */
export const STATUS_CODES = {
    OK: 200,
    REDIRECT: 301,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

export interface ResponseGeneric {
    isSuccess: boolean,
    message: string,
    metadata?: {}
}

export const generateGenericResponse = (isSuccess: boolean, error: any): ResponseGeneric => {
    return {
        isSuccess: isSuccess,
        message: error.message,
        metadata: error.metadata
    } as ResponseGeneric;
}