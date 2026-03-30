// src/routes/admin/index.ts - Admin route aggregator
import { Router } from "express";
import { requireAdminAuth } from "../../middleware/admin";
import * as nodes from "./nodes";
import * as choices from "./choices";
import * as adventures from "../../routes/admin/adventure";

export const adminRouter = Router();

// ✅ Apply middleware to all routes in this router group
adminRouter.use(requireAdminAuth);

// 🔥 Nodes CRUD
adminRouter.use('/nodes', nodes.adminNodesRouter);

// 🔥 Choices CRUD
adminRouter.use('/choices', choices.adminChoicesRouter);

// 🔥 Adventures CRUD
adminRouter.use('/adventures', adventures.adminAdventuresRouter);

// 🔥 Spells Master Data
// adminRouter.use('/spells', spells.adminSpellsRouter);
//
// // 🔥 Inventory Master Data
// adminRouter.use('/inventory', inventory.adminInventoryRouter);

// 🔥 Leaderboard Management
// adminRouter.use('/leaderboard', leaderboard.adminLeaderboardRouter);

export default adminRouter;
