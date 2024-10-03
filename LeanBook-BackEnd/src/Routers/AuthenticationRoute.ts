import express from 'express';

import { loginAction, logoutAction } from '../Controllers/AuthenticationController';
import { loginMiddleman, logoutMiddleman } from '../Requests/Middleman/AuthenticateMiddleman';

export default (router: express.Router) => {
    router.post('/auth/login', loginMiddleman, loginAction);
    router.post('/auth/logout', logoutMiddleman, logoutAction);
}