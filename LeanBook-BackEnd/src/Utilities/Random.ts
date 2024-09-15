import crypto from 'crypto';
import {getEnvValueByKey, getEnvironment} from '../Utilities/EnvironmentalVariables';

export const getSalt = (): string => crypto.randomBytes(128).toString('base64');

export const generateDatabasePasswordFromSaltAndUserPassword = (salt: string, password: string): string => {
    const secretKey = getEnvValueByKey('AUTHENTICATION_SECRET_KEY')
    return crypto.createHmac('sha256', [salt, password].join('/')).update(secretKey).digest('hex');
}

export const generateUUID = (): string => {
    return crypto.randomUUID();
}