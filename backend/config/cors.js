export const corsOptions = {
  origin: function (origin, callback) {
    // Log the origin for debugging
    console.log('Request origin:', origin);
    
    // Development va testing uchun
    if (!origin || process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing all origins');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      // Local development
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      '127.0.0.1:5173',
      'http://192.168.1.3:3000',
      'http://192.168.1.3:5173',

      // Vercel frontend domains
      'https://edu-manager-three.vercel.app',
      'https://edumanager-backend-rust.vercel.app',
      
      // Portfolio subdomain
      'https://edumanager.sultonovdev.uz',
      'http://edumanager.sultonovdev.uz',
      
      // Environment variable orqali qo'shimcha domainlar
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
    ];
    
    // Debug uchun log
    // console.log(`🌐 CORS check for origin: ${origin}`);
    // console.log(`✅ Allowed origins:`, allowedOrigins);
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked for: ${origin}`);
      console.warn(`🔍 Available origins:`, allowedOrigins);
      console.warn(`🔍 Environment:`, process.env.NODE_ENV);
      console.warn(`🔍 CORS_ORIGIN:`, process.env.CORS_ORIGIN);
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
