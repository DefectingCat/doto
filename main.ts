import { LinkPreviewField } from "extension";
import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
// Remember to rename these classes and interfaces!

interface DotoSettings {
    parseUrl: string;
}
const DEFAULT_SETTINGS: DotoSettings = {
    parseUrl: "http://iframely.server.crestify.com/iframely?url=",
};

export default class Doto extends Plugin {
    settings: DotoSettings;

    async onload() {
        this.registerEditorExtension([LinkPreviewField]);

        this.addSettingTab(new DotoSettingTab(this.app, this));
    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class DotoSettingTab extends PluginSettingTab {
    constructor(
        app: App,
        public plugin: Doto,
    ) {
        super(app, plugin);
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("URL parse API")
            .setDesc(
                `The api parseurl to matedata, default: ${DEFAULT_SETTINGS.parseUrl}`,
            )
            .addText((text) =>
                text
                    .setPlaceholder("Enter your API address")
                    .setValue(this.plugin.settings.parseUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.parseUrl = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}
