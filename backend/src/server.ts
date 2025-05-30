import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import questionsRoutes from './routes/questions.routes';
import answersRoutes from './routes/answers.routes';
import tagsRoutes from './routes/tags.routes';
import searchRoutes from './routes/search.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/search', searchRoutes);

// Basic health check route
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('momsquestions').select('*').limit(1);
    
    if (error) throw error;
    
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      database: 'connected'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app; 