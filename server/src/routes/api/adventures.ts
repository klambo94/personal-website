import {playerCreationSchema} from "../../../../lib/zodSchemas";
import { db } from "../../db/config";
import {adventurePlaythroughs, leaderboard, nodes, players} from "../../schema/schema";
import {and, asc, eq} from "drizzle-orm";
import {Router} from "express";
import {coreRelations} from "../../schema/relations";
import {GetNodeResponse} from "../../../../lib/apiTypes";

export const adventuresRouter = Router();

/**
 * 1. START ADVENTURE (Create Playthrough Session)
 * POST /adventures/:id/start
 * Starts a new adventure session for a player or loads existing one
 */
adventuresRouter.post('/:adventureId/start', async (req, res) => {
    try {
        const {adventureId} = req.params;

        const validation = playerCreationSchema.safeParse(req.body);
        if (!validation) {
            return res.status(400).json({
                status: 'Validation failed',
                error: validation.error.errors.map(e => ({
                    field: e.path.join("."),
                    message: e.message
                }))
            })
        }

        const {playerName, displayName, race, class: classType} = validation.data;

        let player = await db.insert(players).values({
            playerName,
            displayName: displayName || playerName,
            race,
            class: classType,
            xpLevel: 1,
            createdAt: new Date(),
        }).returning();

        const startDate = new Date().toISOString();

        let playthrough = await db.insert(adventurePlaythroughs).values({
            playerId: player.id,
            adventureId: parseInt(adventureId),
            currentNodeId: null, // Will be set after fetching start node
            totalScore: 0,
            isCompleted: false,
            choicesMade: 0,
            scoreMultiplier: 1,
            currentInventory: '[]', // JSON array string
            currentSpellsKnown: 0,
            createdAt: new Date(),
        }).returning();

        let startNode = await db.query.adventureStartNodes.findFirst({
            where: {
                adventureId: adventureId,
                isDefaultStart: true,
            }
        });

        if (!startNode?.nodeId) {
            return res.status(404).json({
                status: 'No valid start node configured',
                adventureId: parseInt(adventureId)
            });
        }

        // ✅ Update playthrough to point to start node
        await db.update(adventurePlaythroughs)
            .set({currentNodeId: startNode.nodeId})
            .where(eq(adventurePlaythroughs.id, playthrough.id))
            .execute();

        // ✅ Return game state for frontend
        return res.json({
            status: 'success',
            message: `Adventure session created! Welcome ${displayName || playerName}!`,
            adventureId: parseInt(adventureId),
            player: {
                id: player.id,
                name: player.playerName,
                displayName: player.displayName,
                race: player.race,
                class: player.class,
                xpLevel: player.xpLevel
            },
            playthrough: {
                id: playthrough.id,
                currentNodeId: playthrough.currentNodeId!,
                totalScore: 0,
                isCompleted: false
            },
            startNode: {
                id: startNode.nodeId
            }
        });

    } catch (error) {
        console.error("Error creating adventure session:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to start adventure session'
        });
    }
});


/**
 * 2. GET CURRENT PLAYTHROUGH STATE + NODE CHOICES
 * GET /adventures/:id/playthroughs/current
 * Returns current player state and available choices at current node
 */
adventuresRouter.get('/playthroughs/current', async (req, res) => {
    try {
        const { playerId } = req.query;

        if (!playerId || typeof playerId !== 'string') {
            return res.status(400).json({ status: 'Player ID required' });
        }

        // ✅ Fetch playthrough for player (active session only)
        const playthrough = await db.query.adventurePlaythroughs.findFirst({
            where: and(
                eq(adventurePlaythroughs.playerId, parseInt(playerId)),
                eq(adventurePlaythroughs.isCompleted, false)
            ),
            with: {
                currentNode: {
                    relations: coreRelations,
                    orderBy: [asc(nodes.id)],
                }
            }
        });

        if (!playthrough || !playthrough.currentNode) {
            return res.status(404).json({
                status: 'No active adventure session found'
            });
        }

        // ✅ Build response matching existing type definitions
        const nodeResponse: GetNodeResponse = {
            node: {
                id: playthrough.currentNode.id.toString(),
                text: playthrough.currentNode.nodeText!,
                isFinalOutcome: Boolean(playthrough.currentNode.isFinalOutcome),
                endingTitle: playthrough.currentNode.endingTitle,
            },
            choices: playthrough.currentNode.choices.map(c => ({
                id: c.nextNodeId.toString(),
                label: c.choiceLabel!,
                text: c.choiceText!,
                weight: Number(c.scoreWeight!),
            })),
        };

        return res.json({
            status: 'success',
            player: {
                id: playthrough.playerId,
                name: playthrough.players.playerName,
                race: playthrough.players.race,
                class: playthrough.players.class,
                xpLevel: playthrough.players.xpLevel,
            },
            adventure: {
                id: playthrough.adventureId,
                title: await db.query.adventures.findFirst({
                    where: eq(adventures.id, playthrough.adventureId),
                })?.title,
            },
            playthrough: nodeResponse,
        });

    } catch (error) {
        console.error("Error fetching current playthrough:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load current game state'
        });
    }
});


/**
 * 3. GET NODE (For Frontend - Same as Before)
 * GET /adventures/:id/playthroughs/current/node
 */
adventuresRouter.get('/playthroughs/current/node', async (req, res) => {
    try {
        // Reuse same logic as before for consistency
        const { playerId } = req.query;

        if (!playerId || typeof playerId !== 'string') {
            return res.status(400).json({ status: 'Player ID required' });
        }

        const playthrough = await db.query.adventurePlaythroughs.findFirst({
            where: and(
                eq(adventurePlaythroughs.playerId, parseInt(playerId)),
                eq(adventurePlaythroughs.isCompleted, false)
            ),
            with: {
                currentNode: {
                    relations: coreRelations,
                    orderBy: [asc(nodes.id)],
                }
            }
        });

        if (!playthrough || !playthrough.currentNode) {
            return res.status(404).json({
                status: 'No active adventure session found'
            });
        }

        // ✅ Map choices for frontend (same pattern as before)
        const response = {
            node: {
                id: playthrough.currentNode.id.toString(),
                text: playthrough.currentNode.nodeText!,
                isFinalOutcome: Boolean(playthrough.currentNode.isFinalOutcome),
                endingTitle: playthrough.currentNode.endingTitle,
            },
            choices: playthrough.currentNode.choices.map(c => ({
                id: c.nextNodeId.toString(),
                label: c.choiceLabel!,
                text: c.choiceText!,
                weight: Number(c.scoreWeight!),
            })),
        };

        return res.json({ response });

    } catch (error) {
        console.error("Error fetching node:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load node'
        });
    }
});


/**
 * 4. SELECT CHOICE AND ADVANCE GAME STATE
 * POST /adventures/:id/playthroughs/select-choice
 * Handles choice selection, score calculation, and state transition
 */
adventuresRouter.post('/playthroughs/select-choice', async (req, res) => {
    try {
        const { playerId, adventureId, currentNodeId } = req.body;

        // ✅ Validate with Zod-like structure
        if (!playerId || !adventureId || !currentNodeId) {
            return res.status(400).json({
                status: 'Invalid request',
                error: 'playerId, adventureId, and currentNodeId required'
            });
        }

        // ✅ Fetch playthrough state
        const playthrough = await db.query.adventurePlaythroughs.findFirst({
            where: and(
                eq(adventurePlaythroughs.playerId, parseInt(playerId)),
                eq(adventurePlaythroughs.adventureId, parseInt(adventureId)),
                eq(adventurePlaythroughs.currentNodeId, currentNodeId)
            ),
            with: {
                choices: coreRelations.choices,
            }
        });

        if (!playthrough || !playthrough.choices) {
            return res.status(404).json({
                status: 'Current adventure state not found or invalid'
            });
        }

        // ✅ Get chosen choice (simplified - in production, validate against choiceId)
        const choiceId = req.body.choiceId || playthrough.choices[0].nextNodeId.toString();

        const selectedChoice = playthrough.choices.find(c => c.nextNodeId.toString() === choiceId);

        if (!selectedChoice) {
            return res.status(400).json({
                status: 'Invalid choice',
                error: `No valid choice found for node ${currentNodeId}`
            });
        }

        // ✅ Calculate updated score
        let updatedScore = 0;

        if (playthrough.currentNode.isFinalOutcome) {
            updatedScore = Number(selectedChoice.scoreWeight!) * Number(playthrough.totalScore);
        } else {
            updatedScore = Number(playthrough.totalScore) + Number(selectedChoice.scoreWeight!);
        }

        // ✅ Fetch next node if not final outcome
        let nextNodeData: any;

        const isFinalOutcome = playthrough.currentNode.isFinalOutcome;

        if (!isFinalOutcome) {
            const nextNodeId = selectedChoice.nextNodeId;

            nextNodeData = await db.query.nodes.findFirst({
                where: and(
                    eq(nodes.id, nextNodeId),
                    eq(nodes.isDeleted, false)
                ),
                with: {
                    choices: coreRelations.choices,
                    orderBy: [asc(nodes.id)],
                }
            });

            if (!nextNodeData) {
                return res.status(404).json({
                    status: 'Next node not found',
                    error: `Valid transition from node ${currentNodeId} to ${nextNodeId} failed`
                });
            }
        }

        // ✅ Update playthrough with new state (using upsert pattern)
        await db.update(adventurePlaythroughs)
            .set({
                currentNodeId: isFinalOutcome ? null : nextNodeId,
                totalScore: updatedScore,
                choicesMade: playthrough.choicesMade + 1,
                updatedAt: new Date(),
            })
            .where(eq(adventurePlaythroughs.id, playthrough.id))
            .execute();

        // ✅ Build response for frontend
        const response: SelectChoiceResponse = {
            updatedScore: updatedScore,
        };

        if (!isFinalOutcome) {
            response.nextNode = {
                id: nextNodeData.id.toString(),
                text: nextNodeData.nodeText!,
                isFinalOutcome: Boolean(nextNodeData.isFinalOutcome),
                endingTitle: nextNodeData.endingTitle,
                choices: nextNodeData.choices.map(c => ({
                    id: c.nextNodeId!.toString(),
                    label: c.choiceLabel!,
                    text: c.choiceText!,
                    weight: Number(c.scoreWeight!),
                })),
            };
        }

        return res.json(response);

    } catch (error) {
        console.error("Error processing choice:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to process choice'
        });
    }
});


/**
 * 5. COMPLETE ADVENTURE (End Game)
 * POST /adventures/:id/playthroughs/complete
 */
adventuresRouter.post('/playthroughs/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Mark playthrough as completed
        await db.update(adventurePlaythroughs)
            .set({
                isCompleted: true,
                completionTimestamp: new Date().toISOString(),
            })
            .where(eq(adventurePlaythroughs.id, parseInt(id)))
            .execute();

        // ✅ Create leaderboard entry (optional - depends on your design)
        const playthrough = await db.query.adventurePlaythroughs.findFirst({
            where: eq(adventurePlaythroughs.id, parseInt(id)),
        });

        if (!playthrough) {
            return res.status(404).json({
                status: 'Adventure not found'
            });
        }

        // Create leaderboard entry for the player's score
        await db.insert(leaderboard).values({
            id: parseInt((playthrough.playerId + playthrough.adventureId).toString()),
            playerName: playthrough.players.playerName,
            adventureId: playthrough.adventureId,
            score: playthrough.totalScore,
            createdAt: new Date(),
        });

        return res.json({
            status: 'success',
            message: `Adventure completed! Final score: ${playthrough.totalScore}`,
            finalScore: playthrough.totalScore,
        });

    } catch (error) {
        console.error("Error completing adventure:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to complete adventure'
        });
    }
});


/**
 * 6. RESET ADVENTURE (Soft Delete Playthrough)
 * DELETE /adventures/:id/playthroughs/complete/:playthroughId
 */
adventuresRouter.delete('/playthroughs/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Soft delete the playthrough
        await db.update(adventurePlaythroughs)
            .set({
                isCompleted: true,
                completionTimestamp: new Date().toISOString(),
            })
            .where(eq(adventurePlaythroughs.id, parseInt(id)))
            .execute();

        return res.json({
            status: 'success',
            message: 'Adventure playthrough has been archived'
        });

    } catch (error) {
        console.error("Error deleting adventure:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to delete adventure'
        });
    }
});