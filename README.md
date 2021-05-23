# File-Cilent's Server

File-Cilent 是一个由猫猫@Cattttttttt 开发(🕊)的文件下载方案

~~垃圾百度早点死~~

此项目为该方案的后端

已初步完成应该可以使用，测试以后再补

---
## Quick Start

先clone此项目

```shell
$ git clone https://github.com/MeowToys/file-server.git
```

需安装mongoDB且运行在27017端口上, 默认数据库名为dev~~毕竟还没做完~~

随后进入项目文件夹安装依赖然后build此项目并运行

```shell
$ yarn
$ yarn build
$ yarn start:prod
```

初次使用需输入管理密码

---

## API

### `GET /file`
获得文件列表
#### `params`
  不适用

#### `header`
  不适用

#### `body`
  |key|type|required|说明|
  |-|-|-|-|
  |pageSize|number|false|每一页显示的文件数|
  |page|number|false|当前翻页|

#### `response`
  |key|type|optional|说明|
  |-|-|-|-|
  |files|Array<[ResponseFileType](###ReponseFileType)>|false|文件信息数组|
  |count|number|false|返回的文件数量, 数量和`Body`内的`pageSize`有关|

### `GET /file/:hashedFileName/info`
获得文件信息
#### `params`
|key|type|required|说明|
|-|-|-|-|
|hashedFileName|string|true|文件的md5值|

#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {accessToken}`<br>用于adminOnly的文件认证|
#### `body`
|key|type|required|说明|
|-|-|-|-|
|passwd|string|false|用于密码保护文件的认证|

#### `response`
|key|type|optional|说明|
|-|-|-|-|
|filename|string|false|文件名|
|size|number|false|文件大小(单位: 字节)|
|type|string|false|文件的[MIME类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)|
|preview|boolean|false|文件是否可以预览(仅用于照片)|
|uploadTime|string|false|文件的上传时间(已经转换为当地格式)|
|hashedFileName|string|false|文件的md5值|

### `GET /file/:hashedFileName/preview`
获得图片文件的预览
#### `params`
|key|type|required|说明|
|-|-|-|-|
|hashedFileName|string|true|文件的md5值|
#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {accessToken}`<br>用于adminOnly的文件认证|
#### `body`
|key|type|required|说明|
|-|-|-|-|
|passwd|string|false|用于密码保护文件的认证|
#### `response`
以`Express.Response.sendFile`形式发送的文件, 仅限`preview = true`的照片

### `GET /file/:hashedFileName/download`
下载文件
#### `params`
|key|type|required|说明|
|-|-|-|-|
|hashedFileName|string|true|文件的md5值|
#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {accessToken}`<br>用于adminOnly的文件认证|
#### `body`
|key|type|required|说明|
|-|-|-|-|
|passwd|string|false|用于密码保护文件的认证|
#### `response`
以`Express.Response.download`形式发送的文件

### `GET /user/refresh`
刷新accessToken
#### `params`
不适用
#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {refreshToken}`<br>用于认证token合法性|
#### `body`
不适用

#### `response`
|key|type|optional|说明|
|-|-|-|-|
|accessToken|string|false|刷新后的accessToken|

### `POST /file`
上传文件
#### `params`
不适用
#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {accessToken}`<br>用于管理员认证|
#### `body`
|key|type|required|说明|
|-|-|-|-|
|files|Array<file>|true|上传的文件数组|
|passwd|string|false|如果提供则会将该文件用传入的密码进行保护|
|isAdmin|boolean|false|如果提供`true`则会将此文件设置为仅管理员有权访问, 不提供或者提供`false`则会开放|
|preview|boolean|false|设置照片文件能不能预览|
#### `response`
不适用

### `POST /user/login`
登录
#### `params`
  不适用

#### `header`
  不适用
#### `body`
|key|type|required|说明|
|-|-|-|-|
|passwd|string|true|初次使用时设置的密码|

#### `response`
|key|type|optional|说明|
|-|-|-|-|
|accessToken|string|false||
|refreshToken|string|false||

### `DELETE /file/:hashedFileName`
删除文件

#### `params`
|key|type|required|说明|
|-|-|-|-|
|hashedFileName|string|true|文件的md5值|
#### `header`
|key|type|required|说明|
|-|-|-|-|
|authorization|string|false|`Bearer {accessToken}`<br>用于管理员认证|

#### `body`
不适用

#### `response`
不适用

---
## 类型定义

### `accessToken: string`
### `refreshToken: string`

### `ResponseFileType:`
  |key|type|optional|说明|
  |-|-|-|-|
  |filename|string|false|文件名|
  |hashedFileName|string|false|文件的md5值|
  |adminOnly|boolean|false|文件是否为仅管理员可用|
  |fileSize|number|false|文件的大小(单位: 字节)|
  |type|string|false|文件的[MIME类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)|
  |preview|boolean|false|文件是否可以预览(仅用于照片)|
  |uploadTime|string|false|文件的上传时间(已经转换为当地格式)|

---
## ToDo

- [ ] 单元测试
- [ ] 类型声明
- [ ] dockerfile
- [ ] 一键部署脚本