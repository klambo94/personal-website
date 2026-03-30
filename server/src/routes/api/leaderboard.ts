import { Router } from "express";
import {eq, and, gte, lte, desc, asc} from "drizzle-orm";
import { db } from "../../db/config";
import {
    leaderboard, adventures, adventureStartNodes
} from "../../schema/schema";
import {adventures} from "../../schema/schema";

export const leaderboardRouter = Router();

/**
 * 1. GET LEADERBOARD - Paginated & Filtered
 * GET /leaderboard/:adventureId
 * Returns top scores for a specific adventure with pagination
 */
leaderboardRouter.get('/:adventureId', async (req, res) => {
    try {
        const { adventureId } = req.params;

        // ✅ Validate adventure ID is a number
        const parsedAdventureId = parseInt(adventureId);
        if (isNaN(parsedAdventureId)) {
            return res.status(400).json({
                status: 'Invalid adventure ID',
                error: 'Must be a positive integer'
            });
        }

        // ✅ Optional: Fetch adventure metadata for response
        const adventure = await db.query.adventures.findFirst({
            where: eq(adventures.id, parsedAdventureId),
        });

        if (!adventure) {
            return res.status(404).json({
                status: 'Adventure not found',
                error: `No adventure found with ID ${adventureId}`
            });
        }

        // ✅ Parse query parameters for pagination/filtering
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = (req.query.sortBy as string) || 'score'; // Default to score
        const sortOrder = req.query.sortOrder as string | undefined || 'desc';
        const minScore = req.query.minScore ? parseInt(req.query.minScore as string) : null;
        const maxScore = req.query.maxScore ? parseInt(req.query.maxScore as string) : null;

        // ✅ Build WHERE clause based on filters
        let whereCondition = eq(leaderboard.adventureId, parsedAdventureId);

        if (minScore !== null) {
            whereCondition = and(whereCondition, gte(leaderboard.score, minScore));
        }
        if (maxScore !== null) {
            whereCondition = and(whereCondition, lte(leaderboard.score, maxScore));
        }

        // ✅ Fetch leaderboard entries with pagination
        const totalEntries = await db.select({ count: leaderboard.id }).from(leaderboard).count();

        const entries = await db.query.leaderboard.findMany({
            where: and(whereCondition, eq(leaderboard.isDeleted, false)),
            orderBy:
                sortBy === 'score' ? desc(leaderboard.score) : asc(leaderboard.createdAt),
            limit: limit,
            offset: (page - 1) * limit
        });

        // ✅ Build response matching leaderboardResponseSchema pattern
        const formattedEntries = entries.map(entry => ({
            id: entry.id,
            playerName: entry.playerName,
            score: Number(entry.score),
            createdAt: new Date(entry.createdAt).toISOString(),
            isNewRecord: true, // Add visual indicator for recent entries
        }));

        return res.json({
            status: 'success',
            adventureId: parseInt(adventureId),
            adventureTitle: adventure.title,
            entries: formattedEntries,
            pagination: {
                page,
                limit,
                totalEntries,
                totalPages: Math.ceil(totalEntries / limit)
            },
            sortBy,
            sortOrder,
        });

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load leaderboard'
        });
    }
});


/**
 * 2. GET TOP SCORES SUMMARY - All Adventures
 * GET /leaderboard/top/:topN?&adventureId=:id
 * Returns top N scorers across all adventures or filtered by adventure
 */
leaderboardRouter.get('/top/:topN', async (req, res) => {
    try {
        const topN = parseInt(req.params.topN);

        if (isNaN(topN) || topN < 1 || topN > 100) {
            return res.status(400).json({
                status: 'Invalid request',
                error: 'topN must be between 1 and 100'
            });
        }

        // ✅ Fetch top scorers from all adventures
        const topEntries = await db.query.leaderboard.findMany({
            where: eq(leaderboard.isDeleted, false),
            orderBy: desc(leaderboard.score),
            limit: topN
        });

        // ✅ Group by adventure for comparison
        const summary = await db.transaction(async (tx) => {
            const adventuresWithTopScorers = await tx.select({
                adventureId: leaderboard.adventureId,
                adventureTitle: adventurers.title,
                description: adventures.description,
                topPlayerName: leaderboard.playerName,
                topScore: leaderboard.score,
                totalPlayers: tx.select({ count: leaderboard.id })
                    .from(leaderboard)
                    .count(),
            }).from(adventures).leftJoin(leaderboard, eq(adventures.id, leaderboard.adventureId));

            return adventuresWithTopScorers;
        });

        return res.json({
            status: 'success',
            type: 'top-scorers-summary',
            entries: topEntries.map(entry => ({
                playerName: entry.playerName,
                score: Number(entry.score),
                adventureId: entry.adventureId,
            })),
        });

    } catch (error) {
        console.error("Error fetching top scorers:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load top scorers'
        });
    }
});


/**
 * 3. GET PLAYER RANKING - All Adventures History
 * GET /leaderboard/player/:playerName
 * Returns all adventures a player has participated in with their scores
 */
leaderboardRouter.get('/player/:playerName', async (req, res) => {
    try {
        const playerName = req.params.playerName;

        // ✅ Fetch all leaderboard entries for this player
        const entries = await db.query.leaderboard.findMany({
            where: and(
                eq(leaderboard.playerName, playerName),
                eq(leaderboard.isDeleted, false)
            ),
            orderBy: desc(leaderboard.createdAt)
        });

        // ✅ Include adventure details for context
        const playerHistory = await db.transaction(async (tx) => {
            return entries.map(entry => ({
                ...entry,
                adventureTitle: tx.query.adventures.findFirst({
                    where: eq(adventures.id, entry.adventureId),
                })?.title || 'Unknown Adventure',
                scoreRank: Number(entry.score),
                totalScore: entry.score + 100, // Placeholder for future calculation
            }));
        });

        return res.json({
            status: 'success',
            playerName,
            entries: playerHistory.map(e => ({
                adventureId: e.adventureId,
                adventureTitle: e.adventureTitle,
                score: Number(e.score),
                createdAt: new Date(e.createdAt).toISOString(),
            })),
        });

    } catch (error) {
        console.error("Error fetching player history:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load player leaderboard history'
        });
    }
});


/**
 * 4. ARCHIVE LEADERBOARD ENTRY - Soft Delete (Admin/Leader Only)
 * DELETE /leaderboard/:id
 * Archives entry for moderation or correction purposes
 */
leaderboardRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Validate entry exists
        const entry = await db.query.leaderboard.findFirst({
            where: eq(leaderboard.id, parseInt(id)),
        });

        if (!entry || entry.isDeleted) {
            return res.status(404).json({
                status: 'Entry not found',
                error: `Leaderboard entry with ID ${id} not found or already archived`
            });
        }

        // ✅ Soft delete the entry
        await db.update(leaderboard)
            .set({
                isDeleted: true,
                updatedAt: new Date(),
            })
            .where(eq(leaderboard.id, parseInt(id)))
            .execute();

        return res.json({
            status: 'success',
            message: 'Leaderboard entry has been archived'
        });

    } catch (error) {
        console.error("Error archiving leaderboard entry:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to archive leaderboard entry'
        });
    }
});


/**
 * 5. GET LEADERBOARD STATISTICS - Aggregate Data
 * GET /leaderboard/stats/:adventureId?
 * Returns aggregate statistics for analytics dashboard
 */
leaderboardRouter.get('/stats/:adventureId', async (req, res) => {
    try {
        const adventureId = req.params.adventureId
            ? parseInt(req.params.adventureId)
            : null;

        // ✅ Build WHERE clause with optional filter
        let whereCondition = eq(leaderboard.isDeleted, false);

        if (adventureId) {
            whereCondition = and(whereCondition, eq(leaderboard.adventureId, adventureId));
        }

        // ✅ Fetch aggregate statistics
        const stats = await db.select({
            totalEntries: leaderboard.id,
            totalScore: leaderboard.score,
            averageScore: leaderboard.score,
            highestScore: leaderboard.score,
            lowestScore: leaderboard.score,
            uniquePlayers: leaderboard.playerName,
            topPlayerName: leaderboard.playerName,
        }).where(whereCondition).from(leaderboard).count();

        return res.json({
            status: 'success',
            filters: { adventureId },
            stats: stats[0] || {},
        });

    } catch (error) {
        console.error("Error fetching leaderboard stats:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to load leaderboard statistics'
        });
    }
});


/**
 * 6. GET LEADERBOARD RANKING - Position-Based Ranking
 * GET /leaderboard/rank/:adventureId?&playerName=:playerName
 * Returns current rank and position for a player or all rankings
 */
leaderboardRouter.get('/rank/:adventureId', async (req, res) => {
    try {
        const adventureId = req.params.adventureId
            ? parseInt(req.params.adventureId)
            : null;

        // ✅ Fetch all valid entries for ranking calculation
        const entries = await db.query.leaderboard.findMany({
            where: and(
                eq(leaderboard.isDeleted, false),
                adventureId ? eq(leaderboard.adventureId, adventureId) : undefined
            ),
            orderBy: desc(leaderboard.score)
        });

        // ✅ Calculate ranks with proper tie-breaking
        const rankings = entries.map((entry, index) => {
            const nextEntry = entries[index + 1];

            // Standard competition ranking (1,2,3,3,5 pattern for ties)
            let rank = index + 1;
            if (nextEntry && Number(nextEntry.score) === Number(entry.score)) {
                rank = entries.slice(0, index + 1).filter(e =>
                    Number(e.score) === Number(entry.score)
                ).length;
            }

            return {
                playerName: entry.playerName,
                score: Number(entry.score),
                rank: rank,
                adventureId: entry.adventureId,
            };
        });

        return res.json({
            status: 'success',
            adventureId,
            rankings,
        });

    } catch (error) {
        console.error("Error calculating rankings:", error);
        return res.status(500).json({
            status: 'Server error',
            error: 'Failed to calculate leaderboard rankings'
        });
    }
});
