import fs from "fs"
import { EventEmitter } from "stream"
import config from "../config"
import { startRTSPtoMP4Conversion } from "../handler/ffmpeg.handler"
import { getUseableDisk } from "../handler/storage.handler"

export const startRecording = async (chatter: EventEmitter) => {
    const cams = config.camIps
    var onlineCams: string[] = []
    const buckets: StoreageBucketData = await getUseableDisk().then((buckets: StoreageBucketData[]) => buckets[0])
    cams.forEach(async ip => {
        console.log("starting recording for ip: " + ip)
        const outputPath = buckets.mountedOn + "/recordings/" + "cam" + ip.split(".")[3]
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath)
        }
        const roomId: any = await startRTSPtoMP4Conversion(
            config.rtmpsTemplate(config.camIdPass.user, config.camIdPass.pass, ip),
            outputPath, config.MP4SegmentLength, chatter
        )
        onlineCams.push(ip)
        console.log(roomId)
        chatter.on(roomId, (data: any) => {
            if (data.type === "data") {
            }
            if (data.type === "close") {
                console.log("ip: " + ip + " closed")
            }
        })
    })
}