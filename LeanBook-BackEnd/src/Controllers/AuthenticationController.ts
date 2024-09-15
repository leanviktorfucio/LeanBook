import express from 'express';

import { getAccountByUsername, getAccountByUsernameAndPassword } from '../DAO/Account';
import { generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';

export const login = async (request: express.Request, response: express.Response) => {
    try {
        console.log(request.body);
        const { username, password } = request.body;

        // put this in its own validator
        if (!username || !password) {
            console.log('username: ' + username, 'password: ' + password);
            return response.status(400).send('Username or password is invalid');
        }

        const accountFromUsername = await getAccountByUsername(username);
        if (accountFromUsername) {
            const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(accountFromUsername.salt, password);

            const foundAccount = await getAccountByUsernameAndPassword(accountFromUsername.username, processedPassword);

            if (foundAccount) {
                return response.status(200).send('Successful');
            }
        }

        return response.status(400).send('Incorrect username or password'); 
    } catch (error: any) {
        console.log(error);
        return response.status(400).send('There was an unknown error loggin in.');
    }
};

