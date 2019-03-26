import { JetView } from "webix-jet";
import addWordForm from "views/addWordForm";
import addGroupForm from "views/addGroupForm";
import { serverUrl } from "models/serverUrl";
import { partsOfSpeach } from "models/partsOfSpeach";

const group_list_size = {
    width: 230,
};

const group_list_header_size = {
    height: 40,
};

const words_table_size = {
    col_1: 40,
    col_3: 200,
    col_4: 200,
};

const addGroupTextConfig = {
    header: "Add Group",
    saveBtn: "Add group",
}

const changeGroupTextConfig = {
    header: "Edit Group",
    saveBtn: "Save group",
}

const addWordTextConfig = {
    header: "Add Word",
    saveBtn: "Add word",
}

const changeWordTextConfig = {
    header: "Edit Word",
    saveBtn: "Save word",
}

const list_type_elem_size = {
    height: 67,
}

export default class WordsView extends JetView {
    config() {
        const _ = this.app.getService("locale")._;
        const list = {
            view: "list",
            localId: "groupList",
            css: "group-list",
            template: `
                    <div class="group-list-template-wrap">
                        <p class="group-name">#group_name#</p>
                        <p class="group-word-count">${_("Words count")}: #words_count#</p>
                        <p class="group-date">${_("Create")}: #create_date#</p>
                    </div>
                `,
            select: true,
            type: {
                height: list_type_elem_size.height,
            },
            on: {
                onAfterSelect: (id) => {
                    this.filterTable(id);
                },
            }
        };

        const table = {
            view: "datatable",
            localId: "wordTable",
            css: "word-table",
            columns: [
                { id: "value", header: _("English"), fillspace: true, css: "word-table-col-1" },
                { id: "translate", header: _("Russian"), width: words_table_size.col_3, css: "word-table-col-2" },
                { id: "part_id", header: _("Part of speach"), collection: partsOfSpeach, width: words_table_size.col_4, css: "word-table-col-3" }
            ],
            scrollX: false,
            select: true,
        };

        return {
            cols: [
                {
                    rows: [
                        {
                            template: _("Group words"),
                            css: "list-group-head",
                            height: group_list_header_size.height,
                        },
                        list,
                        {
                            view: "button",
                            type: "form",
                            label: _("Add group"),
                            css: "add-group-btn",
                            click: () => {
                                this.addGroup();
                            }
                        },
                        {
                            view: "button",
                            type: "form",
                            label: _("Edit group"),
                            css: "edit-group-btn",
                            click: () => {
                                this.editGroup();
                            }
                        },
                        {
                            view: "button",
                            label: _("Delete group"),
                            css: "del-group-btn",
                            click: () => {
                                this.deleteGroup();
                            }
                        },
                    ],
                    width: group_list_size.width,
                },
                {
                    rows: [
                        table,
                        {
                            view: "button",
                            label: _("Export group to excel"),
                            css: "export-word-btn",
                            click: () => {
                                this.exportToExcel();
                            }
                        },
                        {
                            view: "button",
                            type: "form",
                            css: "add-word-btn",
                            label: _("Add word"),
                            click: () => {
                                this.addWord();
                            }
                        },
                        {
                            view: "button",
                            type: "form",
                            label: _("Edit word"),
                            css: "edit-word-btn",
                            click: () => {
                                this.editWord();
                            }
                        },
                        {
                            view: "button",
                            label: _("Delete word"),
                            css: "del-word-btn",
                            click: () => {
                                this.deleteWord();
                            }
                        },
                    ],
                },
            ],
        };
    }

    /****************************************************************/
    init() {
        this.popupWindowForm = this.ui(addWordForm);
        this.popupWindowGroupForm = this.ui(addGroupForm);

        this.on(this.app, "clearViews", () => {
            this.$$("groupList").clearAll();
            this.$$("wordTable").clearAll();
        });

        this.on(this.app, "fillViews", () => {
            this.$$("groupList").load(`${serverUrl}groups`);
            this.$$("wordTable").load(`${serverUrl}words`);
        });

        this.app.attachEvent("addWordToTable", (newWord) => {
            webix.ajax().post(`${serverUrl}words`, JSON.stringify(newWord))
                .then((json) => {
                    json = json.json();
                    return json;
                })
                .then((json) => {
                    if (json.status === "added") {
                        const table = this.$$("wordTable");
                        const list = this.$$("groupList");
                        const groupValues = {
                            words_count: json.words_count,
                        }
                        list.updateItem(json.group_id, groupValues);
                        table.clearAll();
                        table.load(`${serverUrl}words`).then(() => {
                            this.filterTable(json.group_id);
                        });
                    } else {
                        this.app.callEvent("hideWordForm");
                        this.app.callEvent("changeAccess");
                    }
                })
                .catch(() => {
                    this.app.callEvent("hideWordForm");
                    webix.message("Server error, try again");
                });
        });

        this.app.attachEvent("editWordinTable", (updWord) => {
            const table = this.$$("wordTable");
            const id = table.getSelectedId();
            table.updateItem(id.row, updWord);
            this.popupWindowForm.hideWindow();
        });

        this.app.attachEvent("addGroupinList", (newGroup) => {
            webix.ajax().post(`${serverUrl}/groups/add`, JSON.stringify(newGroup))
                .then((json) => {
                    json = json.json();
                    return json;
                })
                .then((json) => {
                    if (json.status === "added") {
                        this.$$("groupList").add(json);
                        this.popupWindowGroupForm.hideWindow();
                    } else {
                        this.popupWindowGroupForm.hideWindow();
                        this.app.callEvent("changeAccess");
                    }
                })
                .catch(() => {
                    console.log("catch error");
                    this.popupWindowGroupForm.hideWindow();
                    webix.message("Server error, try again");
                });
        });

        this.app.attachEvent("editGroupinList", (updGroup) => {
            fetch(`${serverUrl}groups/update`, { method: "POST", body: JSON.stringify(updGroup) })
                .then(response => response.json())
                .then(json => {
                    if (json.status === "updated") {
                        this.$$("groupList").updateItem(json.id, json);
                        this.popupWindowGroupForm.hideWindow();
                    } else {
                        this.popupWindowGroupForm.hideWindow();
                        this.app.callEvent("changeAccess");
                    }
                })
                .catch(() => {
                    this.popupWindowGroupForm.hideWindow();
                    webix.message("Server error, try again");
                });
        });

        this.app.callEvent("fillViews");
    }

    exportToExcel() {
        const group_id = this.$$("groupList").getSelectedId();
        if (group_id) {
            const groupName = this.$$("groupList").getItem(group_id).group_name;
            webix.toExcel(this.$$("wordTable"), {
                filename: `words - group_${groupName}`,
                name: `words - group_${groupName}`
            });
        } else {
            webix.toExcel(this.$$("wordTable"), {
                filename: "words - all",
                name: "words - all"
            });
        }
    }

    addGroup() {
        this.popupWindowGroupForm.showWindow("", "", "add", addGroupTextConfig);
    }

    editGroup() {
        const group_id = this.$$("groupList").getSelectedId();
        if (group_id) {
            const group = this.$$("groupList").getItem(group_id);
            this.popupWindowGroupForm.showWindow(group.id, group, "edit", changeGroupTextConfig);
        } else {
            webix.message("You need to choose group!");
        }
    }

    filterTable(id) {
        this.$$("wordTable").filter((films) => films.group_id == id);
    }

    addWord() {
        const group_id = this.$$("groupList").getSelectedId();
        this.popupWindowForm.showWindow(group_id, "", "add", addWordTextConfig);
    }

    editWord() {
        const word_id = this.$$("wordTable").getSelectedId();
        if (word_id) {
            const word = this.$$("wordTable").getItem(word_id);
            this.popupWindowForm.showWindow(word.group_id, word, "edit", changeWordTextConfig);
        } else {
            webix.message("You need to choose word!");
        }
    }

    deleteWord() {
        const word_id = this.$$("wordTable").getSelectedId();
        if (word_id) {
            webix.confirm({
                title: "Delete",
                text: "Do You want to delete this word?",
                type: "confirm-warning",
                callback: (result) => {
                    if (result) {
                        const word = this.$$("wordTable").getItem(word_id);
                        fetch(`${serverUrl}words/delete`, { method: "POST", body: JSON.stringify(word) })
                            .then(response => response.json())
                            .then(json => {
                                if (json.status === "deleted") {
                                    const list = this.$$("groupList");
                                    this.$$("wordTable").remove(json.id);
                                    const groupValues = {
                                        words_count: json.words_count,
                                    }
                                    list.updateItem(json.group_id, groupValues);
                                } else {
                                    this.app.callEvent("changeAccess");
                                }
                            })
                            .catch(() => {
                                webix.message("Server error, try again");
                            });
                    }
                }
            });
        } else {
            webix.message("You need to choose word!")
        }
    }

    deleteGroup() {
        const form = this.$$("groupList");
        const selectedId = form.getSelectedId();
        const group = form.getItem(selectedId);
        if (selectedId) {
            webix.confirm({
                title: "Delete",
                text: "Do You want to delete this group?",
                type: "confirm-warning",
                callback: (result) => {
                    if (result) {
                        fetch(`${serverUrl}groups/delete`, { method: "POST", body: JSON.stringify(group) })
                            .then(response => response.json())
                            .then(json => {
                                if (json.status === "deleted") {
                                    form.remove(json.id);
                                    const table = this.$$("wordTable");
                                    table.clearAll();
                                    table.load(`${serverUrl}words`);
                                } else {
                                    this.app.callEvent("changeAccess");
                                }
                            })
                            .catch(() => {
                                webix.message("Server error, try again");
                            });
                    }
                }
            });
        } else {
            webix.message("You need to choose group!");
        }
    }
}
