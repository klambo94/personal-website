// @/schema.ts
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { defineRelations } from "drizzle-orm";

// === CORE ADVENTURE TABLES (Your Original Schema) ===

export const adventures = sqliteTable('adventures', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    startNodeId: integer('start_node_id').notNull(),
    isDeleted: integer({ mode: 'boolean' }).default(false),
});

export const adventureStartNodes = sqliteTable('adventure_start_nodes', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    nodeId: integer('node_id').notNull().references(() => nodes.id),
    isDefaultStart: integer({ mode: 'boolean' }).default(true).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const nodes = sqliteTable('nodes', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    nodeText: text('node_text').notNull(),
    scoreMultiplier: real('score_multiplier').default(1),
    endingTitle: text('ending_title'),
    isFinalOutcome: integer({ mode: 'boolean' }).notNull().default(false),
    isDeleted: integer({ mode: 'boolean' }).default(false),
});

export const choices = sqliteTable('choices', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    nodeId: integer('node_id').notNull().references(() => nodes.id),
    nextNodeId: integer('next_node_id').notNull().references(() => nodes.id),
    choiceLabel: text('choice_label').notNull(),
    choiceText: text('choice_text').notNull(),
    scoreWeight: integer('score_weight').notNull().default(0),
    orderBy: integer("order_index").notNull().default(0),
    isDeleted: integer({ mode: 'boolean' }).default(false),
}, (table) => [
    index("idx_choices_node").on(table.nodeId),
    index("idx_choices_adventure_node").on(table.adventureId, table.nodeId),
    uniqueIndex("uniq_choices_source_target").on(table.nodeId, table.nextNodeId),
]);

export const leaderboard = sqliteTable('leaderboard', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    playerName: text('player_name').notNull(),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    score: integer('score').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }),
    isDeleted: integer({ mode: 'boolean' }).default(false),
}, (table) => [
    index("idx_leaderboard_adventure").on(table.adventureId),
]);

// === NEW TABLES: Master Reference Data ===

export const spells = sqliteTable('spells', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    spellName: text('spell_name').notNull(),
    school: text('school'),
    level: integer('level').default(1),
    description: text('description').notNull(),
    castingTime: text('casting_time').default('1 action'),
    duration: text('duration'),
    range: text('range'),
    components: text('components'), // TEXT JSON string for SQLite
});

export const inventoryItems = sqliteTable('inventory_items', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    itemName: text('item_name').notNull(),
    itemCategory: text('item_category').notNull(),
    rarity: text('rarity').default('common'),
    description: text('description').notNull(),
    stats: text('stats'), // TEXT JSON string or null
    maxStackCount: integer('max_stack_count').default(99),
    weight: real('weight').default(0).notNull(),
    equipable: integer({ mode: 'boolean' }).default(false).notNull(),
    isDropItem: integer({ mode: 'boolean' }).default(true).notNull(),
});

export const lootTables = sqliteTable('loot_tables', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    inventoryItemId: integer('inventory_item_id').references(()=> inventoryItems.id, {onDelete: 'set null'}),
    nodeId: integer('node_id').notNull().references(() => nodes.id),
    itemId: text('item_id').notNull(),
    spawnChance: integer('spawn_chance').default(1).notNull(),
}, (table) => [
    index("idx_loot_node").on(table.nodeId),
]);

// === NEW TABLES: Persistent Player Build & Sessions ===

export const players = sqliteTable('players', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    playerName: text('player_name').notNull(),
    displayName: text('display_name'),
    race: text('race').default('Human'),
    class: text('class').default('Warrior'),
    subclass: text('subclass'),
    abilityScores: text('ability_scores'), // TEXT JSON string for SQLite
    xpLevel: integer('xp_level').default(1),
    background: text('background'),
    createdAt: integer('created_at', { mode: 'timestamp' }),
    isDeleted: integer({ mode: 'boolean' }).default(false),
}, (table) => [
    uniqueIndex("uniq_player_name").on(table.playerName),
]);

export const playerSpells = sqliteTable('player_spells', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    playerId: integer('player_id').notNull().references(() => players.id, {onDelete: 'cascade'}),
    spellId: integer('spell_id').notNull().references(() => spells.id, { onDelete: 'set null'}),

    isKnown: integer({ mode: 'boolean' }).default(false).notNull(),
    slotLevel: integer('slot_level').default(3),
    createdAt: integer('created_at', { mode: 'timestamp' }),
}, (table) => [
    uniqueIndex("uniq_player_spell").on(table.playerId, table.spellId),
]);

// === SESSION TRACKING TABLES ===

export const adventurePlaythroughs = sqliteTable('adventure_playthroughs', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    playerId: integer('player_id').notNull().references(() => players.id, {onDelete: 'cascade'}),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id, {onDelete: 'cascade'}),
    currentNodeId: integer('current_node_id'),
    totalScore: integer('total_score').default(0),
    isCompleted: integer({ mode: 'boolean' }).default(false),
    completionTimestamp: integer('completion_timestamp', { mode: 'timestamp' }),
    choicesMade: integer('choices_made').default(0),
    scoreMultiplier: real('score_multiplier').default(1),
    currentInventory: text('current_inventory'), // TEXT JSON string or null
    currentSpellsKnown: integer('current_spells_known', { mode: 'number' }).default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }),
}, (table) => [
    index("idx_playthrough_player").on(table.playerId),
    uniqueIndex("uniq_player_adventure").on(table.playerId, table.adventureId),
]);

// === EXPORT HELPER TYPES ===

export type Adventure = typeof adventures.$inferSelect;
export type Spell = typeof spells.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type Player = typeof players.$inferSelect;
