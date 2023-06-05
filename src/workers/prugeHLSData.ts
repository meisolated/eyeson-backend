import fs from "fs"

export const purgeHLSDataBeforeStart = (HLSOutput: string) => {
    //  get all folders in HLSOutput
    const folders = fs.readdirSync(HLSOutput)
    //  delete all folders
    folders.forEach(folder => {
        fs.rmSync(HLSOutput + folder, { recursive: true, force: true })
    })
}

export default (HLSOutput: string, HLSPurgeInterval: number) => {
    setInterval(() => {
        console.log("purging HLS data")
        const folders = fs.readdirSync(HLSOutput)
        folders.forEach(folder => {
            const folderPath = HLSOutput + folder
            const files = fs.readdirSync(folderPath)
            const filteredFiles = files.filter(file => file.split(".")[1] !== "m3u8")
            const fileNumbers = filteredFiles.map(file => parseInt(file.split("_")[1].split(".")[0]))
            const max = Math.max(...fileNumbers)
            const notToDelete = [max, max - 1]
            filteredFiles.forEach(file => {
                // delete all files except notToDelete
                if (!notToDelete.includes(parseInt(file.split("_")[1].split(".")[0]))) {
                    fs.unlinkSync(folderPath + "/" + file)

                }
            })
        })
    }, HLSPurgeInterval)
}