import type { Request, Response, NextFunction } from 'express';
import { z, ZodError, type ZodIssue } from 'zod';

/**
 * Validation Middleware - Synchronous, Express-compatible
 */
export function validate<T>(schema: z.ZodType<T>): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>> {
    return (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
        try {
            // Check content-type
            if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
                return res.status(400).json({ error: 'Content-Type must be application/json' });
            }

            // Parse JSON body (express.json() already parses it, so this is always an object or null)
            const json = req.body;

            // Skip validation if no body provided
            if (!json || typeof json !== 'object') {
                return res.status(400).json({
                    error: 'Request body must be a JSON object',
                    requestId: (req as any).requestId
                });
            }

            // Validate against schema
            const parsed = schema.safeParse(json);

            if (!parsed.success) {
                // Format detailed validation errors for client consumption
                const fieldErrors: Record<string, string> = {};

                parsed.error.errors.forEach((issue: ZodIssue) => {
                    const fieldPath = issue.path.join('.');

                    if (!fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] = issue.message;
                    } else if (fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] += ' • ';
                    }
                });

                return res.status(400).json({
                    error: 'Validation failed',
                    details: Object.keys(fieldErrors).length === 0
                        ? parsed.error.issues.map((i: ZodIssue) => i.message)
                        : fieldErrors,
                    requestId: (req as any).requestId
                });
            }

            // Attach validated data to request for handler access
            (req as any).validatedData = parsed.data;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};

                error.errors.forEach((issue: ZodIssue) => {
                    const fieldPath = issue.path.join('.');

                    if (!fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] = issue.message;
                    } else if (fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] += ' • ';
                    }
                });

                return res.status(400).json({
                    error: 'Validation failed',
                    details: Object.keys(fieldErrors).length === 0
                        ? error.issues.map((i: ZodIssue) => i.message)
                        : fieldErrors,
                    requestId: (req as any).requestId
                });
            }

            return next(error);
        }
    };
}

/**
 * Optional Body Validation Middleware
 */
export function validateOptional<T>(schema: z.ZodType<T>): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>> {
    return (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
        // Skip validation if no body provided (optional request)
        const json = req.body;

        if (!json || typeof json !== 'object' || Object.keys(json).length === 0) {
            return next();
        }

        // Validate against schema
        const parsed = schema.safeParse(json);

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};

            parsed.error.errors.forEach((issue: ZodIssue) => {
                const fieldPath = issue.path.join('.');

                if (!fieldErrors[fieldPath]) {
                    fieldErrors[fieldPath] = issue.message;
                } else if (fieldErrors[fieldPath]) {
                    fieldErrors[fieldPath] += ' • ';
                }
            });

            return res.status(400).json({
                error: 'Validation failed',
                details: Object.keys(fieldErrors).length === 0
                    ? parsed.error.issues.map((i: ZodIssue) => i.message)
                    : fieldErrors,
                requestId: (req as any).requestId
            });
        }

        (req as any).validatedData = parsed.data;

        next();
    };
}

/**
 * Query Validation Middleware for GET requests
 */
export function validateQuery<T>(schema: z.ZodType<T>): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>> {
    return (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
        try {
            const parsed = schema.safeParse(req.query);

            if (!parsed.success) {
                const fieldErrors: Record<string, string> = {};

                parsed.error.errors.forEach((issue: ZodIssue) => {
                    const fieldPath = issue.path.join('.');

                    if (!fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] = issue.message;
                    } else if (fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] += ' • ';
                    }
                });

                return res.status(400).json({
                    error: 'Query validation failed',
                    details: Object.keys(fieldErrors).length === 0
                        ? parsed.error.issues.map((i: ZodIssue) => i.message)
                        : fieldErrors,
                    requestId: (req as any).requestId
                });
            }

            (req as any).validatedQuery = parsed.data;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};

                error.errors.forEach((issue: ZodIssue) => {
                    const fieldPath = issue.path.join('.');

                    if (!fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] = issue.message;
                    } else if (fieldErrors[fieldPath]) {
                        fieldErrors[fieldPath] += ' • ';
                    }
                });

                return res.status(400).json({
                    error: 'Query validation failed',
                    details: Object.keys(fieldErrors).length === 0
                        ? error.issues.map((i: ZodIssue) => i.message)
                        : fieldErrors,
                    requestId: (req as any).requestId
                });
            }

            return next(error);
        }
    };
}

// Export default exports for easy usage
export { validate as validateBody };
export { validateOptional as validateOptionalBody };
