import express from 'express';

import { registerAction, profileAction, updateProfileAction } from '../Controllers/AccountController';
import { STATUS_CODES } from '../Requests/HTTP';
import { UpdateProfileMiddleman } from '../Requests/Middleman/AccountMiddleman';

export default (router: express.Router) => {
    router.post('/register', registerAction);
    router.get('/profile', profileAction); // intended to get the logged in user's information
    router.get('/profile/:username', profileAction); // intended to get the any user's information by username
    router.patch('/profile/', UpdateProfileMiddleman, updateProfileAction);
}

// a middleware used to authenticate action before going inside that function
function authenticate (request: express.Request, response: express.Response, next: () => {}) {
    next();
    // // check if logged in
    // if () {
    //     next();
    // } else {
    //     response.status(STATUS_CODES.UNAUTHORIZED).end();
    // }
}