import { NextFunction, Request, Response } from 'express'
import { EventEmitter } from 'stream'
import config from '../config'
import HLSServer from '../lib/HLS'
var lastRequest = Date.now()
var currentStatus = "running"
export const expressHLSEndPointTrafficMiddleware = (req: Request, res: Response, next: NextFunction, chatter: EventEmitter) => {
    HLSServer(req, res, next, { hlsDir: config.HLSOutput })

    if (req.url.includes(".m3u8") || req.url.includes(".ts")) {
        console.log("requesting HLS data")
        lastRequest = Date.now()
        if (currentStatus == "stopped") {
            currentStatus = "running"
            chatter.emit("HLSWorker", { ask: "play" })
        }
    }

    setInterval(() => {
        if (Date.now() - lastRequest > (10000)) {
            currentStatus = "stopped"
            chatter.emit("HLSWorker", { ask: "stop" })
        }
    }, 1000)


}