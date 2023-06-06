import cp from "child_process"
import config from "../config"
export const getLeftSpaceOnDisk = async (disk: string) => {
    const output = cp.execSync(`df -h ${disk}`).toString()
    const data = output.split(" ").filter((item) => item !== "")
    const leftSpace = {
        total: data[7],
        used: data[8],
        available: data[9],
        usedPercentage: data[10],
        mountedOn: data[11].split("\n")[0]
    }
    return leftSpace
}

export const getUseableDisk = async () => {
    const buckets: any = config.storageBuckets
    const diskNames = Object.keys(buckets).map((key) => buckets[key].diskName)
    const disks = await Promise.all(diskNames.map(async (disk) => {
        const space = await getLeftSpaceOnDisk(disk)
        return space
    }))
    const useableDisks: StoreageBucketData[] = disks.filter(disk => parseInt(disk.available.split("G")[0]) > 50)
    return useableDisks
}


