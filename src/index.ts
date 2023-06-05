
import express, { Express, Request, Response } from "express"
import { EventEmitter } from "stream"
import config from "./config"
import HLSServer from "./lib/HLS"
import prugeHLSData from "./workers/prugeHLSData"
import { startStreams } from "./workers/startStreams"
const chatter = new EventEmitter()

const app: Express = express()

app.get("/", (_req: Request, res: Response) => {
    res.send({ message: "Something is missing over here", code: 200 })
})
const main = async () => {
    app.use("/hls", (req, res, next) => HLSServer(req, res, next, { hlsDir: config.HLSOutput }))
    app.listen(3001, () => {
        console.log(`Server running on port http://localhost:` + 3001)
    })
    startStreams(app, chatter)
    prugeHLSData(config.HLSOutput, config.HLSPurgeInterval)

}
main()
