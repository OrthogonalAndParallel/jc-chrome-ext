// 注入到网页中的脚本，用于与Vue应用通信
(function() {
    // 监听来自background的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'BOOKMARKS_DATA') {
            // 将书签数据传递给Vue应用
            window.postMessage({
                type: 'CHROME_BOOKMARKS_DATA',
                data: request.data
            }, '*');
        }
    });

    // 监听来自Vue应用的请求
    window.addEventListener('message', function(event) {
        // 验证消息来源（安全考虑）
        if (event.data.type === 'REQUEST_CHROME_BOOKMARKS') {
            // 请求书签数据
            chrome.runtime.sendMessage({
                action: "GET_BOOKMARKS"
            }, function(response) {
                if (response.success) {
                    // 将数据发送回Vue应用
                    window.postMessage({
                        type: 'CHROME_BOOKMARKS_DATA',
                        data: response.data
                    }, '*');
                }
            });
        }
    });

    // 监听来自网页的自定义事件
    window.addEventListener("vueRequest", (event) => {
        const requestDetails = event.detail;
        // 将请求数据发送给 background.js
        chrome.runtime.sendMessage(requestDetails, (response) => {
            // 收到后台脚本的响应后，再通过自定义事件发送回网页
            const responseEvent = new CustomEvent("vueResponse", { detail: response });
            window.dispatchEvent(responseEvent);
        });
    });
})();
