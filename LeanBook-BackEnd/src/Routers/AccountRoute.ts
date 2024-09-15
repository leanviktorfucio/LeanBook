import express from 'express';

import { register } from '../Controllers/AccountController';

export default (router: express.Router) => {
    router.post('/register', register);
}