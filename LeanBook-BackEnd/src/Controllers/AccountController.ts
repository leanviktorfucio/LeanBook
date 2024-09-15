import express from 'express';

import { getAccountByUsername, getAccountByEmail, registerAccount } from '../DAO/Account';
import { getSalt, generateUUID, generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';
import { VALIDATOR, VALIDATOR_FORMAT } from '../Utilities/Validator';

export const register = async (request: express.Request, response: express.Response) => {
    try {
        const { username, email, firstname, lastname, password, confirmPassword } = request.body;

        VALIDATOR.validate(firstname, { label: 'First Name', formName: 'firstname' }, { notEmpty: true, minLength: 1, format: VALIDATOR_FORMAT.ALPHABETS_ONLY});

        // put this in its own validator
        if (!username || !email || !firstname || !lastname || !password || !confirmPassword) {
            console.log(
                'username: ' + username, 
                'email: ' + email, 
                'firstname: ' + firstname, 
                'lastname: ' + lastname, 
                'password: ' + password,
                'confirmPassword: ' + confirmPassword
            );
            return response.status(400).send('invalid form');
        }

        const accountFromUsername = await getAccountByUsername(username);
        if (accountFromUsername) {
            return response.status(400).send('username exists');
        }

        const accountFromEmail = await getAccountByEmail(email);
        if (accountFromEmail) {
            return response.status(400).send('email exists');
        }

        if (password !== confirmPassword) {
            return response.status(400).send('passwords should match');

        }

        const salt = getSalt();
        const uuid = generateUUID();
        console.log(salt, password);
        const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(salt, password);

        console.log(
            'uuid: ' + uuid,
            'username: ' + username, 
            'email: ' + email, 
            'firstname: ' + firstname, 
            'lastname: ' + lastname, 
            'processedPassword: ' + processedPassword,
            'salt: ' + salt
        );

        const newAccount = await registerAccount({
            uuid,
            username,
            email,
            firstname,
            lastname,
            password: processedPassword,
            salt
        });

        return response.status(200).json(newAccount).end();
    } catch (error: any) {
        console.log(error);
        return response.sendStatus(400);
    }
};

