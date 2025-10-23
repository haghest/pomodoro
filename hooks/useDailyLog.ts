export function updateDailyLog({
  focusMinutes = 0,
  breakMinutes = 0,
  sessionsCompleted = 0,
  tasksCompleted = 0,
}: {
  focusMinutes?: number;
  breakMinutes?: number;
  sessionsCompleted?: number;
  tasksCompleted?: number;
}) {
  if (typeof window === "undefined") return;

  const today = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem("productivityLog");
  const logs = stored ? JSON.parse(stored) : {};

  if (!logs[today]) {
    logs[today] = {
      date: today,
      focusMinutes: 0,
      breakMinutes: 0,
      sessionsCompleted: 0,
      tasksCompleted: 0,
    };
  }

  logs[today].focusMinutes += focusMinutes;
  logs[today].breakMinutes += breakMinutes;
  logs[today].sessionsCompleted += sessionsCompleted;
  logs[today].tasksCompleted += tasksCompleted;

  localStorage.setItem("productivityLog", JSON.stringify(logs));
}
