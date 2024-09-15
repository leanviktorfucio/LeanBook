import express from 'express';
import AuthenticationRoute from './AuthenticationRoute';
import AccountRoute from './AccountRoute';

const router = express.Router();

export default (): express.Router => {
    AuthenticationRoute(router);
    AccountRoute(router);

    return router;
}