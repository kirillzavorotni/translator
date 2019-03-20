import { JetView } from "webix-jet";
import { serverUrl } from "models/serverUrl";

const formSize = {
    width: 500,
    height: 300,
    margin: 5,
};

const transformBtn_size = {
    width: 100,
};

const reg_rules = {
    userName: webix.rules.isNotEmpty,
    userEmail: webix.rules.isEmail,
    userPass: webix.rules.isNotEmpty,
};

export default class RegFormView extends JetView {
    config() {
        return {
            view: "window",
            localId: "windowForm",
            head: {
                localId: "windowHeader",
                cols: [
                    { view: "spacer" },
                    {
                        view: "label",
                        label: "Registration",
                        localId: "headText",
                    },
                    {
                        view: "button",
                        label: "Log-in",
                        localId: "transform-btn",
                        width: transformBtn_size.width,
                        click: () => {
                            if (this._formIndicate === "reg") {
                                this.logTransform();
                            } else {
                                this.regTransform();
                            }
                            this.defineTemplate("");
                        }
                    },
                ],
            },
            position: "center",
            modal: true,
            body: {
                rows: [
                    {
                        view: "form",
                        localId: "userForm",
                        margin: formSize.margin,
                        width: formSize.width,
                        height: formSize.height,
                        elements: [
                            {
                                view: "text",
                                localId: "user_name",
                                label: "Login",
                                name: "userName",
                                placeholder: "Type username",
                                invalidMessage: "must be filled"
                            },
                            {
                                view: "text",
                                label: "Email",
                                localId: "userEmail",
                                name: "userEmail",
                                placeholder: "Type email",
                                invalidMessage: "must be Email"
                            },
                            {
                                view: "text",
                                type: "password",
                                localId: "userPassword",
                                label: "Password",
                                name: "userPass",
                                placeholder: "Type password",
                                invalidMessage: "must be fill"
                            },
                            {
                                view: "template",
                                localId: "messageTemplate",
                                type: "clean",
                                template: "",
                            },
                            {
                                view: "button",
                                localId: "sendBtn",
                                type: "form",
                                label: "Register",
                                click: () => {
                                    if (this._formIndicate === "reg") {
                                        this.regData();
                                    } else {
                                        this.logData();
                                    }
                                },
                            },
                        ],
                        rules: reg_rules,
                    },
                ],
            }
        };
    }

    /********************************************************************/
    init() {
        this._formIndicate = "reg";
    }

    showWindow() {
        this.regTransform();
        this.getRoot().show();
    }

    hideWindow() {
        this.$$("userForm").clear();
        this.getRoot().hide();
    }

    regData() {
        const form = this.$$("userForm");
        if (form.validate()) {
            const value = form.getValues();
            fetch(`${serverUrl}register`, { method: "POST", body: JSON.stringify(value) })
                .then(response => response.json())
                .then(json => {

                    if (json.status === "regOK") {
                        this.defineTemplate("");
                        form.clear();
                        form.clearValidation();
                        this.hideWindow();
                        this.app.callEvent("showTopView");
                        this.app.callEvent("fillViews");
                    } else {
                        form.clear();
                        form.clearValidation();
                        this.defineTemplate(this.getTemplate(json.messages));
                        form.setValues(json.formData);
                    }

                })
                .catch(() => {
                    webix.message("Server error, try again");
                });
        }
    }

    defineTemplate(str) {
        this.$$("messageTemplate").define("template", str);
        this.$$("messageTemplate").refresh();
    }

    getTemplate(messages) {
        let str = "";
        if (messages.isUser) {
            return `<div class="form-template-wrapp">
                        <p class='form-message'>${messages.isUser}</p>
                    </div>`;
        }
        for (let key in messages) {
            str += `<p class='form-message'>${messages[key]}</p>`;
        }
        return `<div class="form-template-wrapp">${str}</div>`;
    }

    logData() {
        const form = this.$$("userForm");
        const value = form.getValues();
        delete value.userName;

        if (form.validate()) {
            fetch(`${serverUrl}login`, { method: "POST", body: JSON.stringify(value) })
                .then(response => response.json())
                .then(json => {

                    if (json.status === "logOK") {
                        this.defineTemplate("");
                        form.clear();
                        form.clearValidation();
                        this.hideWindow();
                        this.app.callEvent("showTopView");
                        this.app.callEvent("fillViews");
                    } else {
                        form.clear();
                        form.clearValidation();
                        this.defineTemplate(this.getTemplate(json.messages));
                        form.setValues(json.formData);
                    }

                }).catch(() => {
                    webix.message("Server error, try again");
                });;
        }
    }

    regTransform() {
        this.changeForm("Registration", "Log", "Register", "show");
        this._formIndicate = "reg";
    }

    logTransform() {
        this.changeForm("Log-in", "Reg", "Log-in", "hide");
        this._formIndicate = "log";
    }

    changeForm(head, transBtn, send, view) {
        const headText = this.$$("headText");
        const transformBtn = this.$$("transform-btn");
        const sendBtn = this.$$("sendBtn");
        const login = this.$$("user_name");

        if (view === "hide") {
            login.hide();
        } else {
            login.show();
        }

        headText.define("label", head);
        transformBtn.define("label", transBtn);
        sendBtn.define("label", send);

        headText.refresh();
        transformBtn.refresh();
        sendBtn.refresh();
    }
}


