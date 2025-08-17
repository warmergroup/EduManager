export const corsOptions = {
  origin: function (origin, callback) {
    // Development va testing uchun
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      
      // Vercel frontend domains
      'https://edu-manager-three.vercel.app',
      'https://edu-manager-frontend.vercel.app',
      
      // Environment variable orqali qo'shimcha domainlar
      ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : [])
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked for: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: [
    'X-Total-Count', 
    'X-Page-Count',
    'X-Request-ID'
  ],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
