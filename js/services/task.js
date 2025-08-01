import UI from "./ui.js";
import Storage from "./storage.js";
import Redmine from "./redmine.js";

export default class Task {
    static async create(subjectEl, descriptionEl, spentHoursEl) {
        const { redmineUrl, apiKey, presets, selectedPreset } =
            await Storage.get(["redmineUrl", "apiKey", "presets", "selectedPreset"]);

        if (!redmineUrl || !apiKey || !subjectEl.value.trim()) {
            UI.showMessage("⚠️ Заполни обязательные поля", "warning");
            return;
        }

        const preset = presets.find(p => p.id === selectedPreset);
        if (!preset) {
            UI.showMessage("⚠️ Выбери пресет", "warning");
            return;
        }

        const spentHours = spentHoursEl.value ? parseFloat(spentHoursEl.value) : null;

        try {
            // 1. Создаём задачу
            const createdIssue = await Redmine.createIssue({
                url: redmineUrl,
                apiKey,
                projectId: preset.projectId,
                trackerId: preset.trackerId,
                subject: subjectEl.value.trim(),
                description: descriptionEl.value.trim(),
                assignedToId: preset.assignedToId
            });

            // 2. Если указаны часы → добавляем time entry
            if (spentHours) {
                await Redmine.logTime({
                    url: redmineUrl,
                    apiKey,
                    issueId: createdIssue.issue.id,
                    hours: spentHours,
                    comments: "—"
                });
            }

            UI.showMessage("✅ Задача создана!", "success");
            subjectEl.value = "";
            descriptionEl.value = "";
            spentHoursEl.value = "";
        } catch (err) {
            UI.showMessage("❌ " + err.message, "error");
        }
    }
}
