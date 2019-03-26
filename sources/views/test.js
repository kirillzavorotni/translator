import { JetView } from "webix-jet";
import { serverUrl } from "models/serverUrl";

export default class TestView extends JetView {
    config() {
        const _ = this.app.getService("locale")._;
        const form = {
            view: "form",
            localId: "testForm",
            css: "test-form",
            autoheight: false,
            elements: [
                {
                    rows: [
                        {
                            localId: "taskRow1",
                            rows: [
                                {
                                    cols: [
                                        { view: "spacer" },
                                        { template: "Word 1", localId: "word1", height: 40, css: "task-word", borderless: true },
                                        { view: "spacer" },
                                    ],
                                },
                                {
                                    localId: "aButtonsWrap",
                                    cols: [
                                        { view: "button", localId: "1Btn1", type: "form", label: "translate 1", },
                                        { view: "button", localId: "1Btn2", type: "form", label: "translate 2", },
                                        { view: "button", localId: "1Btn3", type: "form", label: "translate 3", },
                                        { view: "button", localId: "1Btn4", type: "form", label: "translate 4", },
                                    ],
                                },
                            ],
                        },
                        {
                            localId: "taskRow2",
                            rows: [
                                {
                                    cols: [
                                        { view: "spacer" },
                                        { template: "Word 2", localId: "word2", height: 40, css: "task-word", borderless: true },
                                        { view: "spacer" },
                                    ],
                                },
                                {
                                    localId: "bButtonsWrap",
                                    cols: [
                                        { view: "button", localId: "2Btn1", type: "form", label: "translate 1", },
                                        { view: "button", localId: "2Btn2", type: "form", label: "translate 2", },
                                        { view: "button", localId: "2Btn3", type: "form", label: "translate 3", },
                                        { view: "button", localId: "2Btn4", type: "form", label: "translate 4", },
                                    ],
                                },
                            ],
                        },
                        {
                            localId: "taskRow3",
                            rows: [
                                {
                                    cols: [
                                        { view: "spacer" },
                                        { template: "Word 3", localId: "word3", height: 40, css: "task-word", borderless: true },
                                        { view: "spacer" },
                                    ],
                                },
                                {
                                    localId: "cButtonsWrap",
                                    cols: [
                                        { view: "button", localId: "3Btn1", type: "form", label: "translate 1", },
                                        { view: "button", localId: "3Btn2", type: "form", label: "translate 2", },
                                        { view: "button", localId: "3Btn3", type: "form", label: "translate 3", },
                                        { view: "button", localId: "3Btn4", type: "form", label: "translate 4", },
                                    ],
                                },
                            ],
                        },
                        {
                            localId: "taskRow4",
                            rows: [
                                {
                                    cols: [
                                        { view: "spacer" },
                                        { template: "Word 4", localId: "word4", height: 40, css: "task-word", borderless: true },
                                        { view: "spacer" },
                                    ],
                                },
                                {
                                    localId: "dButtonsWrap",
                                    cols: [
                                        { view: "button", localId: "4Btn1", type: "form", label: "translate 1", },
                                        { view: "button", localId: "4Btn2", type: "form", label: "translate 2", },
                                        { view: "button", localId: "4Btn3", type: "form", label: "translate 3", },
                                        { view: "button", localId: "4Btn4", type: "form", label: "translate 4", },
                                    ],
                                },
                            ],
                        },
                        {
                            localId: "taskRow5",
                            rows: [
                                {
                                    cols: [
                                        { view: "spacer" },
                                        { template: "Word 5", localId: "word5", height: 40, css: "task-word", borderless: true },
                                        { view: "spacer" },
                                    ],
                                },
                                {
                                    localId: "eButtonsWrap",
                                    cols: [
                                        { view: "button", localId: "5Btn1", type: "form", label: "translate 1", },
                                        { view: "button", localId: "5Btn2", type: "form", label: "translate 2", },
                                        { view: "button", localId: "5Btn3", type: "form", label: "translate 3", },
                                        { view: "button", localId: "5Btn4", type: "form", label: "translate 4", },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ]
        };

        const word_chooser = {
            view: "richselect",
            label: _("Choose word group"),
            localId: "chooser",
            css: "group-chooser",
            labelWidth: 160,
            labelPosition: "top",
            labelAlign: "center",
            autoHeight: false,
            suggest: {
                url: `${serverUrl}groups`,
                body: {
                    template: "#group_name#"
                }
            },
        };

        return {
            rows: [
                {
                    cols: [
                        {},
                        word_chooser,
                        {},
                    ],
                },
                {
                    localId: "startBtnRow",
                    cols: [
                        { view: "spacer" },
                        {
                            view: "button",
                            type: "form",
                            css: "start-test-btn",
                            label: _("Start test"),
                            click: () => {
                                this.getWords();
                            }
                        },
                        { view: "spacer" },
                    ],
                },
                form,
                {
                    cols: [
                        {
                            view: "button",
                            localId: "endTask",
                            css: "end-test-btn",
                            type: "form",
                            label: _("End test"),
                            width: 150,
                            click: () => {
                                this.endTest();
                            }
                        },
                        {
                            view: "button",
                            localId: "restartTask",
                            type: "form",
                            css: "restart-test-btn",
                            label: _("Restart test"),
                            width: 150,
                            click: () => {
                                this.refresh();
                            }
                        },
                        { view: "spacer" },
                    ],
                },
            ],
        };
    }

    /********************************************************************/
    init() {
        const events = ["addGroupinList", "addWordToTable", "editWordinTable", "editGroupinList"];
        for (let i = 0; i < events.length; i++) {
            this.app.detachEvent(events[i]);
        }
        for (let i = 1; i <= 5; i++) {
            this.$$(`taskRow${i}`).hide();
        }
        this.$$("endTask").disable();
        this.$$("restartTask").disable();

        fetch(`${serverUrl}checkSession`)
            .then(response => response.json())
            .then(json => {
                if (json.status !== "accessOK") {
                    this.app.callEvent("changeAccess");
                    this.show("/top/words");
                }
            }).catch(() => {
                webix.message("Server error, try later");
            });
    }

    startTest(json) {
        // const parts_sp = ["Noun", "Verb", "Adjective", "Numeral", "Pronoun", "Adverb", "Article", "Preposition", "Conjunction", "Interjection"];
        const words = {};
        const globalWordsID = [];

        this._currentScore = [];
        this._maxCurrentResult = [];

        let taskCount = (json.length >= 5) ? 5 : json.length;
        const wordIterator = taskCount;

        for (let i = 0; i < json.length; i++) {
            words[json[i].id] = [json[i].value, json[i].translate, json[i].part_id - 1];
            globalWordsID.push(json[i].id);
        }

        for (let i = 1; i <= wordIterator; i++) {

            if (globalWordsID.length) {
                this.$$(`taskRow${i}`).show();
            }

            const numBtns = [1, 2, 3, 4];
            const wordsID = globalWordsID.slice();
            const randIndexWordsID = Math.floor(Math.random() * wordsID.length);
            this[`_rightNumWord${i}`] = wordsID.splice(randIndexWordsID, 1)[0];

            globalWordsID.splice(randIndexWordsID, 1);

            this.$$(`word${i}`).define("template", words[this[`_rightNumWord${i}`]][0]);
            this.$$(`word${i}`).refresh();

            for (let j = 0; j < wordsID.length; j++) {
                if (words[wordsID[j]][2] !== words[this[`_rightNumWord${i}`]][2]) {
                    wordsID.splice(j, 1);
                    j--;
                }
            }

            const randIndexBtn = Math.floor(Math.random() * numBtns.length);
            const rightNumBtn = numBtns.splice(randIndexBtn, 1)[0];
            this[`_${i}Btn${rightNumBtn}`] = this[`_rightNumWord${i}`];
            this.$$(`${i}Btn${rightNumBtn}`).define("label", words[this[`_rightNumWord${i}`]][1]);
            this.$$(`${i}Btn${rightNumBtn}`).refresh();

            if (words[this[`_rightNumWord${i}`]][2] === 0 || words[this[`_rightNumWord${i}`]][2] === 1) {
                this._maxCurrentResult.push(2);
            } else {
                this._maxCurrentResult.push(1);
            }

            this.$$(`${i}Btn${rightNumBtn}`).attachEvent("onItemClick", () => {
                webix.message({
                    text: "Excellent! This answer is true!",
                    type: "success ",
                });

                if (words[this[`_rightNumWord${i}`]][2] === 0 || words[this[`_rightNumWord${i}`]][2] === 1) {
                    this._currentScore.push(2);
                } else {
                    this._currentScore.push(1);
                }

                for (let j = 1; j <= 4; j++) {
                    this.$$(`${i}Btn${j}`).disable();
                }

                taskCount--;
                if (taskCount === 0) {
                    const res = this._currentScore.reduce((sum, cur) => sum + cur);
                    const maxResult = this._maxCurrentResult.reduce((sum, cur) => sum + cur);
                    this.$$("endTask").disable();
                    this.setScore(res, maxResult);
                    webix.alert({
                        title: "Test result",
                        ok: "Ok",
                        text: `${res} out of ${maxResult}`,
                        callback: () => {
                            this.$$("restartTask").enable();
                        }
                    });
                }
            });

            while (numBtns.length > 0) {
                const randomIndexBtn = Math.floor(Math.random() * numBtns.length);
                const randNumBtn = numBtns.splice(randomIndexBtn, 1)[0];

                if (!wordsID.length) {
                    this.$$(`${i}Btn${randNumBtn}`).define("label", "");
                    this.$$(`${i}Btn${randNumBtn}`).refresh();
                    this.$$(`${i}Btn${randNumBtn}`).disable();
                } else {
                    const wordIndexRandom = Math.floor(Math.random() * wordsID.length);
                    const wordValueRandom = wordsID.splice(wordIndexRandom, 1)[0];

                    this[`_${i}Btn${randNumBtn}`] = wordValueRandom;

                    this.$$(`${i}Btn${randNumBtn}`).define("label", words[this[`_${i}Btn${randNumBtn}`]][1]);
                    this.$$(`${i}Btn${randNumBtn}`).refresh();

                    this.$$(`${i}Btn${randNumBtn}`).attachEvent("onItemClick", () => {
                        webix.message({
                            text: "Incorrect answer :(",
                            type: "error",
                        });

                        this._currentScore.push(0);

                        for (let j = 1; j <= 4; j++) {
                            this.$$(`${i}Btn${j}`).disable();
                        }

                        taskCount--;
                        if (taskCount === 0) {
                            const res = this._currentScore.reduce((sum, cur) => sum + cur);
                            const maxResult = this._maxCurrentResult.reduce((sum, cur) => sum + cur);
                            this.$$("endTask").disable();
                            this.setScore(res, maxResult);
                            webix.alert({
                                title: "Test result",
                                ok: "Ok",
                                text: `${res} out of ${maxResult}`,
                                callback: () => {
                                    this.$$("restartTask").enable();
                                }
                            })
                        }
                    });
                }
            }
        }
    }

    getWords() {
        const groupId = this.$$("chooser").getValue();

        if (groupId) {
            this.$$("chooser").disable();
            this.$$("startBtnRow").disable();

            fetch(`${serverUrl}words/test_words`, { method: "POST", body: JSON.stringify({ group_id: groupId }) })
                .then(response => response.json())
                .then(json => {
                    if (json.length) {
                        this.startTest(json);
                        this.$$("endTask").enable();
                    } else {
                        this.$$("chooser").enable();
                        this.$$("startBtnRow").enable();
                        webix.message("Pleace, add words to this group!");
                    }
                })
                .catch(() => {
                    this.$$("chooser").enable();
                    this.$$("startBtnRow").enable();
                    webix.message("Server error, pleace try again!");
                });
        } else {
            webix.message("Pleace, select word group!");
        }
    }

    endTest() {
        webix.confirm({
            title: "End test",
            text: "Do You want to end this test?",
            type: "confirm-warning",
            callback: (result) => {
                if (result) {
                    this.refresh();
                }
            }
        });

    }

    setScore(res, maxResult) {
        const format = webix.Date.dateToStr("%d-%M-%Y %G:%i:%s");
        const curDate = format(new Date());

        fetch(`${serverUrl}score/add`, { method: "POST", body: JSON.stringify({ date: curDate, score: res, out_of: maxResult }) })
            .then(response => response.json())
            .then(json => {
                if (json.status) {
                    this.app.callEvent("changeAccess");
                    this.show("/top/words");
                }
            })
            .catch(() => {
                webix.message("Server error, pleace try again!");
            });
    }
}
