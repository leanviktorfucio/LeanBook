import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import router from './Routers';
import {getEnvValueByKey, getEnvironment} from './Utilities/EnvironmentalVariables';

const app = express();

app.use(cors({
    origin: 'http://localhost:4200', // Replace with your Angular app URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Pre-action middleware
// will be called first before going to actions
app.use((request: express.Request, response: express.Response, next: () => {}) => {
    next();
});

app.use('/', router());

const server = http.createServer(app);

server.listen(getEnvValueByKey('SERVER_PORT'), () => {
    console.log(`API Server is running on port: ${getEnvValueByKey('SERVER_PORT')} as ${getEnvironment()}`);
});

mongoose.Promise = Promise;
mongoose.connect(getEnvValueByKey('DATABASE_CONNECTION_STRING'));
mongoose.connection.on('error', (error: Error) => console.log(error));
