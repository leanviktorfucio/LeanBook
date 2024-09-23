import express from 'express';
import jwt from 'jsonwebtoken';

import { AccountService } from '../Services/AccountService';
import { generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';
import { generateGenericResponse, ResponseGeneric } from '../Requests/HTTP';
import { BadRequestError, ErrorParams } from '../Errors/Error';
import { getEnvValueByKey } from '../Utilities/EnvironmentalVariables';
import { TIME } from '../Config/Constants';
import { AccountUpdateType } from '../Schema/AccountSchema';

export const loginAction = async (request: express.Request, response: express.Response) => {
    const { username, password } = request.body;

    try {
        const accountFromUsername = await AccountService.getAccountByUsernameWithAuthentication(username);
        
        const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(accountFromUsername.authentication.salt, password);
    
        const accountNewConfigWithNewLoggedInTime: AccountUpdateType = { 'lastlogindatetime': new Date(Date.now()) }; // @todo create Date class
        AccountService.updateAccount(accountFromUsername._id, accountNewConfigWithNewLoggedInTime);

        const account = await AccountService.getAccountByUsernameAndPassword(accountFromUsername.username, processedPassword);

        const jwtToken = jwt.sign({account}, getEnvValueByKey('JWT_SECRET_KEY'), { expiresIn: TIME.ONE_DAY_IN_SECONDS});

        response.cookie('token', jwtToken, {
            httpOnly: true,
            // secure: true, @todo learn these
            // maxAge: 100000,
            // signed: true
        });
    
        return response.status(200).send(generateGenericResponse(true));
    } catch (error: any) {
        return response.status(400).json(generateGenericResponse(false, error)).end();
    }
};