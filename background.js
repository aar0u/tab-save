chrome.runtime.onInstalled.addListener(() => {
  console.log("alarm extension installed");
  // Every 5 minutes, trigger the alarm
  chrome.alarms.create("exportTabs", { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("alarm triggered:", alarm.name);
  if (alarm.name === "exportTabs") {
    exportTabsAsMarkdown();
  }
});

function exportTabsAsMarkdown() {
  chrome.tabs.query({}, function (tabs) {
    const markdown = tabs
      .map((tab) => `- [${tab.title}](${tab.url})`)
      .join("\n");
    const now = new Date().toLocaleString();
    const payload = `### 📌 ${now}\n\n${markdown}\n\n---\n`;

    const remoteUrl =
      localStorage["tabSaveRemoteUrl"] || "http://localhost:3000/tabs";
    fetch(remoteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: payload }),
    })
      .then((res) => {
        console.log("✅ Tabs exported successfully:", res.status);
      })
      .catch((err) => console.error("❌ Error:", err));
  });
}
