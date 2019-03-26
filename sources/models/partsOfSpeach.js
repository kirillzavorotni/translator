import { serverUrl } from "models/serverUrl";

export const partsOfSpeach = new webix.DataCollection({
    url: `${serverUrl}part`,
})
