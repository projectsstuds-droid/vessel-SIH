import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import vesselRoutes from './routes/vessel.routes';
import portRoutes from './routes/port.routes';
import forecastRoutes from './routes/forecast.routes';
import optimizationRoutes from './routes/optimization.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/ports', portRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/optimization', optimizationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
