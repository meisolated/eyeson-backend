import { NextFunction, Request, Response } from 'express'
import { EventEmitter } from 'stream'
import config from '../config'
import HLSServer from '../lib/HLS'

export const expressHLSEndPointTrafficMiddleware = (req: Request, res: Response, next: NextFunction, chatter: EventEmitter) => {
    HLSServer(req, res, next, { hlsDir: config.HLSOutput })

    if (req.url.includes(".m3u8") || req.url.includes(".ts")) {
        chatter.emit("HLSWorker", { tell: "currently_requesting" })
    }

}