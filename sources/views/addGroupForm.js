import { JetView } from "webix-jet";

const formSize = {
    width: 500,
    height: 300,
    margin: 5,
};

const addGroup_rules = {
    group_name: webix.rules.isNotEmpty,
};

export default class ChangeDataGroupFormView extends JetView {
    config() {
        const _ = this.app.getService("locale")._;
        return {
            view: "window",
            localId: "windowForm",
            head: {
                localId: "windowHeader",
                template: "Add Group",
            },
            position: "center",
            modal: true,
            body: {
                view: "form",
                localId: "groupForm",
                width: formSize.width,
                height: formSize.height,
                margin: formSize.margin,
                elements: [
                    {
                        view: "text",
                        label: _("Group name"),
                        labelWidth: 120,
                        name: "group_name",
                        invalidMessage: _("must be filled")
                    },
                    { view: "spacer" },
                    {
                        view: "button",
                        localId: "saveBtn",
                        type: "form",
                        label: "Add group",
                        click: () => {
                            if (this._mode === "edit") {
                                this.editGroup();
                            } else {
                                this.addGroup();
                            }

                        }
                    },
                    {
                        view: "button",
                        label: _("Cancel"),
                        click: () => {
                            this.hideWindow();
                        }
                    },
                ],
                rules: addGroup_rules,
            }
        };
    }

    /********************************************************************/
    showWindow(id, group, mode, textConfig) {
        this._mode = mode;
        this.getRoot().show();
        this.changeTextInForm(textConfig);
        if (this._mode === "edit") {
            this.$$("groupForm").setValues(group);
        }
        this.changeTextInForm(textConfig);
    }

    changeTextInForm(textConfig) {
        const _ = this.app.getService("locale")._;
        const header = this.$$("windowHeader");
        const btn = this.$$("saveBtn");
        header.define("template", _(textConfig.header));
        btn.define("label", _(textConfig.saveBtn));
        header.refresh();
        btn.refresh();
    }

    hideWindow() {
        this.$$("groupForm").clear();
        this.$$("groupForm").clearValidation();
        this.getRoot().hide();
    }

    addGroup() {
        if (this.$$("groupForm").validate()) {
            const value = this.$$("groupForm").getValues();
            const format = webix.Date.dateToStr("%d-%m-%Y");
            value.create_date = format(new Date);
            this.app.callEvent("addGroupinList", [value]);
        }
    }

    editGroup() {
        if (this.$$("groupForm").validate()) {
            const value = this.$$("groupForm").getValues();
            this.app.callEvent("editGroupinList", [value]);
        }
    }
}
