import express, { NextFunction } from 'express';
import { VALIDATOR, VALIDATOR_FORMAT } from '../../Utilities/Validator';
import { generateGenericResponse, getAccountFromRequest, STATUS_CODES } from '../HTTP';
import { ErrorParams } from '../../Errors/Error';

export const getProfileMiddleman = (request: express.Request, response: express.Response, next: NextFunction) => {
    next();
}

export const getCurrentProfileMiddleman = (request: express.Request, response: express.Response, next: NextFunction) => {
    const loggedInAccount = getAccountFromRequest(request);
    if (!loggedInAccount) {
        response.status(STATUS_CODES.UNAUTHORIZED).json(generateGenericResponse(false, { 'message': 'Unauthorized' } as ErrorParams)).end();
        return;
    }

    // I really don't like attaching data to response object just to pass it to the Route Handlers 
    request.params.username = loggedInAccount.username;

    next();
}

export const updateProfileMiddleman = (request: express.Request, response: express.Response, next: NextFunction) => {
    const loggedInAccount = getAccountFromRequest(request);
    if (!loggedInAccount) {
        response.status(STATUS_CODES.UNAUTHORIZED).json(generateGenericResponse(false, { 'message': 'Unauthorized' } as ErrorParams)).end();
        return;
    }

    // I really don't like attaching data to response object just to pass it to the Route Handlers 
    response.locals.account = loggedInAccount;

    const { username, email, firstname, lastname } = request.body;

    VALIDATOR.validate(username, { label: 'Username', formName: 'username' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});
    // VALIDATOR.validate(email, { label: 'Email', formName: 'email' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.EMAIL});
    VALIDATOR.validate(firstname, { label: 'First Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});
    VALIDATOR.validate(lastname, { label: 'Last Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});

    next();
}