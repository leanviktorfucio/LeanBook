import express from 'express';
import jwt from 'jsonwebtoken';

import { AccountService } from '../Services/AccountService';
import { generateDatabasePasswordFromSaltAndUserPassword } from '../Utilities/Random';
import { generateGenericResponse, ResponseGeneric } from '../Requests/HTTP';
import { BadRequestError, ErrorParams } from '../Errors/Error';
import { getEnvValueByKey } from '../Utilities/EnvironmentalVariables';
import { TIME } from '../Config/Constants';
import { AccountUpdateType } from '../Schema/AccountSchema';
import { DateTime } from '../Utilities/DateTime';

export const loginAction = async (request: express.Request, response: express.Response) => {
    const { username, password } = request.body;

    try {
        const accountFromUsername = await AccountService.getAccountByUsernameWithAuthentication(username);
        
        const processedPassword = generateDatabasePasswordFromSaltAndUserPassword(accountFromUsername.authentication.salt, password);
    
        const accountNewConfigWithNewLoggedInTime: AccountUpdateType = { 'lastlogindatetime': DateTime.getNowAsDate() };
        AccountService.updateAccount(accountFromUsername._id, accountNewConfigWithNewLoggedInTime);

        const account = await AccountService.getAccountByUsernameAndPassword(accountFromUsername.username, processedPassword);

        const jwtToken = jwt.sign({account}, getEnvValueByKey('JWT_SECRET_KEY'), { expiresIn: TIME.ONE_DAY_IN_SECONDS});

        response.cookie('token', jwtToken, {
            httpOnly: true,
            // secure: true, @todo learn these
            // maxAge: 100000,
            // signed: true
        });
    
        return response.status(200).send(generateGenericResponse(true)).end();
    } catch (error: any) {
        return response.status(400).json(generateGenericResponse(false, error)).end();
    }
};

export const logoutAction = async (request: express.Request, response: express.Response) => {
    console.log('logout');

    delete response.locals.account;

    response.clearCookie('token');

    return response.status(200).send(generateGenericResponse(true));
};