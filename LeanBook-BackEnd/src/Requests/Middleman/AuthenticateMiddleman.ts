import express, { NextFunction } from 'express';
import { VALIDATOR, VALIDATOR_FORMAT } from '../../Utilities/Validator';
import { generateGenericResponse, getAccountFromRequest, STATUS_CODES } from '../HTTP';
import { ErrorParams } from '../../Errors/Error';

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

export const logoutMiddleman = (request: express.Request, response: express.Response, next: NextFunction): void => {
    try {
        const loggedInAccount = getAccountFromRequest(request);
        if (!loggedInAccount) {
            // no need to do anything
            response.status(200).send(generateGenericResponse(true)).end();
            return;
        }
        
        response.locals.account = loggedInAccount;

        next();
    } catch (error: any) {
        response.status(400).json(generateGenericResponse(false, error)).end();
    }
}