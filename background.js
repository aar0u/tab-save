chrome.runtime.onInstalled.addListener(() => {
  console.log("extension installed");
  setExportAlarm();
});

chrome.runtime.onStartup && chrome.runtime.onStartup.addListener(() => {
  console.log("extension started");
  setExportAlarm();
});

function setExportAlarm() {
  chrome.storage.sync.get(["exportInterval"], (result) => {
    const interval = parseInt(result.exportInterval, 10) || 5;
    chrome.alarms.create("exportTabs", { periodInMinutes: interval });
    console.log("alarm set for every", interval, "minutes");
  });
}

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

    chrome.storage.sync.get([
      "tabSaveRemoteUrl",
      "tabSaveRemoteFailCount",
      "tabSaveRemoteErrorMsg"
    ], (result) => {
      const remoteUrl = result.tabSaveRemoteUrl || "http://localhost:3000/tabs";
      const failCount = result.tabSaveRemoteFailCount || 0;
      const FAIL_THRESHOLD = 3;

      fetch(remoteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      })
        .then((res) => {
          console.log("✅ Tabs exported successfully:", res.status);
          chrome.storage.sync.set({
            tabSaveRemoteFailCount: 0,
            tabSaveRemoteErrorMsg: ""
          });
        })
        .catch((err) => {
          const newFailCount = failCount + 1;
          let errorObj = { tabSaveRemoteFailCount: newFailCount };
          if (newFailCount >= FAIL_THRESHOLD) {
            errorObj.tabSaveRemoteErrorMsg = "Stopped: unreachable after 3 failed attempts";
            chrome.alarms.clear("exportTabs");
            console.warn("⚠️ Remote server unreachable, alarm stopped.", err);
          } else {
            errorObj.tabSaveRemoteErrorMsg = "";
            console.warn("⚠️ Warning:", err);
          }
          chrome.storage.sync.set(errorObj);
        });
    });
  });
}

// Listen for remote URL changes, reset failure count and error status, and restart alarm
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "sync" && changes.tabSaveRemoteUrl) {
    chrome.storage.sync.set({
      tabSaveRemoteFailCount: 0,
      tabSaveRemoteErrorMsg: ""
    }, setExportAlarm);
  }
});
