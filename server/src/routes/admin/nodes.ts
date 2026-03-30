import { Router } from "express";
import { db } from "../../db/config";
import { nodes } from "../../schema/schema";
import { nodeSchema } from "../../../../lib/zodSchemas";
import {and, asc, eq, desc} from "drizzle-orm";

export const adminNodesRouter = Router();

/**
 * GET /admin/nodes - List all nodes with pagination/filtering
 */
adminNodesRouter.get('/', async (req: any, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = (req.query.search as string) || '';

        // Build WHERE clause with optional text search
        let whereCondition = eq(nodes.isDeleted, false);

        if (search) {
            const searchLower = search.toLowerCase();
            const nodeText = nodes.nodeText;

            // SQLite partial match query
            whereCondition = and(
                whereCondition,
                asc(nodeText),
                desc(nodes.id)
            );
        }

        // Fetch paginated results
        const totalNodes = await db.select({ count: nodes.id }).from(nodes).count();

        const nodesList = await db.query.nodes.findMany({
            where: and(whereCondition, eq(nodes.isDeleted, false)),
            orderBy: desc(nodes.id),
            limit: limit,
            offset: (page - 1) * limit
        });

        return res.json({
            status: 'success',
            data: nodesList.map(n => ({
                id: n.id,
                nodeText: n.nodeText,
                isFinalOutcome: Boolean(n.isFinalOutcome),
                endingTitle: n.endingTitle,
                scoreMultiplier: Number(n.scoreMultiplier),
                createdAt: new Date(n.createdAt).toISOString(),
            })),
            pagination: {
                page,
                limit,
                totalItems: nodesList.length,
                totalPages: Math.ceil(nodesList.length / limit)
            },
        });

    } catch (error) {
        console.error("Error fetching admin nodes:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to load nodes'
        });
    }
});


/**
 * POST /admin/nodes - Create new node
 */
adminNodesRouter.post('/', async (req, res) => {
    try {
        // ✅ Validate with Zod
        const validation = nodeSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: 'error',
                error: 'Validation failed',
                errors: validation.error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }

        const { nodeText, scoreMultiplier = 1, endingTitle, isFinalOutcome = false } = validation.data;

        // Create new node
        const newNode = await db.insert(nodes).values({
            id: null, // Let auto-increment handle this
            nodeText,
            scoreMultiplier: Number(scoreMultiplier),
            endingTitle: endingTitle || null,
            isFinalOutcome: Boolean(isFinalOutcome),
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return res.status(201).json({
            status: 'success',
            message: `Node created successfully. ID: ${newNode.id}`,
            data: newNode,
        });

    } catch (error) {
        console.error("Error creating node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to create node'
        });
    }
});


/**
 * PUT /admin/nodes/:id - Update node
 */
adminNodesRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Validate with Zod
        const validation = nodeSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: 'error',
                error: 'Validation failed'
            });
        }

        const { nodeText, scoreMultiplier, endingTitle, isFinalOutcome } = validation.data;

        // Check if node exists and isn't deleted
        const existingNode = await db.query.nodes.findFirst({
            where: and(
                eq(nodes.id, id),
                eq(nodes.isDeleted, false)
            )
        });

        if (!existingNode) {
            return res.status(404).json({
                status: 'error',
                error: 'Node not found'
            });
        }

        // Update node
        const updatedNode = await db.update(nodes)
            .set({
                nodeText,
                scoreMultiplier: Number(scoreMultiplier),
                endingTitle: endingTitle || null,
                isFinalOutcome: Boolean(isFinalOutcome),
                updatedAt: new Date(),
            })
            .where(eq(nodes.id, id))
            .returning();

        return res.json({
            status: 'success',
            message: `Node updated successfully`,
            data: updatedNode[0],
        });

    } catch (error) {
        console.error("Error updating node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to update node'
        });
    }
});


/**
 * DELETE /admin/nodes/:id - Soft delete node
 */
adminNodesRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check if node exists and isn't already deleted
        const existingNode = await db.query.nodes.findFirst({
            where: eq(nodes.id, id)
        });

        if (!existingNode) {
            return res.status(404).json({
                status: 'error',
                error: 'Node not found'
            });
        }

        // Soft delete (mark as deleted instead of hard delete)
        await db.update(nodes)
            .set({
                isDeleted: true,
                updatedAt: new Date(),
            })
            .where(eq(nodes.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Node soft-deleted successfully`,
            data: {
                id,
                status: 'deleted'
            },
        });

    } catch (error) {
        console.error("Error deleting node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to delete node'
        });
    }
});


/**
 * POST /admin/nodes/:id/restore - Restore soft-deleted node
 */
adminNodesRouter.post('/:id/restore', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check if node exists and is deleted
        const existingNode = await db.query.nodes.findFirst({
            where: eq(nodes.id, id)
        });

        if (!existingNode || !existingNode.isDeleted) {
            return res.status(404).json({
                status: 'error',
                error: 'Node not found or already restored'
            });
        }

        // Restore node (mark as active again)
        await db.update(nodes)
            .set({
                isDeleted: false,
                updatedAt: new Date(),
            })
            .where(eq(nodes.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Node restored successfully`,
            data: {
                id,
                status: 'restored'
            },
        });

    } catch (error) {
        console.error("Error restoring node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to restore node'
        });
    }
});
