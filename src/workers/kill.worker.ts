// kill any existing ffmpeg process
import { execSync } from "child_process"

export const kill = async () => {
    try {
        execSync("killall ffmpeg")
    }
    catch (error: any) {
        return
    }
}