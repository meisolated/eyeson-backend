export { }

declare global {

    interface StoreageBucketData {
        total: string
        used: string
        available: string
        usedPercentage: string
        mountedOn: string
    }

}