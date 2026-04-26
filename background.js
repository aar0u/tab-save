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
    exportTabsAsMarkdown();
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "tabSaveRunNow") {
    setExportAlarm();
    sendResponse({ ok: true });
    return true;
  }
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

    chrome.storage.sync.get([
      "tabSaveRemoteUrl",
      "tabSaveRemoteFailCount",
      "tabSaveMachineId",
      "tabSaveAuthToken"
    ], (result) => {
      const remoteUrl = result.tabSaveRemoteUrl || "http://localhost:3000/api/tabs";
      const failCount = result.tabSaveRemoteFailCount || 0;
      const authToken = (result.tabSaveAuthToken || "changeme").trim();
      let machineId = (result.tabSaveMachineId || "").trim();
      if (!machineId) {
        machineId = "ts-" + Math.random().toString(36).slice(2, 10).toUpperCase();
        chrome.storage.sync.set({ tabSaveMachineId: machineId });
      }
      const FAIL_THRESHOLD = 3;
      const lastCallAt = new Date().toISOString();

      chrome.storage.sync.set({
        tabSaveLastCallAt: lastCallAt,
        tabSaveSyncStatus: "Syncing..."
      });

      fetch(remoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: payload, machine_id: machineId }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          console.log("✅ Tabs exported successfully:", res.status);
          chrome.storage.sync.set({
            tabSaveRemoteFailCount: 0,
            tabSaveSyncStatus: "Success"
          });
        })
        .catch((err) => {
          const newFailCount = failCount + 1;
          let errorObj = { tabSaveRemoteFailCount: newFailCount };
          if (newFailCount >= FAIL_THRESHOLD) {
            errorObj.tabSaveSyncStatus = "Stopped after 3 failed attempts";
            chrome.alarms.clear("exportTabs");
            console.warn("⚠️ Remote server unreachable, alarm stopped.", err);
          } else {
            errorObj.tabSaveSyncStatus = `Warning: failed attempt ${newFailCount}/${FAIL_THRESHOLD}`;
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
      tabSaveSyncStatus: ""
    }, setExportAlarm);
  }
});
