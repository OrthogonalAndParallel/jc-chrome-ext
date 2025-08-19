document.addEventListener('DOMContentLoaded', function() {
    const syncBtn = document.getElementById('syncBtn');

    syncBtn.addEventListener('click', function() {
        // 请求当前活动标签页的书签数据
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'REQUEST_CHROME_BOOKMARKS'
            });
        });
    });
});
