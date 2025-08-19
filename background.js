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

    // 检查请求是否来自我们的内容脚本
    if (request.action === 'fetch') {
        const { url, options } = request;

        // 使用 fetch API 执行请求，并自动处理跨域和Cookie
        fetch(url, options)
            .then(response => {
                // 检查响应类型，如果是JSON则解析，否则返回文本
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json().then(data => ({
                        ok: response.ok,
                        status: response.status,
                        data: data
                    }));
                } else {
                    return response.text().then(data => ({
                        ok: response.ok,
                        status: response.status,
                        data: data
                    }));
                }
            })
            .then(data => {
                // 请求成功，将结果返回
                sendResponse({ success: true, result: data, id: request.id });
            })
            .catch(error => {
                // 请求失败，返回错误信息
                sendResponse({ success: false, error: error.message, id: request.id });
            });

        // 返回 true 表示 sendResponse() 将异步调用
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