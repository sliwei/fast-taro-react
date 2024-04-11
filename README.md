# Taro@3 react模板,兼容H5

特色: 小程序和H5/更新/网络检测/手机号授权/各种授权函数/分享/自定义Navbar/完善的用户权限流程/权限组件与函数/tailwindcss/react-use/jotai/丰富utils

小程序图片资源打包自动上传oss，减少包体积，小程序直接调用接口

H5打包自动上传所有资源到oss，部署html即可，可以配置devServer代理接口

## 已集成插件

* react
* less
* tailwindcss && weapp-tailwindcss
* ts 
* webpack@5 
* @tarojs/plugin-html
* react-use
* dayjs
* commitlint
* husky
* jotai
* webpack-aliyun-oss

## 推荐插件

* sass
* framer-motion
* react-icons
* react-redux & @reduxjs/toolkit
* @taroify/core || ossa || NutUI || Vant Weapp

## 开发
```
# 小程序
yarn dev

# H5
yarn dev:h5
```

## 打包
```
# 小程序
yarn build:test
yarn build:live

# H5
yarn build:h5:test
yarn build:h5:live
```

## 流程

1.登录

```js
# 手机号授权(使用code授权,服务端客户在微信接口中获取手机号)
/api/users/wxBindMobile
返回成功失败
1.授权成功后调用登录接口获取用户信息

# 登录(使用code去登录,每次打开页面获取一次权限,保证及时性,这里可以考虑将登录不放在打开页面调用逻辑)
api/users/wxLogin
返回用户信息和token
{
  id/name/mobile/avatar/上次登录时间/unionid/openid/session_key
}
1.避免滥用建议不返回ID,使用token作为唯一标识
2.token使用jwt,token中一般存ID/name/authority/mobile/openid
3.为啥存这么多信息和authority呢,遵循能使用token除了大多数逻辑就使用token,不然可能需要查库,authority可以做权限判断,所以authority设计越精简越好
4.登录完成后调用一次获取权限接口

# 获取权限(使用token去获取,每次打开页面获取一次权限,保证及时性)
api/role/findAuthority
返回权限(authority='my:0,/list:0,/user:0,user-act:1')
1.逻辑中使用AuthorityVerify组件/getAuthorityVerify函数可以覆盖大多数权限校验场景
```

2.检查更新

3.网络检测提示

## 开发注意事项
1.尽量使用html div标签布局，避免H1、H2等标签的使用，应为项目未集成标签基础样式

2.所有展示类标签都需要宽高，比如img，否则两端渲染不一致

3.对于小程序、H5关于用户信息的逻辑需特殊处理，可使用process.env.TARO_ENV === "h5"判断

4.关于h5使用tab-bar，可在一级页面导入custom-tab-bar使用

5.关于路由守卫，taro并没有好的方式，可以在离开页面时、进入页面的Effect或Effect route来处理