export default class UI {
    static currentPage = "task";

    static showPage(page) {
        ["task", "settings", "presets"].forEach(p => {
            document.getElementById(p + "Page").classList.add("hidden");
        });
        document.getElementById(page + "Page").classList.remove("hidden");

        ["btnTask", "btnSettings", "btnPresets"].forEach(id => {
            document.getElementById(id)?.classList.remove("bg-gray-700");
        });

        const btnMap = {
            task: "btnTask",
            settings: "btnSettings",
            presets: "btnPresets"
        };
        document.getElementById(btnMap[page])?.classList.add("bg-gray-700");

        const pageTitle = document.getElementById("pageTitle");
        pageTitle.textContent =
            page === "task" ? "Новая задача" :
                page === "settings" ? "Настройки" : "Пресеты";

        this.currentPage = page;
    }

    static showMessage(text, type = "info", target = "status") {
        const el = document.getElementById(target);
        if (!el) return;

        const colors = {
            success: "bg-green-100 text-green-700 border border-green-300",
            warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
            error:   "bg-red-100 text-red-700 border border-red-300",
            info:    "bg-gray-100 text-gray-700 border border-gray-300"
        };
        el.className = `mt-3 text-sm px-3 py-2 rounded-md shadow-sm ${colors[type]}`;
        el.classList.remove("hidden");
        el.textContent = text;

        if (target !== "status") {
            setTimeout(() => (el.textContent = ""), 2000);
        }
    }
}
