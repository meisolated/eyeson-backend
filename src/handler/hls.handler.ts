import { spawn } from "child_process"
import { EventEmitter } from "stream"
import { v4 as uuidv4, v4 } from "uuid"

export const startHLSStream = async (input: string, outputPath: string, segmentTime: string = "10", chatter: EventEmitter) => {
    const roomId = uuidv4()
    // ffmpeg -rtsp_transport tcp -i rtsp://your_rtsp_url -c:v libx264 -preset medium -tune zerolatency -c:a copy -f ssegment -segment_list output.m3u8 -segment_time 10 -segment_format mpegts -segment_list_type m3u8 -segment_list_size 6 -segment_list_flags live output%03d.ts

    const cmd = [
        "-rtsp_transport",
        "tcp",
        "-max_delay", "500",
        "-i",
        input,
        "-c:v",
        "copy",//libx264
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-c:a",
        "copy",
        "-g", "25",
        "-b:v", "2000k",
        "-fflags", "+nobuffer",
        "-muxdelay", "0.1",
        "-max_muxing_queue_size", "1024",
        "-map", "0",
        "-f",
        "segment",
        "-threads", "4",
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
    chatter.on(roomId, (data) => {
        if (data.ask === "restart") {
            output.kill()
            output = spawn("ffmpeg", cmd, { detached: true, shell: true })
        }
    })
    return roomId
}
