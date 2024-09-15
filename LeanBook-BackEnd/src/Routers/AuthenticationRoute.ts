import express from 'express';

import { login } from '../Controllers/AuthenticationController';

export default (router: express.Router) => {
    router.post('/auth/login', login);
}