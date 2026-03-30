import express from 'express'
import cors from 'cors'
import {setupMiddleware} from "./middleware/index.js";
import {errorHandler} from "./middleware/errorHandler.js";
import admin from "./routes/admin/admin";
import { adventuresRouter } from "./routes/api/adventures"
import { nodesRouter } from "./routes/api/nodes"
import { leaderboardRouter } from "./routes/api/leaderboard"

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({status: 'healthy', service: 'Adventure API', database: 'connected'})
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})


// Setup middleware (helmet, cors, rate limiting, morgan)
setupMiddleware(app);

// Routes (mount after middleware)
app.use('/api/adventures', adventuresRouter);
app.use('/api/nodes', nodesRouter);
// app.use('/api/choices', choices);
app.use('/api/leaderboard', leaderboardRouter);
// app.use('/api/players', players);

app.use('/admin/', admin)



// Error handler (must be last!)
app.use(errorHandler);

export default app;