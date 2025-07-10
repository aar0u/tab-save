function save_options() {
    var output1 = document.getElementById("output1").value;
    var output2 = document.getElementById("output2").value;
    var emailadd = document.getElementById("emailadded").value;
    var remoteUrl = document.getElementById("remoteUrl").value.trim();
    var exportInterval = parseInt(document.getElementById("exportInterval").value, 10) || 5;

    chrome.storage.sync.set({
        output_choice1: output1,
        output_choice2: output2,
        output_emailadd: emailadd,
        tabSaveRemoteUrl: remoteUrl,
        exportInterval: exportInterval
    }, function() {
        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function () {
            status.innerHTML = "";
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get([
        "output_choice1", "output_choice2", "output_emailadd",
        "tabSaveRemoteUrl", "exportInterval"
    ], function(syncResult) {
        var favorite1 = syncResult.output_choice1;
        if (favorite1) {
            var select = document.getElementById("output1");
            for (var i = 0; i < select.children.length; i++) {
                var child = select.children[i];
                if (child.value == favorite1) {
                    child.selected = "true";
                    break;
                }
            }
        }
        var favorite2 = syncResult.output_choice2;
        if (favorite2) {
            var select = document.getElementById("output2");
            for (var i = 0; i < select.children.length; i++) {
                var child = select.children[i];
                if (child.value == favorite2) {
                    child.selected = "true";
                    break;
                }
            }
        }
        // 恢复 email
        var emailadd = syncResult.output_emailadd || "";
        document.getElementById("emailadded").value = emailadd;
        // 恢复 remote settings
        document.getElementById("remoteUrl").value = syncResult.tabSaveRemoteUrl || "http://localhost:3000/tabs";
        document.getElementById("exportInterval").value = syncResult.exportInterval || 5;
        displayRemoteError();
    });
}

function displayRemoteError() {
    chrome.storage.sync.get(["tabSaveRemoteErrorMsg"], function(result) {
        var errorElem = document.getElementById("remoteErrorMsg");
        if (result.tabSaveRemoteErrorMsg) {
            errorElem.textContent = result.tabSaveRemoteErrorMsg;
            errorElem.style.display = "block";
        } else {
            errorElem.textContent = "";
            errorElem.style.display = "none";
        }
    });
}

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === "sync" && changes.tabSaveRemoteErrorMsg) {
        displayRemoteError();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    restore_options();
    document.getElementById('save').addEventListener('click', save_options);
    document.getElementById('output1').addEventListener('change', save_options);
    document.getElementById('output2').addEventListener('change', save_options);
});