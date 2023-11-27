import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { IMessageResponse } from './interfaces';
import { ErrorHandler, NotFound } from './middlewares';

import { __generateAuthToken } from './helpers/token';
import { ManagerRoute, AuthRoute, DriverRoute, HomeownerRoute } from './routes';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.get<{}, IMessageResponse>('/api', (req, res) => {
  res.json({
    message: 'Wastify Server',
  });
});


// Routes


app.use("/api/manager", ManagerRoute)
app.use("/api/auth", AuthRoute)
app.use("/api/driver", DriverRoute)
app.use("/api/homeowner", HomeownerRoute)



// Middlewares
app.use(NotFound);
app.use(ErrorHandler);

export default app;
