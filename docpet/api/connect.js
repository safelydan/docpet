import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const db = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB,
  port: process.env.DB_PORT, // Se necessário, defina a porta do banco de dados no seu arquivo .env
  max: 10, // Número máximo de clientes na pool
  idleTimeoutMillis: 30000, // Tempo máximo em milissegundos que um cliente pode permanecer inativo na pool antes de ser fechado
});

// função para conectar ao banco de dados
const connectToDatabase = () => {
  db.connect((err, client, done) => {
    if (err) {
      console.error('Erro ao conectar ao PostgreSQL:', err);
      // lidar com o erro, por exemplo, tentar reconectar ou encerrar o aplicativo.
      setTimeout(connectToDatabase, 8000); // Tentar reconectar após 8 segundos
    } else {
      console.log('Conectado ao PostgreSQL');
      done(); // Liberar o cliente de volta para a pool quando não estiver mais em uso
    }
  });

  // adicionar listener de erro para lidar com outros estados de erro e reconectar conforme necessário
  db.on('error', (err) => {
    console.error('Erro de Conexão PostgreSQL:', err);
    // Você pode adicionar outras condições de erro aqui, se necessário
    setTimeout(connectToDatabase, 8000); // Tentar reconectar após 8 segundos
  });
};

// chamar a função de conexão ao banco de dados
connectToDatabase();

if (!db || db.ended) {
  // reconectar ou criar uma nova conexão, dependendo da sua implementação
  connectToDatabase();
}
