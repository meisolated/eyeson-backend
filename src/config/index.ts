export default {
    storageBuckets: {
        one: "/home/recordings/",
        two: "/home/eyeson/recordings/"
    },
    HLSOutput:
        "/home/eyeson/eyeson-backend/ouputffmpeg/",

    diskName: {
        one: "/dev/sdb1",
        two: "/dev/sdc1"
    },
    camIps: ["10.69.69.111", "10.69.69.127"],
    rtmpsTemplate: (user: string, pass: string, ip: string) => `rtsp://${user}:${pass}@${ip}:554/stream1`,
    camIdPass: {
        user: "admin",
        pass: "LetItBeMe"
    },
    HLSPurgeInterval: 20000,
}