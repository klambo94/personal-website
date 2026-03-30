import type {InferInsertModel, InferSelectModel} from "drizzle-orm";
import * as schema from "./schema.js"
import {inventoryItems, players, spells} from "./schema.js";

export type Adventure = InferSelectModel<typeof schema.adventures>
export type NewAdventure = InferInsertModel<typeof schema.adventures>

export type Node = InferSelectModel<typeof schema.nodes>
export type NewNode = InferInsertModel<typeof schema.nodes>

export type Choice = InferSelectModel<typeof schema.choices>
export type NewChoice = InferInsertModel<typeof schema.choices>

export type Leaderboard = InferSelectModel<typeof schema.leaderboard>
export type NewLeaderboardPlayer = InferInsertModel<typeof schema.leaderboard>

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type Spell = typeof spells.$inferSelect;
export type Player = typeof players.$inferSelect;

