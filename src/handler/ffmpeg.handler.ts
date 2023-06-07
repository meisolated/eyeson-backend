import { spawn } from "child_process"
import { EventEmitter } from "stream"
import { v4 as uuidv4, v4 } from "uuid"

export const startRTSPtoHLSConversion = async (input: string, outputPath: string, hlsTime: string = "2", mp4Segment: string, chatter: EventEmitter) => {
    var lastRequest = Date.now()
    var currentStatus = "running"
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
        "-g", "20",
        "-b:v", "2000k",
        "-fflags", "+nobuffer",
        "-muxdelay", "0.1",
        "-max_muxing_queue_size", "1024",
        "-map", "0",
        "-f",
        "segment",
        "-threads", "1",
        "-crf", "22",
        "-vf", "scale=1920:1080",
        "-hls_time",
        hlsTime,
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
            output = spawn("ffmpeg", cmd)
        }
    })

    chatter.on("HLSWorker", (data) => {
        if (data.ask === "stop") {
            output.kill()
            chatter.emit(roomId, { type: "closed", data: 0 })
        } else if (data.ask === "play") {
            console.log("starting HLS conversion")
            output = spawn("ffmpeg", cmd)
            chatter.emit(roomId, { type: "started", data: 0 })
        }
        else if (data.tell === "currently_requesting") {
            if (currentStatus === "running") {
                lastRequest = Date.now()
            }
            if (currentStatus === "stopped") {
                currentStatus = "running"
                output = spawn("ffmpeg", cmd)
                chatter.emit(roomId, { type: "started", data: 0 })
            }
        }
    })
    setInterval(() => {
        if (Date.now() - lastRequest > 20000 && currentStatus === "running") {
            output.kill()
            currentStatus = "stopped"
            chatter.emit(roomId, { type: "stopped", data: 0 })
        }
    }, 1000)
    return roomId
}

export const startRTSPtoMP4Conversion = async (input: string, outputPath: string, segmentTime: string = "1800", chatter: EventEmitter) => {
    // ffmpeg -rtsp_transport tcp -i rtsp://your_rtsp_url -c:v copy -c:a copy output.mp4
    const roomId: string = uuidv4()
    const cmd = [
        "-rtsp_transport",
        "tcp",
        "-i", input,
        "-c:v", "copy",
        "-c:a", "aac",
        "-f", "segment",
        "-segment_time", segmentTime,
        "-segment_format", "mp4",
        "-reset_timestamps", "1",
        "-strftime", "1",
        `${outputPath}/output_%Y-%m-%d_%H-%M-%S_from_%s_to_%e.mp4`
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