document.addEventListener('DOMContentLoaded', function() {
    const syncBtn = document.getElementById('syncBtn');
    const cleanAppBtn = document.getElementById('cleanAppBtn');

    syncBtn.addEventListener('click', function() {
        // 请求当前活动标签页的书签数据
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'REQUEST_CHROME_BOOKMARKS'
            });
        });
    });

    cleanAppBtn.addEventListener('click', function() {
        // 获取当前活动标签页
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length === 0) return;
            
            const currentTab = tabs[0];
            const url = new URL(currentTab.url);
            const domain = url.hostname;
            
            // 清除cookies
            chrome.cookies.getAll({domain: domain}, function(cookies) {
                for (let cookie of cookies) {
                    const url = (cookie.secure ? 'https://' : 'http://') + 
                               cookie.domain.replace(/^\./, '') + 
                               (cookie.path || '/');
                    chrome.cookies.remove({
                        url: url,
                        name: cookie.name
                    });
                }
            });
            
            // 注入内容脚本以清除localStorage, sessionStorage和IndexedDB
            chrome.scripting.executeScript({
                target: {tabId: currentTab.id},
                function: clearSiteData
            });
            
            alert(`已清除 ${domain} 的网站数据`);
        });
    });
    
    // 用于清除网站数据的函数
    function clearSiteData() {
        try {
            // 清除localStorage
            localStorage.clear();
            
            // 清除sessionStorage
            sessionStorage.clear();
            
            // 清除IndexedDB
            const dbs = window.indexedDB.databases ? 
                window.indexedDB.databases() : 
                Promise.resolve([]);
                
            dbs.then(databases => {
                for (let db of databases) {
                    if (db.name) {
                        window.indexedDB.deleteDatabase(db.name);
                    }
                }
            }).catch(console.error);
            
            // 清除缓存
            if (window.caches) {
                caches.keys().then(function(names) {
                    for (let name of names) {
                        caches.delete(name);
                    }
                }).catch(console.error);
            }
            
            return '网站数据已清除';
        } catch (e) {
            console.error('清除网站数据时出错:', e);
            return '清除网站数据时出错: ' + e.message;
        }
    }
});
