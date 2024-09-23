import express from 'express';
import { VALIDATOR, VALIDATOR_FORMAT } from '../../Utilities/Validator';
import { getAccountFromRequest, STATUS_CODES } from '../HTTP';

export const getProfileMiddleman = (request: express.Request, response: express.Response, next: () => {}) => {
    const loggedInAccount = getAccountFromRequest(request);

    // I really don't like attaching data to response object just to pass it to the Route Handlers 
    response.locals.account = loggedInAccount;

    next();
}

export const updateProfileMiddleman = (request: express.Request, response: express.Response, next: () => {}) => {
    const loggedInAccount = getAccountFromRequest(request);
    if (!loggedInAccount) {
        response.sendStatus(STATUS_CODES.UNAUTHORIZED).end();
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