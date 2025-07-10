//<!-- yalllinks, an example of a google chrome extension -->
//<!-- (C) Timothy Jones, October 2013 -->
//<!-- GNU Public license applies -->
//back = chrome.extension.getBackgroundPage();
var myCsv = '';
var contents;
var openthistab = false;
var openthese = [];

function geturls() {
    var favorite1 = localStorage["output_choice1"];
    if (!favorite1) {
        var favorite1 = "text";
    }
    var favorite2 = localStorage["output_choice2"];
    if (!favorite2) {
        var favorite2 = "screen";
    }
    var emailadd = localStorage["output_emailadd"];
    if (!emailadd) {
        var emailadd = "";
    }
    if (favorite1 == "clipa") {
        window.myCsv = '';
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    window.myCsv += tab.url + '\n';
                }
            });
            copyToClipboard(window.myCsv).then(() => { document.getElementById('getgone').innerHTML = "URLs copied!"; });
        });
    }
    ///////////////////////////////// End clipboard

    if (favorite1 == "clipb") {
        window.myCsv = '';
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            window.myCsv = "URL list from ";
            window.myCsv += monthname[currentTime.getMonth()] + ". " + day + " " + year + " " + hours + ":" + minutes + "\n\n";
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    window.myCsv += tab.title + ':\n' + tab.url + '\n\n';
                }
            });

            copyToClipboard(window.myCsv).then(() => { document.getElementById('getgone').innerHTML = "URLs copied!"; });

        });

    }
    ///////////////////////////////// End clipboard

    if (favorite1 == "text") {
        window.myCsv = '';
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            if (favorite2 == "file") {
                window.myCsv = "URL list from ";
                window.myCsv += monthname[currentTime.getMonth()] + ". " + day + " " + year + " " + hours + ":" + minutes + "\n\n";
            }
            if (favorite2 == "screen") {
                document.write("<h3>URL list from ");
                document.write(monthname[currentTime.getMonth()] + ". ");
                document.write(day + " " + year);
                document.write(" ");
                document.write(hours + ":" + minutes + " ");
                document.write(`<a style="color: #9d0000; text-decoration: none; font-weight: normal" 
                href="popup.html">&lt; back</a></h3>`);
                document.write("To copy this list, type [Ctrl] A, then type [Ctrl] C. <br/><br/>");
            }
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    if (favorite2 == "screen") {
                        document.write("<b>" + tab.title + "</b>" + "<br/><a href='" + tab.url + "'>" + tab.url + "</a><br/><br/>");
                    }
                    if (favorite2 == "file") {
                        window.myCsv += tab.title + ':\n' + tab.url + '\n\n';
                    }
                }
            });
            if (favorite2 == "file") {
                download('txt', window.myCsv);
            }
        });
    }

    ///////////////////////////////// End text begin gmail
    if (favorite1 == "gmail") {
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            var subjectall = "URL List from ";
            subjectall += monthname[currentTime.getMonth()] + ". " + day + " " + year + " " + hours + ":" + minutes + " ";
            // var action_url = "mailto:?"+"subject="+encodeURIComponent(subjectall)+"&"+"body=";
            var action_url = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&source=mailto&to=" + emailadd + "&su=" + encodeURIComponent(subjectall) + "&" + "body=";
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                // exclude chrome links   
                if (checkUrl(temptest[0])) {
                    // action_url+=encodeURIComponent(tab.title)+"+"+encodeURIComponent("\n\n")+"+"+encodeURIComponent(tab.url)+"+"+encodeURIComponent("\n\n")+"+";
                    action_url += encodeURIComponent(tab.url) + "+" + encodeURIComponent("\n\n") + "+";
                }
            });
            // var gmaillink = "https://mail.google.com/mail/?extsrc=mailto&url=%s"
            // action_url = gmaillink.replace("%s",encodeURIComponent(action_url));
            chrome.tabs.create({ url: action_url });
        });
    }

    if (favorite1 == "gmail2") {
        window.myCsv = '';
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            var subjectall = "URL List from ";
            subjectall += monthname[currentTime.getMonth()] + ". " + day + " " + year + " " + hours + ":" + minutes + " ";
            // var action_url = "mailto:?"+"subject="+encodeURIComponent(subjectall)+"&"+"body=";
            var action_url = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&source=mailto&to=" + emailadd + "&su=" + encodeURIComponent(subjectall) + "&" + "body=";

            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    window.myCsv += tab.title + ':\n' + tab.url + '\n\n';
                }
            });

            copyToClipboard(window.myCsv).then(() => { document.getElementById('getgone').innerHTML = "URLs copied!"; });

            chrome.tabs.create({ url: action_url });
        });
    }
    if (favorite1 == "simple") {
        window.myCsv = '';
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    if (favorite2 == "screen") {
                        document.write("<a href='" + tab.url + "'>" + tab.url + "</a><br/>");
                    }
                    if (favorite2 == "file") {
                        window.myCsv += tab.url + '\n';
                    }
                }
            });

            if (favorite2 == "file") {
                download('txt', window.myCsv);
            }
        });

    }
    //////////////////////////////////////////////
    if (favorite1 == "csv1") {
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            window.myCsv = '';
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    if (favorite2 == "screen") {
                        document.write('<b>"' + tab.title + '"</b>,"<a href="' + tab.url + '">' + tab.url + '</a>"<br/>');
                    }
                    if (favorite2 == "file") {
                        window.myCsv += '"' + tab.title + '","' + tab.url + '"\n';
                    }
                }
            });
            if (favorite2 == "file") {
                download('csv', window.myCsv);
            }
        });
    }
    /////////////////////////////////////////////////
    if (favorite1 == "csv2") {

        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            window.myCsv = '';
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    if (favorite2 == "screen") {
                        document.write('"' + monthname[currentTime.getMonth()] + '. ' + day + ' ' + year + '", <b>"' + tab.title + '"</b>,"<a href="' + tab.url + '">' + tab.url + '</a>"<br/>');
                    }
                    if (favorite2 == "file") {
                        window.myCsv += '"' + monthname[currentTime.getMonth()] + '. ' + day + ' ' + year + '","' + tab.title + '","' + tab.url + '"\n';
                    }
                }
            });
            if (favorite2 == "file") {
                download('csv', window.myCsv);
            }
        });
    }
    ///////////////////////////////////////////////////////////
    if (favorite1 == "csv3") {
        chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
            window.myCsv = '';
            var curDate = new Date();
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var wday = currentTime.getDay();
            var year = currentTime.getFullYear();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            if (minutes < 10) { minutes = "0" + minutes; }
            var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
            tabs.forEach(function (tab) {
                var temptest = tab.url.split(":");
                if (checkUrl(temptest[0])) {
                    if (favorite2 == "screen") {
                        document.write('"' + monthname[currentTime.getMonth()] + '. ' + day + ' ' + year + '", "<a href="' + tab.url + '">' + tab.url + '</a>"<br/>');
                    }
                    if (favorite2 == "file") {
                        window.myCsv += '"' + monthname[currentTime.getMonth()] + '. ' + day + ' ' + year + '","' + tab.url + '"\n';
                    }
                }
            });
            if (favorite2 == "file") {
                download('txt', window.myCsv);
            }
        });
    }

    function checkUrl(url) {
        let notChromeUrl = url != "chrome" && url != "chrome-extension";
        // return notChromeUrl;
        return true;
    }

    function download(fmt, content) {
        var csvContent = `data:${fmt}/;charset=utf-8,${content}`;
        var encodedUri = encodeURI(csvContent).replace(/#/g, '%23');;
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var wday = currentTime.getDay();
        var year = currentTime.getFullYear();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var datafilename = `Tab_Save_${monthname[currentTime.getMonth()]}_${day}_${year}_${hours}_${minutes}.${fmt}`;
        link.setAttribute("download", datafilename);
        link.click();
        // test
        // window.open(encodedUri);
        // window.myCsv = '';
    }
}
//ends getURLs

function openFromInput() {
    window.contents = document.getElementById("inputbox").value;
    document.getElementById("inputbox").value = '';
    chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
        var lines = window.contents.split(/\r?\n/);
        // Support output.md format: lines with '- [title](url)'
        var urlPattern = /^- \[.*?\]\((.*?)\)$/;
        var extracted = [];
        for (var i = 0; i < lines.length; i++) {
            var match = lines[i].match(urlPattern);
            if (match) {
                extracted.push(match[1]);
            } else {
                extracted.push(lines[i]);
            }
        }
        loadUrl(extracted, tabs);
        gogo();
    });
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function gogo() {
    console.log(window.openthese.length);
    var j = 0;
    while (j < window.openthese.length) {
        for (k = j; k < (j + 1); k++) {
            chrome.tabs.create({ 'url': window.openthese[k] }, function () { });
        }
        j = j + 1;
    }
}

function handleFileSelect(evt) {
    chrome.tabs.query({ 'currentWindow': true }, function (tabs) {
        var f = evt.target.files[0];
        // back.dothis.try(evt);
        console.log("read file", f);
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var contents = e.target.result;
                var lines = contents.split(/[\r\n|\n]+/);
                loadUrl(lines, tabs);
                gogo();
            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    });
}

function loadUrl(lines, tabs) {
    const validUrls = ["chrome", "chrome-extension", "http", "https", "ftp"];
    let firstr, secstr;
    for (i = 0; i < lines.length; i++) {
        // lines[i] = lines[i].replace(/["']/g, ' ');
        lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm, " ");;
        firstr = lines[i].split(/\s+/g);
        window.openthistab = false;
        for (j = 0; j < firstr.length; j++) {
            secstr = firstr[j].split(":");
            var tempo = firstr[j];
            if (validUrls.includes(secstr[0])) {
                window.openthistab = true;
                tabs.forEach(function (tab) {
                    if (tab.url == tempo) {
                        window.openthistab = false;
                    }
                });
                // chrome.tabs.create({'url': firstr[j]},function(){});
                if (window.openthistab) {
                    window.openthese.push(firstr[j]);
                    console.log("pushed");
                }
            }
        }
    }
}

function gogo() {
    console.log('open ' + window.openthese.length + ' tab(s)');
    var j = 0;
    while (j < window.openthese.length) {
        for (k = j; k < (j + 1); k++) {
            chrome.tabs.create({ 'url': window.openthese[k] }, function () { });
        }
        j = j + 1;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("sup");
    document.getElementById("getgone").addEventListener('click', geturls);
    // document.getElementById("pastem").addEventListener('click', openFromInput);
    document.getElementById("button1").addEventListener('click', openFromInput);
    document.getElementById('file').addEventListener('change', handleFileSelect);
});

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern async clipboard API, it returns a Promise
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        var textarea = document.getElementById('clipboardBuffer');
        if (!textarea) {
            textarea = document.createElement('textarea');
            textarea.id = 'clipboardBuffer';
            textarea.style.position = 'fixed';
            textarea.style.top = '-1000px';
            textarea.style.left = '-1000px';
            document.body.appendChild(textarea);
        }
        textarea.value = text;
        textarea.select();
        document.execCommand('copy');
        return Promise.resolve();
    }
}
