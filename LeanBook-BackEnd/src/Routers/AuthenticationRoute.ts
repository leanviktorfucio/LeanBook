import express from 'express';

import { loginAction } from '../Controllers/AuthenticationController';
import { loginMiddleman } from '../Requests/Middleman/AuthenticateMiddleman';

export default (router: express.Router) => {
    router.post('/auth/login', loginMiddleman, loginAction);
}