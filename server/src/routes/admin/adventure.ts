import { Router } from "express";
import { eq, asc, desc, and, gte } from "drizzle-orm";
import { adventureCreationSchema } from "../../../../lib/zodSchemas";
import { db } from "../../db/config";
import {adventurePlaythroughs, adventures, adventureStartNodes, nodes} from "../../schema/schema";

export const adminAdventuresRouter = Router();

/**
 * GET /admin/adventures - List all adventures with pagination
 */
adminAdventuresRouter.get('/', async (req: any, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        let whereCondition = eq(adventures.isDeleted, false);

        // Fetch paginated results with relations
        const adventuresList = await db.query.adventures.findMany({
            where: and(whereCondition, eq(adventures.isDeleted, false)),
            relations: {
                startNodes: true,
                playthroughs: true,
            },
            orderBy: [desc(adventures.id)],
        });

        // Fetch adventure titles with counts for display
        const adventureSummary = await db.select({
            id: adventures.id,
            title: adventures.title,
            description: adventures.description,
            startNodeId: adventures.startNodeId,
            nodeCount: nodes.id,
            playthroughCount: adventurers.adventureId,
        }).from(adventures)
            .leftJoin(nodes, eq(nodes.id, adventures.startNodeId))
            .leftJoin(adventures.playthroughs, eq(adventures.id, adventurePlaythroughs.adventureId))

        return res.json({
            status: 'success',
            data: adventuresList.map(a => ({
                id: a.id,
                title: a.title,
                description: a.description.substring(0, 100) + (a.description.length > 100 ? '...' : ''),
                startNodeId: a.startNodeId,
                isDeleted: Boolean(a.isDeleted),
                playthroughCount: adventureSummary.playthroughCount || 0,
                createdAt: new Date(a.createdAt).toISOString(),
            })),
            pagination: {
                page,
                limit,
                totalItems: adventuresList.length,
            },
        });

    } catch (error) {
        console.error("Error fetching admin adventures:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to load adventures'
        });
    }
});


/**
 * POST /admin/adventures - Create new adventure
 */
adminAdventuresRouter.post('/', async (req, res) => {
    try {
        // ✅ Validate with Zod
        const validation = adventureCreationSchema.safeParse(req.body);

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

        const { title, description, startNodeId } = validation.data;

        // ✅ Create new adventure
        const newAdventure = await db.insert(adventures).values({
            id: null, // Let auto-increment handle this
            title,
            description,
            startNodeId,
            createdAt: new Date(),
        }).returning();

        return res.status(201).json({
            status: 'success',
            message: `Adventure created successfully. ID: ${newAdventure.id}`,
            data: newAdventure[0],
        });

    } catch (error) {
        console.error("Error creating adventure:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to create adventure'
        });
    }
});


/**
 * PUT /admin/adventures/:id - Update adventure
 */
adminAdventuresRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Validate with Zod
        const validation = adventureCreationSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: 'error',
                error: 'Validation failed'
            });
        }

        const { title, description, startNodeId } = validation.data;

        // ✅ Check if adventure exists and isn't deleted
        const existingAdventure = await db.query.adventures.findFirst({
            where: and(
                eq(adventures.id, id),
                eq(adventures.isDeleted, false)
            )
        });

        if (!existingAdventure) {
            return res.status(404).json({
                status: 'error',
                error: 'Adventure not found or already deleted'
            });
        }

        // ✅ Update adventure
        const updatedAdventure = await db.update(adventures)
            .set({
                title,
                description,
                startNodeId,
                updatedAt: new Date(),
            })
            .where(eq(adventures.id, id))
            .returning();

        return res.json({
            status: 'success',
            message: `Adventure updated successfully`,
            data: updatedAdventure[0],
        });

    } catch (error) {
        console.error("Error updating adventure:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to update adventure'
        });
    }
});


/**
 * DELETE /admin/adventures/:id - Soft delete adventure
 */
adminAdventuresRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Check if adventure exists and isn't already deleted
        const existingAdventure = await db.query.adventures.findFirst({
            where: eq(adventures.id, id)
        });

        if (!existingAdventure) {
            return res.status(404).json({
                status: 'error',
                error: 'Adventure not found'
            });
        }

        // ✅ Soft delete (mark as deleted instead of hard delete)
        await db.update(adventures)
            .set({
                isDeleted: true,
                updatedAt: new Date(),
            })
            .where(eq(adventures.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Adventure soft-deleted successfully`,
            data: {
                id,
                status: 'deleted'
            },
        });

    } catch (error) {
        console.error("Error deleting adventure:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to delete adventure'
        });
    }
});


/**
 * POST /admin/adventures/:id/restore - Restore soft-deleted adventure
 */
adminAdventuresRouter.post('/:id/restore', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Check if adventure exists and is deleted
        const existingAdventure = await db.query.adventures.findFirst({
            where: eq(adventures.id, id)
        });

        if (!existingAdventure || !existingAdventure.isDeleted) {
            return res.status(404).json({
                status: 'error',
                error: 'Adventure not found or already restored'
            });
        }

        // ✅ Restore adventure (mark as active again)
        await db.update(adventures)
            .set({
                isDeleted: false,
                updatedAt: new Date(),
            })
            .where(eq(adventures.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Adventure restored successfully`,
            data: {
                id,
                status: 'restored'
            },
        });

    } catch (error) {
        console.error("Error restoring adventure:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to restore adventure'
        });
    }
});


/**
 * POST /admin/adventures/:id/clear-playthroughs - Clear all playthroughs for adventure (reset)
 */
adminAdventuresRouter.post('/:id/clear-playthroughs', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Check if adventure exists
        const existingAdventure = await db.query.adventures.findFirst({
            where: eq(adventures.id, id)
        });

        if (!existingAdventure) {
            return res.status(404).json({
                status: 'error',
                error: 'Adventure not found'
            });
        }

        // ✅ Soft delete all playthroughs for this adventure (instead of hard delete to preserve history)
        const deletedCount = await db.update(adventurePlaythroughs)
            .set({
                isCompleted: true,
                completionTimestamp: new Date().toISOString(),
            })
            .where(eq(adventurePlaythroughs.adventureId, id))
            .execute();

        return res.json({
            status: 'success',
            message: `All playthroughs for adventure ${id} archived`,
            data: {
                adventureId: id,
                archivedCount: deletedCount[0].changed,
            },
        });

    } catch (error) {
        console.error("Error clearing playthroughs:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to clear playthroughs'
        });
    }
});


/**
 * POST /admin/adventures/:id/remove-start-node - Change adventure start node
 */
adminAdventuresRouter.post('/:id/change-start-node', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const newStartNodeId = parseInt(req.body.startNodeId);

        // ✅ Check if adventure exists and is active
        const existingAdventure = await db.query.adventures.findFirst({
            where: and(
                eq(adventures.id, id),
                eq(adventures.isDeleted, false)
            )
        });

        if (!existingAdventure) {
            return res.status(404).json({
                status: 'error',
                error: 'Adventure not found'
            });
        }

        // ✅ Check if new start node exists and is valid
        const existingNewNode = await db.query.nodes.findFirst({
            where: and(
                eq(nodes.id, newStartNodeId),
                eq(nodes.isDeleted, false)
            )
        });

        if (!existingNewNode) {
            return res.status(404).json({
                status: 'error',
                error: `New start node (ID: ${newStartNodeId}) not found`
            });
        }

        // ✅ Check if new start node already used as default for this adventure
        const existingDefaultStart = await db.query.adventureStartNodes.findFirst({
            where: and(
                eq(adventureStartNodes.adventureId, id),
                eq(adventureStartNodes.isDefaultStart, true)
            )
        });

        // ✅ Update adventure start node
        const updatedAdventure = await db.update(adventures)
            .set({
                startNodeId: newStartNodeId,
                updatedAt: new Date(),
            })
            .where(eq(adventures.id, id))
            .returning();

        return res.json({
            status: 'success',
            message: `Adventure ${id} updated with new start node`,
            data: {
                adventureId: id,
                oldStartNodeId: existingAdventure.startNodeId,
                newStartNodeId: newStartNodeId,
            },
        });

    } catch (error) {
        console.error("Error changing adventure start node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to change adventure start node'
        });
    }
});
