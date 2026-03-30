// server/middleware/index.ts

import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import express from 'express';


/**
 * Generate UUID for request tracking (set after rate limiting)
 */
const generateRequestId = () => Math.random().toString(36).substring(2, 15);

/**
 * Rate limiter message - MUST NOT reference req here!
 * Express will inject requestId into req object before calling middleware handler
 */
const rateLimitMessage: { error: string } & Record<string, unknown> = {
    error: 'Too many requests from this IP, please try again later.'
};

/**
 * Setup all Express middleware in the correct order
 */
export const setupMiddleware = (app: express.Application) => {
    // 1. Helmet - Security headers (must be early)
    app.use(helmet());

    // 2. CORS - Cross-origin resource sharing (must be early)
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    }));

    // 3. Rate limiting (prevent abuse on /api and /admin routes)
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: rateLimitMessage, // Fixed: No req reference here!
    });

    const adminLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // 20 requests per hour for admin
        message: { error: 'Too many admin requests, please try again later.' },
    });

    app.use('/api/', apiLimiter);
    app.use('/admin/', adminLimiter);

    // 4. Request body parser (must be before route handlers)
    app.use(express.json({
        limit: '10mb', // Prevent massive payloads
        strict: true,
    }));

    // 5. Content-type validation middleware
    app.use(validateContentTypes);

    // 6. Logging (morgan - don't use in production without rate limiting first)
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    }

    return app;
};

/**
 * Content-type validation middleware - Proper Express signature
 */
export const validateContentTypes: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>> =
    (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
        const acceptable = ['application/json'];

        if (!req.headers['content-type'] || !acceptable.includes(req.headers['content-type'])) {
            return res.status(415).json({
                error: 'Unsupported Media Type',
                details: `Acceptable media types: ${acceptable.join(', ')}`,
                requestId: (req as any).requestId || generateRequestId() // Generate if not set
            });
        }

        // Optional: Set requestId if not already present
        if (!(req as any).requestId) {
            (req as any).requestId = generateRequestId();
        }

        next();
    };
