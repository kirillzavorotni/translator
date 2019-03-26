import { JetView } from "webix-jet";
import { serverUrl } from "models/serverUrl";

const scoreTable_size = {
    col_1: 40,
    col_3: 120,
    col_4: 100,
};

export default class ScoreboardView extends JetView {
    config() {
        const _ = this.app.getService("locale")._;
        return {
            view: "datatable",
            localId: "scoreboard",
            css: "word-table",
            select: true,
            columns: [
                { id: "id", header: "№", width: scoreTable_size.col_1 },
                { id: "date", header: _("Date"), width: scoreTable_size.col_2, fillspace: true },
                { id: "score", header: _("Score"), width: scoreTable_size.col_3 },
                { id: "out_of", header: _("Out of"), width: scoreTable_size.col_4 },
            ],
        };
    }

    init() {
        fetch(`${serverUrl}checkSession`)
            .then(response => response.json())
            .then(json => {
                if (json.status === "accessOK") {
                    this.$$("scoreboard").load(`${serverUrl}score`);
                } else {
                    this.$$("scoreboard").clearAll();
                    this.app.callEvent("changeAccess");
                    this.show("/top/words");
                }
            }).catch(() => {
                webix.message("Server error, try later");
            });

    }
}
