import { BadRequestError, ErrorParams, InternalServerError } from "../Errors/Error";

export const enum VALIDATOR_FORMAT {
    EMAIL,
    PASSWORD,
    USERNAME,
    ALPHA_NUMERIC_ONLY,
    ALPHABETS_ONLY,
    NUMBERS_ONLY,
    NUMBER_WITH_DECIMAL_ONLY,
    BOOLEAN
}

// these keys should have a corresponding function with the same name, for validation
interface Constraints {
    notEmpty?: boolean,
    minLength?: number,
    maxLength?: number,
    allowedValues?: [],
    allowedTypes?: [],
    allowedValuesRange?: {min: number, max: number},
    mustHaveValues?: [],
    prohibitedValues?: [],
    prohibitedTypes?: [],
    formatRegex?: RegExp,
    format?: VALIDATOR_FORMAT
}

export interface InputInfo {
    label: string,
    formName: string
}

export const VALIDATOR = {
    validate: (value: any, inputInfo: InputInfo, constraints: Constraints): void => {
        Object.entries(constraints).forEach(([constraintType, constraintValue]) => {
            // call the corresponding constraint
            const error = eval(constraintType + '(value, inputInfo, constraintValue);');
            if (error) {
                throw new BadRequestError(error);
            }
        });
    },
    
    validateUsingCustomFunction: (value: any, inputInfo: InputInfo, validate: (value: string, inputInfo: InputInfo) => void): void => {
        validate(value, inputInfo);
    }
}

const notEmpty = (value: string, inputInfo: InputInfo, constraintValue: boolean): ErrorParams | void => {
    const errorMessage = inputInfo.label + ' value cannot be empty.';
    if (constraintValue && value.trim() === '') {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const minLength = (value: string, inputInfo: InputInfo, constraintValue: number): ErrorParams | void => {
    const errorMessage = inputInfo.label + ' value must have at least ' + constraintValue + ' characters.';
    if (value.length < constraintValue) {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const maxLength = (value: string, inputInfo: InputInfo, constraintValue: number): ErrorParams | void => {
    const errorMessage = inputInfo.label + ' value must not have more than ' + constraintValue + ' characters.';
    if (value.length > constraintValue) {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const allowedValues = (value: any, inputInfo: InputInfo, constraintValue: any[]): ErrorParams | void => {
    const errorMessage = inputInfo.label + ' value can only be one of these [' + constraintValue.join(',') + '].';

    if (!constraintValue.includes(value)) {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const formatRegex = (value: string, inputInfo: InputInfo, constraintValue: RegExp): ErrorParams | void => {
    const errorMessage = inputInfo.label + ' value has invalid characters.';
    if (!constraintValue.test(value)) {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const format = (value: string, inputInfo: InputInfo, constraintValue: VALIDATOR_FORMAT): ErrorParams | void => {
    let errorMessage: string | null = null;

    if (constraintValue === VALIDATOR_FORMAT.EMAIL) {
        if (!validateEmail(value)) {
            errorMessage = inputInfo.label + ' value is an incorrect email address.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.PASSWORD) {
        if (!validatePassword(value)) {
            errorMessage = inputInfo.label + ' value is an invalid password.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.ALPHABETS_ONLY) {
        if (!validateAlphabetsOnly(value)) {
            errorMessage = inputInfo.label + ' value should only be alphabets.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.NUMBERS_ONLY) {
        if (!validateNumbersOnly(value)) {
            errorMessage = inputInfo.label + ' value should only be numbers.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.ALPHA_NUMERIC_ONLY) {
        if (!validateAlphaNumbericOnly(value)) {
            errorMessage = inputInfo.label + ' value should only be alpha numeric only.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.USERNAME) {
        if (!validateUsername(value)) {
            errorMessage = inputInfo.label + ' value is an invalid username.';
        }
    } else if (constraintValue === VALIDATOR_FORMAT.BOOLEAN) {
        if (!validateBoolean(value)) {
            errorMessage = inputInfo.label + ' value is an invalid boolean value.';
        }
    } else {
        throw new InternalServerError({
            message: 'Invalid constrainst valiue ' + constraintValue,
            metadata: {
                constraintValue: constraintValue
            }
        } as ErrorParams)
    }

    if (errorMessage !== null) {
        return {
            message: errorMessage,
            metadata: {
                formName: inputInfo.formName
            }
        } as ErrorParams
    }
}

const validateEmail = (value: string): boolean => {
    // const validateEmail = (email) => {
    //     console.log(email)
    //     return String(email)
    //       .toLowerCase()
    //       .match(
    //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //       );
    //   };

    // const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const emailRegexFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    return emailRegexFormat.test(value);
}

const validatePassword = (value: string): boolean => {
    /**
        ^                         Start anchor
        (?=.*[A-Z])               Ensure string has one uppercase letters.
        (?=.*[!@#$&*])            Ensure string has one special case letter.
        (?=.*[0-9].*[0-9])        Ensure string has two digits.
        (?=.*[a-z]) Ensure string has three lowercase letters.
        .{8,}                     Ensure string is at least 8 characters.
        $                         End anchor.
    */

    return (/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/).test(value)
}

const validateAlphabetsOnly = (value: string): boolean => {
    return (/^[a-zA-Z ]+$/).test(value);
}

const validateNumbersOnly = (value: string): boolean => {
    return (/^[0-9]*$/).test(value);
}

const validateAlphaNumbericOnly = (value: string): boolean => {
    return (/^[A-Za-z0-9]+$/).test(value);
}

const validateUsername = (value: string): boolean => {
    return (/^[A-Za-z0-9_.]+$/).test(value);
}

const validateBoolean = (value: string) : boolean => {
    return ["true", "false"].includes(value);
}