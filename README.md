# translate-google-api

谷歌翻译（translate.google.cn）api

## 安装

```
npm i -S translate-google-api
```

## 用法

```javascript
const translate = require('translate-google-cn');

translate('english', { from: 'auto', to: 'zh-cn' })
  .then(({ text }) => console.log(text))
  .catch(console.error);
```

## 说明

代码来自

- [google-translate-api](https://github.com/matheuss/google-translate-api)
- [google-translate-token](https://github.com/matheuss/google-translate-token)

## 修改

- `translate.google.com` --> `translate.google.cn`
- 获取初始 `token` 的正则表达式
