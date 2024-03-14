# Taro@3 react模板

特色: 更新/网络检测/手机号授权/各种授权函数/分享/自定义Navbar/完善的用户权限流程/权限组件与函数/tailwindcss/react-use/jotai/丰富utils

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

## 推荐插件

* sass
* framer-motion
* react-icons
* react-redux & @reduxjs/toolkit
* @taroify/core || ossa || NutUI || Vant Weapp

## 开发
```
yarn dev:weapp
>>>
npm run build:weapp -- --watch --mode dev
```

## 打包
```
yarn build:test
>>>
taro build --type weapp --mode test

yarn build:live
>>>
taro build --type weapp --mode live
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