import dotenv from 'dotenv';

// set environment
const environment = process.env.NODE_ENV.trim(); // npm run dev sets NODE_ENV to = 'dev ' or 'prod '
dotenv.config({
    path: `src/Config/.env.${environment}`
});

export const getEnvironment = (): string => {
    return environment;
}

export const getEnvValueByKey = (key: string): string => {
    return process.env[key];
}