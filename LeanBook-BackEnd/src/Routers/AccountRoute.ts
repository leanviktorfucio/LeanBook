import express from 'express';

import { registerAction, updateProfileAction, getProfileAction } from '../Controllers/AccountController';
import { getCurrentProfileMiddleman, getProfileMiddleman, updateProfileMiddleman } from '../Requests/Middleman/AccountMiddleman';

export default (router: express.Router) => {
    router.post('/register', registerAction);
    router.get('/profile', getCurrentProfileMiddleman, getProfileAction); // intended to get the logged-in user's information
    router.get('/profile/:username', getProfileMiddleman, getProfileAction); // intended to get the any user's information by username
    router.patch('/profile/', updateProfileMiddleman, updateProfileAction);
}