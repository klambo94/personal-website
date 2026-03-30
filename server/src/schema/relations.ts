// @/relations.ts
import { defineRelations } from "drizzle-orm";
import {
    adventures, adventureStartNodes, nodes, choices, leaderboard,
    spells, inventoryItems, lootTables, players, playerSpells, adventurePlaythroughs
} from "./schema.js";

// === 1. Adventure & Core Relations ===
export const coreRelations = defineRelations(
    { adventures, adventureStartNodes, nodes, choices, leaderboard, adventurePlaythroughs },
    (r) => ({
        adventures: {
            startNodes: r.many.adventureStartNodes({
                from: r.adventures.startNodeId,
                to: r.adventureStartNodes.adventureId
            }),
            playthroughs: r.many.adventurePlaythroughs({
                from: r.adventures.id,
                to:  r.adventurePlaythroughs.adventureId
            }),
            leaderboard: r.many.leaderboard({
                from: r.adventures.id,
                to: r.leaderboard.adventureId
            }),
        },
        nodes: {
            choices: r.many.choices({ from: r.nodes.id, to: r.choices.nodeId }),
        },
        choices: {
            node: r.one.nodes({ from: r.choices.nodeId, to: r.nodes.id }),
            nextNode: r.one.nodes({ from: r.choices.nextNodeId, to: r.nodes.id }),
            adventure: r.one.adventures({ from: r.choices.adventureId, to: r.adventures.id }),
        },
    })
);

// === 2. Player & Session Relations ===
export const playerRelations = defineRelations(
    { players, adventures, spells, adventurePlaythroughs, inventoryItems, playerSpells },
    (r) => ({
        players: {
            adventurePlaythroughs: r.many.adventurePlaythroughs({
                from: r.players.adventureId,
                to: r.adventurePlaythroughs.playerId
            }),
            playerSpells: r.many.playerSpells({
                from: r.players.id,
                to: r.playerSpells.playerId
            }),
        },
        adventurePlaythroughs: {
            player: r.one.players({ from: r.adventurePlaythroughs.playerId, to: r.players.id }),
            adventure: r.one.adventures({ from: r.adventurePlaythroughs.adventureId, to: r.adventures.id }),
        },
    })
);

// === 3. Master Data Relations ===
export const masterRelations = defineRelations(
    { spells, inventoryItems, lootTables, playerSpells },
    (r) => ({
        spells: {
            playerSpells: r.many.playerSpells({
                from: r.spells.id,
                to: r.playerSpells.spellId
            }),
        },
        inventoryItems: {
            lootTables: r.many.lootTables({
                from: r.inventoryItems.id,
                to: r.lootTables.inventoryItemId
            }),
        },
    })
);