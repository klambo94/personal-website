// src/middleware/admin.ts - Admin authentication and authorization middleware
import { Request, Response, NextFunction } from 'express';

interface AdminRequest extends Request {
    user?: {
        id?: number;
        role?: string; // 'admin' | 'gm' | 'player'
        isModerator?: boolean;
    };
}

// Simple admin authentication (for portfolio - replace with real auth later)
export const requireAdminAuth = (req: AdminRequest, res: Response, next: NextFunction) => {
    // In production, verify JWT or session token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Admin access requires authentication'
        });
    }

    // Extract token (in production, decode JWT here)
    const token = authHeader.split(' ')[1];

    // For portfolio demo - simple mock validation
    // Replace with actual JWT verification in production
    const mockAdminTokens = ['admin-secret-token-2024', 'gm-token-abc'];

    if (!mockAdminTokens.includes(token)) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Invalid admin credentials'
        });
    }

    // Mock user object (replace with real auth payload)
    req.user = {
        id: 1,
        role: 'admin',
        isModerator: true,
    };

    next();
};

