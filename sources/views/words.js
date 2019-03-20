import { JetView } from "webix-jet";
import addWordForm from "views/addWordForm";
import addGroupForm from "views/addGroupForm";
import { serverUrl } from "models/serverUrl";

const group_list_size = {
    width: 230,
};

const group_list_header_size = {
    height: 40,
};

const words_table_size = {
    col_1: 40,
    col_3: 200,
    col_4: 150,
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

export default class WordsView extends JetView {
    config() {
        const list = {
            view: "list",
            localId: "groupList",
            template: "#group_name#<br>#create_date#<br>words count: #words_count#",
            select: true,
            type: {
                height: 90
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
            columns: [
                { id: "value", header: "English", fillspace: true },
                { id: "translate", header: "Russian", width: words_table_size.col_3 },
                { id: "part_sp", header: "Part of speach", width: words_table_size.col_4 }
            ],
            scrollX: false,
            select: true,
        };

        return {
            cols: [
                {
                    rows: [
                        {
                            template: "Group words",
                            height: group_list_header_size.height,
                        },
                        list,
                        {
                            view: "button",
                            type: "form",
                            label: "Add group",
                            click: () => {
                                this.addGroup();
                            }
                        },
                        {
                            view: "button",
                            type: "form",
                            label: "Edit group",
                            click: () => {
                                this.editGroup();
                            }
                        },
                        {
                            view: "button",
                            label: "Delete group",
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
                            type: "form",
                            label: "Add word",
                            click: () => {
                                this.addWord();
                            }
                        },
                        {
                            view: "button",
                            type: "form",
                            label: "Edit word",
                            click: () => {
                                this.editWord();
                            }
                        },
                        {
                            view: "button",
                            label: "Delete word",
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
            fetch(`${serverUrl}words`, { method: "POST", body: JSON.stringify(newWord) })
                .then(response => response.json())
                .then(json => {
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
            fetch(`${serverUrl}/groups/add`, { method: "POST", body: JSON.stringify(newGroup) })
                .then(response => response.json())
                .then(json => {
                    if (json.status === "added") {
                        this.$$("groupList").add(json);
                        this.popupWindowGroupForm.hideWindow();
                    } else {
                        this.popupWindowGroupForm.hideWindow();
                        this.app.callEvent("changeAccess");
                    }
                }).catch(() => {
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
