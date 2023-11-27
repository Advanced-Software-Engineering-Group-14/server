import app from './app';
import config from './config';
import DBCONNECT from './database';


DBCONNECT(() => {
  app.listen(config.app.port, () => {
    console.log(`🔥 Server is running on port ${config.app.port}`);
  });
});
