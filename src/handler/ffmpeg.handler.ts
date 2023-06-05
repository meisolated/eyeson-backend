import { spawn } from "child_process"
import { EventEmitter } from "stream"
import { v4 as uuidv4, v4 } from "uuid"

export const startHLSConversion = async (input: string, outputPath: string, segmentTime: string = "2", chatter: EventEmitter) => {
    const roomId: string = uuidv4()
    const cmd = [
        "-rtsp_transport",
        "tcp",
        "-max_delay", "500",
        "-i",
        input,
        "-c:v",
        "libx264",//libx264
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-c:a",
        "aac",
        "-g", "25",
        "-b:v", "4000k",
        "-fflags", "+nobuffer",
        "-muxdelay", "0.1",
        "-max_muxing_queue_size", "1024",
        "-map", "0",
        "-f",
        "segment",
        "-threads", "1",
        "-segment_time",
        segmentTime,
        "-segment_list_flags", "live",
        "-segment_format",
        "mpegts",
        "-segment_list_size", "1",
        "-segment_list",
        `${outputPath}/playlist.m3u8`,
        `${outputPath}/output_%03d.ts`,
    ]
    var output = spawn("ffmpeg", cmd)
    output.stdout.on("data", (data) => {
        const dataString = data.toString()
        chatter.emit(roomId, { type: "data", data: dataString })
    })
    output.stderr.on("data", (error) => {
        const dataString = error.toString()
        chatter.emit(roomId, { type: "error", data: dataString })
    })
    output.on("close", (code) => {
        console.log("ffmpeg closed with code: " + code)
        chatter.emit(roomId, { type: "close", data: code })
    })
    chatter.on(roomId, (data) => {
        if (data.ask === "restart") {
            output.kill()
            output = spawn("ffmpeg", cmd, { detached: true, shell: true })
        }
    })
    return roomId
}
