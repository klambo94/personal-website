import { Router } from "express";

import { choiceSchema } from "../../../../lib/zodSchemas";
import { db } from "../../db/config";
import { coreRelations } from "../../schema/relations";
import { nodes, choices, adventureStartNodes, adventures } from "../../schema/schema";
import {and, asc, desc, eq } from "drizzle-orm";

export const adminChoicesRouter = Router();

/**
 * GET /admin/choices - List all choices with pagination/filtering
 */
adminChoicesRouter.get('/', async (req: any, res) => {
    try {
        // Parse query parameters for filtering
        const searchNode = (req.query.searchNode as string) || '';
        const searchAdventure = (req.query.searchAdventure as string) || '';

        let whereCondition = eq(choices.isDeleted, false);

        if (searchNode) {
            whereCondition = and(whereCondition,
                asc(choices.nodeId),
                desc(choices.id)
            );
        }

        // Fetch paginated results with relations
        const choicesList = await db.query.choices.findMany({
            where: and(whereCondition, eq(choices.isDeleted, false)),
            relations: {
                node: true,
                adventure: true,
            },
            orderBy: [asc(choices.id)],
        });

        return res.json({
            status: 'success',
            data: choicesList.map(c => ({
                id: c.id,
                nodeId: Number(c.nodeId),
                adventureId: Number(c.adventureId),
                choiceLabel: c.choiceLabel,
                choiceText: c.choiceText,
                scoreWeight: Number(c.scoreWeight),
                orderBy: Number(c.orderBy),
                nextNodeId: Number(c.nextNodeId),
                isDeleted: Boolean(c.isDeleted),
                createdAt: new Date(c.createdAt).toISOString(),
            })),
        });

    } catch (error) {
        console.error("Error fetching admin choices:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to load choices'
        });
    }
});


/**
 * POST /admin/choices - Create new choice
 */
adminChoicesRouter.post('/', async (req, res) => {
    try {
        // ✅ Validate with Zod
        const validation = choiceSchema.safeParse(req.body);

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

        const { adventureId, nodeId, nextNodeId, choiceLabel, choiceText, scoreWeight = 0, orderBy = 0 } = validation.data;

        // ✅ Check if nextNodeId exists in the same adventure and isn't deleted
        const existingNextNode = await db.query.nodes.findFirst({
            where: and(
                eq(nodes.id, parseInt(nextNodeId)),
                eq(nodes.adventureId, adventureId),
                eq(nodes.isDeleted, false)
            )
        });

        if (!existingNextNode) {
            return res.status(400).json({
                status: 'error',
                error: `Target node (nextNodeId: ${nextNodeId}) not found or deleted`
            });
        }

        // ✅ Create new choice
        const newChoice = await db.insert(choices).values({
            adventureId: parseInt(adventureId),
            nodeId: parseInt(nodeId),
            nextNodeId: parseInt(nextNodeId),
            choiceLabel,
            choiceText,
            scoreWeight: Number(scoreWeight),
            orderBy: Number(orderBy),
            createdAt: new Date(),
        }).returning();

        return res.status(201).json({
            status: 'success',
            message: `Choice created successfully. ID: ${newChoice.id}`,
            data: newChoice[0],
        });

    } catch (error) {
        console.error("Error creating choice:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to create choice'
        });
    }
});


/**
 * PUT /admin/choices/:id - Update choice
 */
adminChoicesRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Validate with Zod
        const validation = choiceSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: 'error',
                error: 'Validation failed'
            });
        }

        const { adventureId, nodeId, nextNodeId, choiceLabel, choiceText, scoreWeight, orderBy } = validation.data;

        // ✅ Check if choice exists and isn't deleted
        const existingChoice = await db.query.choices.findFirst({
            where: and(
                eq(choices.id, id),
                eq(choices.isDeleted, false)
            )
        });

        if (!existingChoice) {
            return res.status(404).json({
                status: 'error',
                error: 'Choice not found or already deleted'
            });
        }

        // ✅ Update choice with validation of nextNodeId
        const existingNextNode = await db.query.nodes.findFirst({
            where: and(
                eq(nodes.id, parseInt(nextNodeId)),
                eq(nodes.isDeleted, false)
            )
        });

        if (!existingNextNode) {
            return res.status(400).json({
                status: 'error',
                error: `Target node (nextNodeId: ${nextNodeId}) not found`
            });
        }

        const updatedChoice = await db.update(choices)
            .set({
                adventureId: parseInt(adventureId),
                nodeId: parseInt(nodeId),
                nextNodeId: parseInt(nextNodeId),
                choiceLabel,
                choiceText,
                scoreWeight: Number(scoreWeight),
                orderBy: Number(orderBy),
                updatedAt: new Date(),
            })
            .where(eq(choices.id, id))
            .returning();

        return res.json({
            status: 'success',
            message: `Choice updated successfully`,
            data: updatedChoice[0],
        });

    } catch (error) {
        console.error("Error updating choice:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to update choice'
        });
    }
});


/**
 * DELETE /admin/choices/:id - Soft delete choice
 */
adminChoicesRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Check if choice exists and isn't already deleted
        const existingChoice = await db.query.choices.findFirst({
            where: eq(choices.id, id)
        });

        if (!existingChoice) {
            return res.status(404).json({
                status: 'error',
                error: 'Choice not found'
            });
        }

        // ✅ Soft delete (mark as deleted instead of hard delete)
        await db.update(choices)
            .set({
                isDeleted: true,
                updatedAt: new Date(),
            })
            .where(eq(choices.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Choice soft-deleted successfully`,
            data: {
                id,
                status: 'deleted'
            },
        });

    } catch (error) {
        console.error("Error deleting choice:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to delete choice'
        });
    }
});


/**
 * DELETE /admin/choices/:id/permanent - Hard delete choice (bypasses soft delete)
 */
adminChoicesRouter.delete('/:id/permanent', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // ✅ Check if choice exists
        const existingChoice = await db.query.choices.findFirst({
            where: eq(choices.id, id)
        });

        if (!existingChoice) {
            return res.status(404).json({
                status: 'error',
                error: 'Choice not found'
            });
        }

        // ✅ Hard delete (only for emergency cleanup)
        await db.delete(choices)
            .where(eq(choices.id, id))
            .execute();

        return res.json({
            status: 'success',
            message: `Choice permanently deleted`,
            data: {
                id,
                status: 'permanently_deleted'
            },
        });

    } catch (error) {
        console.error("Error permanently deleting choice:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to permanently delete choice'
        });
    }
});


/**
 * DELETE /admin/choices/by-node/:nodeId - Remove all choices for a specific node (mass delete)
 */
adminChoicesRouter.delete('/by-node/:nodeId', async (req, res) => {
    try {
        const nodeId = parseInt(req.params.nodeId);

        // ✅ Check if node exists and isn't deleted
        const existingNode = await db.query.nodes.findFirst({
            where: and(
                eq(nodes.id, nodeId),
                eq(nodes.isDeleted, false)
            )
        });

        if (!existingNode) {
            return res.status(404).json({
                status: 'error',
                error: `Node (ID: ${nodeId}) not found`
            });
        }

        // ✅ Delete all choices for this node
        const deletedCount = await db.delete(choices)
            .where(and(
                eq(choices.nodeId, nodeId),
                eq(choices.isDeleted, false)
            ))
            .execute();

        return res.json({
            status: 'success',
            message: `All choices for node ${nodeId} deleted`,
            data: {
                nodeId,
                deletedCount: deletedCount[0].changed,
            },
        });

    } catch (error) {
        console.error("Error deleting choices by node:", error);
        return res.status(500).json({
            status: 'error',
            error: 'Failed to delete choices by node'
        });
    }
});
