import express from 'express';

import { AccountService } from '../Services/AccountService';
import { generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';
import { VALIDATOR, VALIDATOR_FORMAT } from '../Utilities/Validator';
import { generateGenericResponse, ResponseGeneric } from '../Requests/HTTP';
import { BadRequestError, ErrorParams } from '../Errors/Error';

export const loginAction = async (request: express.Request, response: express.Response) => {
    try {
        const { username, password } = request.body;

        VALIDATOR.validate(username, { label: 'Username', formName: 'username' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});
        VALIDATOR.validate(password, { label: 'Password', formName: 'password' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});

        const accountFromUsername = await AccountService.getAccountByUsername(username);
        if (accountFromUsername) {
            const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(accountFromUsername.authentication.salt, password);

            const foundAccount = await AccountService.getAccountByUsernameAndPassword(accountFromUsername.username, processedPassword);

            if (foundAccount) {
                return response.status(200).send('Successful');
            }
        }

        throw new BadRequestError({ message: 'Account with that username can not be found.', metadata: { formName: 'username' } } as ErrorParams);
    } catch (error: any) {
        return response.status(400).json(generateGenericResponse(false, error)).end();
    }
};

