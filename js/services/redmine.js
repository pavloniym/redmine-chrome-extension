export default class Redmine {
    static async createIssue({ url, apiKey, projectId, trackerId, subject, description, assignedToId }) {
        const issue = {
            project_id: projectId,
            tracker_id: parseInt(trackerId, 10),
            subject,
            description
        };
        if (assignedToId) issue.assigned_to_id = parseInt(assignedToId, 10);

        const response = await fetch(`${url}/issues.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Redmine-API-Key": apiKey
            },
            body: JSON.stringify({ issue })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Ошибка ${response.status}: ${text}`);
        }

        return response.json();
    }

    static async logTime({ url, apiKey, issueId, hours, comments }) {
        const response = await fetch(`${url}/time_entries.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Redmine-API-Key": apiKey
            },
            body: JSON.stringify({
                time_entry: {
                    issue_id: issueId,
                    hours,
                    comments
                }
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Ошибка логирования времени ${response.status}: ${text}`);
        }

        return response.json();
    }
}
