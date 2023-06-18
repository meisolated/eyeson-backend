export default {
    storageBuckets: {
        one: { path: "/home/recordings/", diskName: "/dev/sdb1" },
        two: { path: "/home/eyeson/recordings/", diskName: "/dev/sdc1" }
    },
    HLSOutput: "/home/eyeson/eyeson-backend/HLS/",
    camIps: ["10.69.69.154", "10.69.69.183"],
    rtmpsTemplate: (user: string, pass: string, ip: string) => `rtsp://${user}:${pass}@${ip}:554/stream1`,
    camIdPass: {
        user: "admin",
        pass: "LetItBeMe"
    },
    HLSTimeLength: "1",
    MP4SegmentLength: (60 * 10).toString(),
    HLSPurgeInterval: 1000 * 60 * 5
}
