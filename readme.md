
# 内部将文件批量上传至cdn

# 使用

## 安装
```
npm i uploadcdn --save-dev
```

## webpack导入

```javascript

const uploadcdn = require('uploadcdn');

const getTimePrefix = require('uploadcdn').getTimePrefix;
// 获取CDN前缀
const publicPath = getTimePrefix();
...
publicPath: 'https://cdn.com/' + publicPath,
plugins: [
  // 注意需要上传form的格式是file
  new uploadcdn.Upload2cdnPlugin({cdnUrl: 'https://qiniu.com'})
]

```

## 单独引入

```javascript

const uploadCDN = require('uploadcdn').uploadCDN;
// cdnUrl，cdn的上传链接，相对路径的filelist文件列表，dirname文件目录
uploadCDN(cdnUrl, filelist, dirname)
```