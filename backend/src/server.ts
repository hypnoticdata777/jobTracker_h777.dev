import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Servidor de seguimiento de postulaciones disponible en http://localhost:${env.PORT}`);
});
