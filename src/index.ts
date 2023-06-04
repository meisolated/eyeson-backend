
import express, { Express, Request, Response } from "express"
import { EventEmitter } from "stream"
import { startHLSStream } from "./handler/hls.handler"
import HLSServer from "./lib/HLS"
const chatter = new EventEmitter()
const something = "rtsp://admin:LetItBeMe@10.69.69.111:554/stream1"

const app: Express = express()

app.get("/", (_req: Request, res: Response) => {
    res.send({ message: "Something is missing over here", code: 200 })
})
const main = async () => {

    const id: any = await startHLSStream(something, "/home/cctv/EyesOn/backend/ouputffmpeg", "5", chatter)
    chatter.on(id, (data) => {
        console.log(data.data)
    })
    setTimeout(() => {
        app.use("/hls", (req, res, next) => HLSServer(req, res, next, { hlsDir: "/home/cctv/EyesOn/backend/ouputffmpeg/" }))
        app.listen(3001, () => {
            console.log(`Server running on port http://localhost:` + 3001)
        })
    }, 1000)

}
main()

