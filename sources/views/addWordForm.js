import { JetView } from "webix-jet";
import { serverUrl } from "models/serverUrl";

const formSize = {
    width: 500,
    height: 300,
    margin: 5,
};

const addWord_rules = {
    value: webix.rules.isNotEmpty,
    translate: webix.rules.isNotEmpty,
    part_sp: webix.rules.isNotEmpty,
};

export default class ChangeDataFormView extends JetView {
    config() {
        return {
            view: "window",
            localId: "windowForm",
            head: {
                localId: "windowHeader",
                template: "Add Word"
            },
            position: "center",
            modal: true,
            body: {
                view: "form",
                localId: "wordForm",
                width: formSize.width,
                height: formSize.height,
                margin: formSize.margin,
                elements: [
                    {
                        view: "text",
                        label: "English",
                        labelWidth: 120,
                        name: "value",
                        invalidMessage: "must be filled",
                    },
                    {
                        view: "text",
                        label: "Russian",
                        labelWidth: 120,
                        name: "translate",
                        invalidMessage: "must be filled",
                    },
                    {
                        view: "text",
                        label: "Part of speech",
                        labelWidth: 120,
                        name: "part_sp",
                        invalidMessage: "must be filled",
                    },
                    { view: "spacer" },
                    {
                        view: "button",
                        localId: "saveBtn",
                        type: "form",
                        label: "Add word",
                        click: () => {
                            if (this._mode === "add") {
                                this.addWord();
                            } else {
                                this.editWord();
                            }
                        }
                    },
                    {
                        view: "button",
                        label: "Cancel",
                        click: () => {
                            this.hideWindow();
                        }
                    },
                ],
                rules: addWord_rules,
            }
        };
    }

    /********************************************************************/
    init() {
        this.on(this.app, "hideWordForm", () => {
            this.hideWindow();
        });
    }

    showWindow(selected_id, word, mode, textConfig) {
        this._selected_id = selected_id;
        this._mode = mode;
        if (this._selected_id && this._mode === "add") {
            this.getRoot().show();
            this.changeTextInForm(textConfig);
        } else if (this._selected_id && this._mode === "edit") {
            this.getRoot().show();
            this.changeTextInForm(textConfig);
            const values = word;
            this.$$("wordForm").setValues(values);
        } else {
            webix.message("You need to choose word group!");
        }

    }

    changeTextInForm(textConfig) {
        const header = this.$$("windowHeader");
        const btn = this.$$("saveBtn");
        header.define("template", textConfig.header);
        btn.define("label", textConfig.saveBtn);
        header.refresh();
        btn.refresh();
    }

    hideWindow() {
        this.$$("wordForm").clear();
        this.$$("wordForm").clearValidation();
        this.getRoot().hide();
    }

    addWord() {
        if (this.$$("wordForm").validate()) {
            const values = this.$$("wordForm").getValues();
            values.group_id = this._selected_id;
            this.app.callEvent("addWordToTable", [values]);
            this.app.callEvent("hideWordForm");
        }
    }

    editWord() {
        if (this.$$("wordForm").validate()) {
            const value = this.$$("wordForm").getValues();
            fetch(`${serverUrl}words/update`, { method: "POST", body: JSON.stringify(value) })
                .then(response => response.json())
                .then(json => {
                    if (json.status === 'updated') {
                        this.app.callEvent("editWordinTable", [json]);
                    } else {
                        this.app.callEvent("hideWordForm");
                        this.app.callEvent("changeAccess");
                    }
                })
                .catch(() => {
                    this.app.callEvent("hideWordForm");
                    webix.message("Server error, try again");
                });
        }
    }
}






