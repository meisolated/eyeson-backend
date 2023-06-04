import cp from "child_process"
export const getLeftSpaceOnDisk = async (disk: string) => {
    const output = cp.execSync(`df -h ${disk}`).toString()
    const data = output.split(" ").filter((item) => item !== "")
    const leftSpace = {
        total: data[1],
        used: data[2],
        available: data[3],
        usedPercentage: data[4],
        mountedOn: data[5]
    }
    return leftSpace
}
