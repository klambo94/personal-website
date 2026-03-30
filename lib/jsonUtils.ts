/**
 * Serialize Ability Scores for SQLite TEXT column
 */
export function serializeAbilityScores(scores: Record<string, number>): string {
    return JSON.stringify(scores);
}

/**
 * Deserialize Ability Scores from SQLite TEXT column
 */
export function deserializeAbilityScores(jsonString: string | null): Record<string, number> | null {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse ability scores JSON', error);
        return null;
    }
}

/**
 * Serialize Inventory for SQLite TEXT column
 */
export function serializeInventory(items: Record<string, number>): string {
    return JSON.stringify(items);
}

/**
 * Deserialize Inventory from SQLite TEXT column
 */
export function deserializeInventory(jsonString: string | null): Record<string, number> | null {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse inventory JSON', error);
        return null;
    }
}

/**
 * Parse Date from SQLite timestamp (Unix timestamp in seconds)
 */
export function parseTimestamp(timestamp: number | null): string | null {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000); // SQLite stores in seconds
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format Score (add prefix like "1,234" or "1,000")
 */
export function formatScore(score: number): string {
    return score.toLocaleString('en-US');
}
