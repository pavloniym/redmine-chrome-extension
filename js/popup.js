import UI from "./services/ui.js";
import Task from "./services/task.js";
import Storage from "./services/storage.js";
import Presets from "./services/presets.js";

document.addEventListener("DOMContentLoaded", async () => {
    const subjectEl = document.getElementById("subject");
    const descriptionEl = document.getElementById("description");
    const spentHoursEl = document.getElementById("spentHours"); // 👈 добавили
    const presetSelect = document.getElementById("presetSelect");

    const redmineUrlEl = document.getElementById("redmineUrl");
    const apiKeyEl = document.getElementById("apiKey");

    const presetNameEl = document.getElementById("presetName");
    const presetProjectIdEl = document.getElementById("presetProjectId");
    const presetTrackerIdEl = document.getElementById("presetTrackerId");
    const presetAssignedToIdEl = document.getElementById("presetAssignedToId");

    const saved = await Storage.get(["redmineUrl", "apiKey", "presets", "selectedPreset"]);
    if (saved.redmineUrl) redmineUrlEl.value = saved.redmineUrl;
    if (saved.apiKey) apiKeyEl.value = saved.apiKey;

    let presets = saved.presets || [];
    let selectedPreset = saved.selectedPreset || "";
    Presets.render(presets, selectedPreset);

    document.getElementById("btnTask").addEventListener("click", () => UI.showPage("task"));
    document.getElementById("btnPresets").addEventListener("click", () => UI.showPage("presets"));
    document.getElementById("btnSettings").addEventListener("click", () => UI.showPage("settings"));

    document.getElementById("saveSettings").addEventListener("click", async () => {
        await Storage.set({
            redmineUrl: redmineUrlEl.value.trim(),
            apiKey: apiKeyEl.value.trim()
        });
        UI.showMessage("✅ Сохранено", "success", "settingsStatus");
    });

    document.getElementById("addPreset").addEventListener("click", async () => {
        await Presets.add(presetNameEl, presetProjectIdEl, presetTrackerIdEl, presetAssignedToIdEl);
    });

    presetNameEl.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            Presets.add(presetNameEl, presetProjectIdEl, presetTrackerIdEl, presetAssignedToIdEl);
        }
    });

    presetSelect.addEventListener("change", async () => {
        selectedPreset = presetSelect.value;
        await Storage.set({ selectedPreset });
        const activePreset = presets.find(p => p.id === selectedPreset);
        document.getElementById("pageTitle").textContent = activePreset
            ? `Новая задача — [${activePreset.name}]`
            : "Новая задача";
    });

    document.getElementById("createTask").addEventListener("click", async () => {
        await Task.create(subjectEl, descriptionEl, spentHoursEl);
    });

    subjectEl.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            Task.create(subjectEl, descriptionEl, spentHoursEl);
        }
    });
});
