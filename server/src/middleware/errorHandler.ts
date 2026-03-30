
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
    // Log error to console
    console.error('Error:', err instanceof Error ? err.message : String(err));

    if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
            error: err instanceof Error ? err.message : 'Internal server error',
            stack: err instanceof Error && err.stack ? err.stack : undefined,
            requestId: (req as any).requestId
        });
    }

    // Production - minimal info
    return res.status(500).json({
        error: 'Internal server error',
        requestId: (req as any).requestId
    });
};
