import { JetView } from "webix-jet";

export default class ScoreboardView extends JetView {
    config() {
        const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;
        return {
            rows: [
                {
                    cols: [
                        { view: "spacer" },
                        { template: _("Language"), type: "header", borderless: true, css: "settings-lang-header" },
                        { view: "spacer" },
                    ],
                },
                {
                    view: "segmented",
                    localId: "localizationSegm",
                    options: [
                        { id: "ru", value: "RU" },
                        { id: "en", value: "ENG" },
                    ],
                    value: lang,
                    click: () => {
                        this.toggleLanguage();
                    },
                },
                {
                    view: "spacer"
                }
            ],

        };
    }

    toggleLanguage() {
        const langs = this.app.getService("locale");
        const value = this.$$("localizationSegm").getValue();
		langs.setLang(value);
	}
}
