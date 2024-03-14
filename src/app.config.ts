export default defineAppConfig({
  lazyCodeLoading: "requiredComponents",
  pages: ["pages/index/index", "pages/my/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: "pages/index/index",
        text: "主页",
      },
      {
        pagePath: "pages/my/index",
        text: "我的",
      },
    ],
  },
});
