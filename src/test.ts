import fs from "fs"
import config from "./config"
const folders = fs.readdirSync(config.HLSOutput)
folders.forEach(folder => {
    const folderPath = config.HLSOutput + folder
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