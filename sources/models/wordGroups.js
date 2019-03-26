import { serverUrl } from "models/serverUrl";

export const wordGroups = new webix.DataCollection({
    url: `${serverUrl}groups`,
})
