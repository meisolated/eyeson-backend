import { Express } from "express"
import fs from "fs"
import { EventEmitter } from "stream"
import config from "../config"
import { startHLSConversion } from "../handler/ffmpeg.handler"


const cams = config.camIps

export const startStreams = async (app: Express, chatter: EventEmitter) => {
    var onlineCams: string[] = []
    cams.forEach(async ip => {
        console.log("starting stream for ip: " + ip)
        const outputPath = config.HLSOutput + "cam" + ip.split(".")[3]
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath)
        }
        const roomId: any = await startHLSConversion(
            config.rtmpsTemplate(config.camIdPass.user, config.camIdPass.pass, ip),
            outputPath, "4", chatter
        )
        onlineCams.push(ip)
        console.log(roomId)
        chatter.on(roomId, (data: any) => {
            // console.log(data)
            if (data.type === "data") {
            }
            if (data.type === "close") {
                console.log("ip: " + ip + " closed")
            }
        })
    })

    app.get("/home/cctv/backend/cams", (_req, res) => {
        res.send({ cams: onlineCams })
    })

}