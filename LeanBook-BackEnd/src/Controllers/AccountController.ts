import express, { NextFunction } from 'express';

import { AccountService } from '../Services/AccountService';
import { AccountDAO } from '../DAO/AccountDAO';
import { getSalt, generateUUID, generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';
import { VALIDATOR, VALIDATOR_FORMAT } from '../Utilities/Validator';
import { AccountRegisterType, AccountUpdateType } from '../Schema/AccountSchema';
import { generateGenericResponse } from '../Requests/HTTP';

export const registerAction = async (request: express.Request, response: express.Response) => {
    try {
        const { username, email, firstname, lastname, password, confirmPassword } = request.body;

        VALIDATOR.validate(username, { label: 'Username', formName: 'username' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.USERNAME});
        // VALIDATOR.validate(email, { label: 'Email', formName: 'email' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.EMAIL});
        VALIDATOR.validate(firstname, { label: 'First Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});
        VALIDATOR.validate(lastname, { label: 'Last Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});
        // VALIDATOR.validate(password, { label: 'Password', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.PASSWORD});

        const accountFromUsername = await AccountService.getAccountByUsername(username, false);
        if (accountFromUsername) {
            return response.status(400).send('username exists');
        }

        const accountFromEmail = await AccountDAO.getAccountByEmail(email);
        if (accountFromEmail) {
            return response.status(400).send('email exists');
        }

        if (password !== confirmPassword) {
            return response.status(400).send('passwords should match');

        }

        const salt = getSalt();
        const _id = generateUUID();
        const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(salt, password);

        const newAccountConfig: AccountRegisterType = {
            _id,
            username,
            email,
            firstname,
            lastname,
            authentication: {
                password: processedPassword,
                salt
            }
        };
        const newAccount = await AccountDAO.registerAccount(newAccountConfig);

        return response.status(200).json(newAccount).end();
    } catch (error: any) {
        console.log(error);
        return response.sendStatus(400);
    }
};

export const getProfileAction = async (request: express.Request, response: express.Response, next: NextFunction) => {
    try {
        let username = request.params?.username;

        const accountFromUsername = await AccountService.getAccountByUsername(username);

        return response.status(200).json(accountFromUsername).end();
    } catch (error: any) {
        return response.status(error.statusCode).json(generateGenericResponse(false, error)).end();
    }
}

export const updateProfileAction = async (request: express.Request, response: express.Response, next: NextFunction) => {
    try {
        const accountToUpdate = response.locals.account; 
        const { username, email, firstname, lastname } = request.body;
        const accountConfig: AccountUpdateType = { username, email, firstname, lastname };

        AccountService.updateAccount(accountToUpdate._id, accountConfig);

        const accountFromUsername = await AccountService.getAccountByUsername(username);

        return response.status(200).json(accountFromUsername).end();
    } catch (error: any) {
        console.log(error);
        return response.sendStatus(400);
    }
}