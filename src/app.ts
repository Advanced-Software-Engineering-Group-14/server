import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { IMessageResponse } from './interfaces';
import { ErrorHandler, NotFound } from './middlewares';

import { __generateAuthToken } from './helpers/token';
import { ManagerRoute, AuthRoute, DriverRoute, HomeownerRoute, BinPackagePaymentRoute, BinPackageRoute, BinRequestRoute, BinRoute, EducationalContentRoute, IssueRoute, PaymentRoute, PickupRoute, PickupSettingsRoute, SupportTicketRoute } from './routes';

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
app.use("/api/bin", BinRoute)
app.use("/api/bin-request", BinRequestRoute)
app.use("/api/bin-package", BinPackageRoute)
app.use("/api/bin-package-payment", BinPackagePaymentRoute)
app.use("/api/payment", PaymentRoute)
app.use("/api/pickup", PickupRoute)
app.use("/api/issue", IssueRoute)
app.use("/api/pickup-settings", PickupSettingsRoute)
app.use("/api/educational-content", EducationalContentRoute)
app.use("/api/support-ticket", SupportTicketRoute)



// Middlewares
app.use(NotFound);
app.use(ErrorHandler);

export default app;
