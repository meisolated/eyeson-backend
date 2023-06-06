import { NextFunction, Request, Response } from 'express'
import { EventEmitter } from 'stream'
import config from '../config'
import HLSServer from '../lib/HLS'
var lastRequest = Date.now()
var currentStatus = "running"
var intervalRunning = false
export const expressHLSEndPointTrafficMiddleware = (req: Request, res: Response, next: NextFunction, chatter: EventEmitter) => {
    HLSServer(req, res, next, { hlsDir: config.HLSOutput })
    lastRequest = Date.now()
    if (req.url.includes(".m3u8") || req.url.includes(".ts")) {
        if (currentStatus == "stopped") {
            currentStatus = "running"
            chatter.emit("HLSWorker", { ask: "play" })
        }
    }
    if (!intervalRunning) {
        setInterval(() => {
            intervalRunning = true
            if ((Date.now() - lastRequest) > 20000) {
                currentStatus = "stopped"
                chatter.emit("HLSWorker", { ask: "stop" })
            }
        }, 1000)
    }

}