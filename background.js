// 监听来自content script或popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_BOOKMARKS") {
        // 获取书签树
        chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
            sendResponse({
                success: true,
                data: bookmarkTreeNodes
            });
        });
        // 返回true表示异步响应
        return true;
    }
});

// 可选：监听书签变化
chrome.bookmarks.onChanged.addListener(() => {
    // 通知Vue应用书签已更新
    notifyVueApp();
});

chrome.bookmarks.onCreated.addListener(() => {
    notifyVueApp();
});

chrome.bookmarks.onRemoved.addListener(() => {
    notifyVueApp();
});

function notifyVueApp() {
    // 可以通过storage或其它方式通知Vue应用
    chrome.storage.local.set({ bookmarksUpdated: Date.now() });
}