import express from 'express';
import { VALIDATOR, VALIDATOR_FORMAT } from '../../Utilities/Validator';

export const UpdateProfileMiddleman = (request: express.Request, response: express.Response, next: () => {}) => {
    const { username, email, firstname, lastname } = request.body;

    VALIDATOR.validate(username, { label: 'Username', formName: 'username' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});
    // VALIDATOR.validate(email, { label: 'Email', formName: 'email' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.EMAIL});
    VALIDATOR.validate(firstname, { label: 'First Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});
    VALIDATOR.validate(lastname, { label: 'Last Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});

    next();
}