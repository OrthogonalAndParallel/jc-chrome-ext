
## 工程结构
```
chrome-bookmark-extension/
├── manifest.json                  # 扩展程序配置文件
├── background.js                  # 后台脚本，用于获取书签
├── content.js                     # 内容脚本（可选）
├── popup.html                     # 扩展弹窗页面（可选）
├── popup.js                       # 弹窗页面逻辑（可选）
├── icons/                         # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── package.json                   # npm 配置文件（如果需要）
```