import express, { Express, Request, Response } from "express"
import { expressHLSEndPointTrafficMiddleware } from "./handler/HLSStream.handler"
import { EventEmitter } from "stream"
import config from "./config"
import { kill } from "./workers/kill.worker"
import prugeHLSData, { purgeHLSDataBeforeStart } from "./workers/prugeHLSData.worker"
import { startRecording } from "./workers/startRecording.worker"
import { startStreams } from "./workers/startStreams.worker"

const chatter = new EventEmitter()
const app: Express = express()

app.get("/", (_req: Request, res: Response) => {
    res.send({ message: "Something is missing over here", code: 200 })
})
const main = async () => {
    app.use("/home/cctv/backend/hls", (req, res, next) => expressHLSEndPointTrafficMiddleware(req, res, next, chatter))
    app.listen(3001, () => {
        console.log(`Server running on port http://localhost:` + 3001)
    })
    kill()
    purgeHLSDataBeforeStart(config.HLSOutput)
    startStreams(app, chatter)
    startRecording(chatter)
    prugeHLSData(config.HLSOutput, config.HLSPurgeInterval)
}
main()
