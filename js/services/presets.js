import UI from "./ui.js";
import Storage from "./storage.js";

export default class Presets {
    static clearForm() {
        document.getElementById("presetName").value = "";
        document.getElementById("presetProjectId").value = "";
        document.getElementById("presetTrackerId").value = "";
        document.getElementById("presetAssignedToId").value = "";
    }

    static async render(presets, selectedId) {
        const presetSelect = document.getElementById("presetSelect");
        const presetsListEl = document.getElementById("presetsList");

        presetSelect.innerHTML = `<option value="">(Не выбран)</option>`;
        presets.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            if (p.id === selectedId) opt.selected = true;
            presetSelect.appendChild(opt);
        });

        presetsListEl.innerHTML = "";
        presets.forEach(p => {
            const div = document.createElement("div");
            div.className = "flex justify-between items-center border border-gray-200 rounded px-2 py-1";
            div.innerHTML = `
        <span>${p.name}</span>
        <button data-id="${p.id}" class="text-red-500 hover:text-red-700 text-xs">Удалить</button>
      `;
            presetsListEl.appendChild(div);
        });

        presetsListEl.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const updated = presets.filter(p => p.id !== id);
                await Storage.set({ presets: updated, selectedPreset: "" });
                this.render(updated, "");
            });
        });
    }

    static async add(presetNameEl, presetProjectIdEl, presetTrackerIdEl, presetAssignedToIdEl) {
        const presets = (await Storage.get(["presets"])).presets || [];

        const newPreset = {
            id: Date.now().toString(),
            name: presetNameEl.value.trim(),
            projectId: presetProjectIdEl.value.trim(),
            trackerId: presetTrackerIdEl.value.trim(),
            assignedToId: presetAssignedToIdEl.value.trim()
        };

        if (!newPreset.name || !newPreset.projectId || !newPreset.trackerId) {
            UI.showMessage("⚠️ Заполни обязательные поля", "warning", "presetStatus");
            return;
        }

        presets.push(newPreset);
        await Storage.set({ presets, selectedPreset: newPreset.id });
        await this.render(presets, newPreset.id);
        this.clearForm();

        UI.showMessage("✅ Пресет добавлен", "success", "presetStatus");
    }
}
