import express from 'express';

import { loginAction } from '../Controllers/AuthenticationController';

export default (router: express.Router) => {
    router.post('/auth/login', loginAction);
}