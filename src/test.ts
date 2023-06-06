import { getUseableDisk } from "./handler/storage.handler"

getUseableDisk().then((buckets) => console.log(buckets))