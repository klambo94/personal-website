/**
 * Ability Score Interface for Character Creation
 */
export interface AbilityScores {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

/**
 * Adventure Metadata
 */
export interface AdventureMeta {
    id: number;
    title: string;
    description: string;
}

/**
 * Game Node Interface (Response from /nodes/:id)
 */
export interface GameNode {
    id: number;
    nodeText: string;
    scoreMultiplier: number;
    endingTitle?: string;
    isFinalOutcome: boolean;
    choices: ChoiceOption[];
}

/**
 * Choice Option Interface (available choices at a node)
 */
export interface ChoiceOption {
    id: number;
    choiceLabel: string;
    choiceText: string;
    nextNodeId: number;
    scoreWeight: number;
}

/**
 * Player Profile/Character Build
 */
export interface PlayerMeta {
    id: number;
    playerName: string;
    displayName?: string;
    race: string;
    class: string;
    subclass?: string | null;
    xpLevel: number;
    maxHp: number;
    currentHp: number;
    totalScore: number;
    createdAt: Date;
}

/**
 * Adventure Session/Playthrough State (for leaderboard tracking)
 */
export interface PlaythroughSession {
    id: number;
    playerId: number;
    playerName: string;
    adventureId: number;
    currentNodeId: number | null;
    totalScore: number;
    choicesMade: number;
    isCompleted: boolean;
    completionTimestamp: Date | null;
}

/**
 * Spell Metadata (Master Data - not session-specific)
 */
export interface Spell {
    id: number;
    spellName: string;
    school: string | null;
    level: number;
    description: string;
    castingTime: string;
    duration: string | null;
}

/**
 * Inventory Item Metadata (Master Data)
 */
export interface InventoryItem {
    id: number;
    itemName: string;
    itemCategory: string;
    rarity: string;
    description: string;
    maxStackCount: number;
    weight: number;
    equipable: boolean;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
    id: number;
    playerName: string;
    score: number;
    createdAt: Date;
}

/**
 * Adventure with Stats (Admin Dashboard)
 */
export interface AdventureStats {
    adventureId: number;
    title: string;
    playthroughCount: number;
    topScore: number;
}

/**
 * Game Result from choosing an option
 */
export interface GameResult {
    success: boolean;
    nextNodeId?: number | null;
    nodeText?: string;
    endingTitle?: string;
    scoreChangedBy: number;
    isNewEnding: boolean;
    isGameEnded: boolean;
}

/**
 * Player Creation Result
 */
export interface PlayerResult {
    playerId: number;
    playerName: string;
    race: string;
    class: string;
    xpLevel: number;
}

/**
 * Game State for ongoing session (returned to client)
 */
export interface GameState {
    currentNode: GameNode;
    currentScore: number;
    adventureId: number;
    isGameCompleted: boolean;
}

type NodeResponse = {
    nodeText: string;
    isFinalOutcome: boolean;
    endingTitle: string | null;
};

type ChoiceResponse = {
    id: string;
    label: string;
    text: string;
    weight: number;
};