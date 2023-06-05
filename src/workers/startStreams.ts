import { Express } from "express"
import fs from "fs"
import { EventEmitter } from "stream"
import config from "../config"
import { startHLSConversion } from "../handler/ffmpeg.handler"


const cams = config.camIps

export const startStreams = async (app: Express, chatter: EventEmitter) => {
    var onlineCams: string[] = []
    cams.forEach(ip => {
        console.log("starting stream for ip: " + ip)
        const outputPath = config.HLSOutput + "cam" + ip.split(".")[3]
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath)
        }
        const roomId: any = startHLSConversion(
            config.rtmpsTemplate(config.camIdPass.user, config.camIdPass.pass, ip),
            outputPath, "2", chatter
        )
        onlineCams.push(ip)
        console.log(roomId)
        chatter.on(roomId, (data) => {
            console.log(data)
            if (data.type === "data") {
            }
            if (data.type === "close") {
                console.log("ip: " + ip + " closed")
            }
        })
    })

    app.get("/cams", (_req, res) => {
        res.send({ cams: onlineCams })
    })

}