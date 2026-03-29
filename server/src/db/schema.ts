import {type AnySQLiteColumn, index, integer, real, sqliteTable, text, uniqueIndex} from "drizzle-orm/sqlite-core";


export const adventures = sqliteTable('adventures', {
        id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
        title: text('title').notNull(),
        description: text('description').notNull(),
        startNodeId: integer('start_node_id').notNull(),
        isDeleted: integer({ mode: 'boolean' }).default(false),
    }
);

// Junction table: Adventure -> Start Nodes (1:M)
export const adventureStartNodes = sqliteTable('adventure_start_nodes', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    adventureId: integer('adventure_id')
        .notNull()
        .references(() => adventures.id),
    nodeId: integer('node_id')
        .notNull()
        .references(() => nodes.id),
    isDefaultStart: integer({ mode: 'boolean' }).default(true).notNull(), // ✅ enables future "multiple starts"
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const nodes = sqliteTable('nodes', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    node_text: text('node_text').notNull(),
    scoreMultiplier: real('score_multiplier').default(1),
    endingTitle: text('ending_title'),
    isFinalOutcome: integer({ mode: 'boolean' }).notNull().default(false),
    isDeleted: integer({ mode: 'boolean' }).default(false),
});

export const choices = sqliteTable('choices', {
    id: integer('id', { mode: 'number' }).primaryKey({autoIncrement: true}),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    nodeId: integer('node_id').notNull().references(() => nodes.id),
    nextNodeId: integer('next_node_id').notNull().references(() => nodes.id),
    choice_label: text('choice_label').notNull(),
    choice_text: text('choice_text').notNull(),
    scoreWeight: integer('score_weight').notNull().default(0),
    orderIndex: integer("order_index").notNull().default(0),
    isDeleted: integer({ mode: 'boolean' }).default(false),

}, (table) => [
    index("idx_choices_node").on(table.nodeId),
    index("idx_choices_adventure_node").on(table.adventureId, table.nodeId),

    uniqueIndex("uniq_choices_source_target").on(table.nodeId, table.nextNodeId),
])

export const leaderboard = sqliteTable('leaderboard', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    playerName: text('player_name').notNull(),
    adventureId: integer('adventure_id').notNull().references(() => adventures.id),
    score: integer('score').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    isDeleted: integer({ mode: 'boolean' }).default(false),
}, (table) => [
    index("idx_leaderboard_adventure").on(table.adventureId),
])