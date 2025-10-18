import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jobRoutes from './routes/JOB.route';
import payoutRoutes from './routes/payout.route';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/jobs', jobRoutes);
app.use('/payouts', payoutRoutes);

app.get('/', (req, res) => {
  res.send('✅ ClickHouse API is running');
});

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
