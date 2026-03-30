import { z } from 'zod';

/**
 * Ability Score Schema
 */
export const abilityScoresSchema = z.object({
    strength: z.number().min(1).max(20),
    dexterity: z.number().min(1).max(20),
    constitution: z.number().min(1).max(20),
    intelligence: z.number().min(1).max(20),
    wisdom: z.number().min(1).max(20),
    charisma: z.number().min(1).max(20),
});

/**
 * Player Creation Schema
 */
export const playerCreationSchema = z.object({
    playerName: z.string().min(2).max(50),
    displayName: z.string().optional(),
    race: z.enum(['Human', 'Elf', 'Dwarf', 'Halfling', 'Orc']),
    class: z.enum(['Warrior', 'Wizard', 'Rogue', 'Paladin', 'Bard']),
    subclass: z.string().nullish(), // Optional subclass (e.g., "Fireball Wizard")
});

/**
 * Adventure Creation Schema
 */
export const adventureCreationSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(1000),
    startNodeId: z.number().int().positive(),
});

/**
 * Node Creation/Update Schema
 */
export const nodeSchema = z.object({
    nodeText: z.string().min(1).max(500),
    scoreMultiplier: z.number().positive().default(1),
    endingTitle: z.string().optional(),
    isFinalOutcome: z.boolean().default(false),
});

/**
 * Choice Schema
 */
export const choiceSchema = z.object({
    adventureId: z.number().int().positive(),
    nodeId: z.number().int().positive(),
    nextNodeId: z.number().int().positive(),
    choiceLabel: z.string().min(1).max(50),
    choiceText: z.string().min(1).max(300),
    scoreWeight: z.number().nonnegative(),
    orderBy: z.number().default(0),
});

/**
 * Spell Schema (Master Data)
 */
export const spellSchema = z.object({
    spellName: z.string().max(100),
    school: z.string().nullish(),
    level: z.number().int().min(1).max(9).default(1),
    description: z.string().min(1),
    castingTime: z.string().default('1 action'),
    duration: z.string().nullish(),
});

/**
 * Inventory Item Schema (Master Data)
 */
export const inventoryItemSchema = z.object({
    itemName: z.string().max(200),
    itemCategory: z.enum(['weapon', 'armor', 'consumable', 'misc']),
    rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).default('common'),
    description: z.string().min(1).max(500),
    maxStackCount: z.number().int().min(1).max(999).default(99),
    weight: z.number().min(0),
    equipable: z.boolean(),
});

/**
 * Leaderboard Entry Schema
 */
export const leaderboardEntrySchema = z.object({
    playerName: z.string().min(2).max(50),
    score: z.number().int().positive(),
});

/**
 * Game Result Schema (Client Response)
 */
export const gameResultSchema = z.object({
    success: z.boolean(),
    nextNodeId: z.number().nullish(),
    nodeText: z.string().optional(),
    endingTitle: z.string().nullish(),
    scoreChangedBy: z.number(),
    isNewEnding: z.boolean(),
    isGameEnded: z.boolean(),
});

/**
 * Leaderboard Response Schema (Paginated/Filtered)
 */
export const leaderboardResponseSchema = z.object({
    adventureId: z.number().int().positive(),
    title: z.string(),
    entries: z.array(leaderboardEntrySchema),
});

/**
 * Stats Overview Schema (Admin Dashboard)
 */
export const statsOverviewSchema = z.object({
    totalAdventures: z.number(),
    totalNodes: z.number(),
    totalChoices: z.number(),
    totalLeaderboardEntries: z.number(),
    totalPlayers: z.number(),
});

/**
 * Spell Response Schema (Master Data List)
 */
export const spellsResponseSchema = z.object({
    spells: z.array(spellSchema),
    totalSpells: z.number(),
});

/**
 * Inventory Item Response Schema (Master Data List)
 */
export const inventoryResponseSchema = z.object({
    items: z.array(inventoryItemSchema),
    totalItems: z.number(),
});
