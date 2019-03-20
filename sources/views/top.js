import { JetView, plugins } from "webix-jet";
import regform from "views/reg_form";
import { serverUrl } from "models/serverUrl";

const menu_size = {
    width: 180,
};

const button_log_size = {
    width: 150,
};

export default class TopView extends JetView {
    config() {
        const menu = {
            view: "menu",
            id: "top:menu",
            width: menu_size.width,
            layout: "y",
            select: true,
            template: "<span class='webix_icon #icon#'></span> #value# ",
            data: [
                { value: "My words", id: "words", icon: "wxi-columns" },
                { value: "Data", id: "data", icon: "wxi-pencil" },
            ],
            on: {
                onAfterSelect: (id) => {
                    this.changeHeader(id);
                }
            },
        };

        const ui = {
            localId: "topUi",
            rows: [
                {
                    cols: [
                        { localId: "header", template: "Contacts", type: "header" },
                        {
                            view: "button",
                            label: "Log out",
                            type: "form",
                            width: button_log_size.width,
                            click: () => {
                                this.logOut();
                            }
                        },
                    ],
                },
                {
                    cols: [
                        menu,
                        { $subview: true },
                    ]
                },
            ]
        };

        return ui;
    }

    /****************************************************************/
    init() {
        this.use(plugins.Menu, "top:menu");

        this.on(this.app, "showTopView", () => {
            this.$$("topUi").show();
        });
        this.on(this.app, "hideTopView", () => {
            this.$$("topUi").hide();
        });

        this.on(this.app, "changeAccess", () => {
            this.app.callEvent("hideTopView");
            this.app.callEvent("clearViews");
            this.popupWindowForm.showWindow();
        });

        this.on(this.app, "checkSession", () => {
            this.checkSession();
        });

        this.popupWindowForm = this.ui(regform);
        this.app.callEvent("hideTopView");
        this.app.callEvent("checkSession");
    }

    changeHeader(id) {
        const header = this.$$("header");
        header.define({ template: this.$$("top:menu").getItem(id).value });
        header.refresh();
    }

    checkSession() {
        fetch(`${serverUrl}checkSession`)
            .then(response => response.json())
            .then(json => {
                if (json.status === "accessOK") {
                    this.popupWindowForm.hideWindow();
                    this.app.callEvent("showTopView");
                } else {
                    this.popupWindowForm.showWindow();
                    this.app.callEvent("hideTopView");
                }
            }).catch(() => {
                webix.message("Server error, try later");
            });
    }

    logOut() {
        fetch(`${serverUrl}logout`)
            .then(response => response.json())
            .then(json => {
                if (json.status === "logOutSuccess") {
                    this.app.callEvent("hideTopView");
                    this.app.callEvent("clearViews");
                    this.popupWindowForm.showWindow();
                } else {
                    this.app.callEvent("changeAccess");
                }
            })
            .catch(() => {
                webix.message("Server error, try later");
            });
    }
}
