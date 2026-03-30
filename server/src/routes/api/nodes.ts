import {Router} from "express";
import {asc, eq} from "drizzle-orm";


import {coreRelations} from "../../schema/relations";
import {validateBody} from "../../middleware/validation";
import {nodeSchema} from "../../../../lib/zodSchemas";
import { db } from "../../db/config";
import {choices, nodes} from "../../schema/schema";
import {GetNodeResponse, SelectChoiceResponse} from "../../../../lib/apiTypes";


export const nodesRouter = Router();

//Fetches the current node, including choices and next node. Used for starting adventure
nodesRouter.get('/:id', validateBody(nodeSchema), async (req, res) => {
    try {
        const { id: nodeId } = req.params;

        // Fetch node with soft-delete guard
        const node = await db.query.nodes.findFirst({
            where: {
                id: nodeId,
                isDeleted: false,
            },
            with: {
                choices: {
                    relations: coreRelations,
                    orderBy: [asc(choices.orderBy)],
                }
            }
        });

        if (!node) {
            return res.status(404).json({ status: 'Node not found' });
        }

        // ✅ Build GetNodeResponse matching your type definition exactly
        const response: GetNodeResponse = {
            node: {
                id: node.id!,
                text: node.nodeText!,
                isFinalOutcome: Boolean(node.isFinalOutcome),
                endingTitle: node.endingTitle,
            },
            choices: node.choices.map(c => ({
                id: c.nextNodeId!,
                label: c.choiceLabel!,
                text: c.choiceText!,
                weight: Number(c.scoreWeight!),  // ✅ Explicitly cast to number
            })),
        };

        return res.json(response);

    } catch (error) {
        console.error("Error fetching node:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// This is the route user's will hit when selecting a choice.
// Should update current score, and find the next node.
// return updatedCurrentScore, and nextNode, if not the end
// nodes.ts - Fixed /next route handler
nodesRouter.get('/:id/next', async (req, res) => {
    try {
        const { id: fromNodeId } = req.params;
        const { choiceId, adventureId, currentScore } = req.body;

        // Validate inputs early
        if (!choiceId) return res.status(400).json({ status: 'Choice ID required' });

        // Fetch the selected choice
        const choice = await db.query.choices.findFirst({
            where: {
                nodeId: fromNodeId,
                isDeleted: false,
                adventureId,
            },
            with: {
                node: {
                    relations: coreRelations,
                }
            }
        });

        if (!choice) return res.status(404).json({ status: 'Choice not found' });

        // Calculate updated score (no unnecessary wrapping)
        let updatedScore = 0;
        if (Boolean(choice.isFinalOutcome)) {
            updatedScore = Number(choice.scoreWeight!) * Number(currentScore);
        } else {
            updatedScore = Number(currentScore) + Number(choice.weight!);
        }

        // Only fetch next node if not final outcome
        const response: SelectChoiceResponse = {
            updatedScore,
        };

        if (!Boolean(choice.isFinalOutcome)) {
            const nextNodeData = await db.query.nodes.findFirst({
                where: {
                    id: choice.nodeId!,
                    isDeleted: false,
                },
                with: {
                    choices: {
                        relations: coreRelations,
                        orderBy: [asc(choices.orderBy)],
                    }
                }
            });

            if (!nextNodeData) return res.status(404).json({ status: 'Next node not found' });

            // ✅ 4. Build NextNodeData matching your type definition exactly
            response.nextNode = {
                id: nextNodeData.id,
                text: nextNodeData.nodeText!,
                isFinalOutcome: Boolean(nextNodeData.isFinalOutcome),
                endingTitle: nextNodeData.endingTitle,
                choices: nextNodeData.choices.map(c => ({
                    id: c.nextNodeId!,
                    label: c.choiceLabel!,
                    text: c.choiceText!,
                    weight: Number(c.scoreWeight!),
                })),
            };
        }

        return res.json(response);

    } catch (error) {
        console.error("Error in /next route:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

