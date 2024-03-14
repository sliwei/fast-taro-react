// postcss.config.js
// 假如你使用的框架/工具不支持 postcss.config.js 配置文件，则可以使用内联的写法
module.exports = {
  plugins: {
    tailwindcss: {},
    // 假如框架已经内置了 `autoprefixer`，可以去除下一行
    autoprefixer: {},
    "postcss-rem-to-responsive-pixel": {
      // 32 意味着 1rem = 32rpx
      rootValue: 32,
      // 默认所有属性都转化
      propList: ["*"],
      // 转化的单位,可以变成 px / rpx
      transformUnit: "rpx",
      // postcss-rem-to-responsive-pixel@6 版本添加了 disabled 参数，用来禁止插件的转化
      // disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'rn'
    },
  },
};
