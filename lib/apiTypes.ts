/**
 * Response when fetching an adventure node (starting point or intermediate)
 */
export interface NodeResponse {
    id: string;
    text: string;
    isFinalOutcome: boolean;
    endingTitle?: string | null;
}

/**
 * A single choice available on a node
 */
export interface Choice {
    id: string;
    label: string;
    text: string;
    weight: number;
}

/**
 * Complete response for /nodes/:id route
 */
export interface GetNodeResponse {
    node: NodeResponse;
    choices: Choice[];
}

/**
 * Response when selecting a choice
 */
export interface SelectChoiceResponse {
    updatedScore: number;
    nextNode?: NextNodeData; // Optional for final outcomes
}

/**
 * Data about the next node if not an ending
 */
export interface NextNodeData extends NodeResponse {
    choices: Choice[];
}