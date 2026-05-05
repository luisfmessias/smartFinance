import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api', routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
