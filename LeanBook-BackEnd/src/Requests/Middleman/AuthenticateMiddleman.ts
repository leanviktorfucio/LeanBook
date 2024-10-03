import express, { NextFunction } from 'express';
import { VALIDATOR, VALIDATOR_FORMAT } from '../../Utilities/Validator';
import { generateGenericResponse } from '../HTTP';

// a middleware used to authenticate action before going inside that function
export const loginMiddleman = (request: express.Request, response: express.Response, next: NextFunction): void => {
    try {
        const { username, password } = request.body;

        VALIDATOR.validate(username, { label: 'Username', formName: 'username' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});
        VALIDATOR.validate(password, { label: 'Password', formName: 'password' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});

        next();
    } catch (error: any) {
        response.status(400).json(generateGenericResponse(false, error)).end();
    }
}