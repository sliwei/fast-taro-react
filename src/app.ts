import { PropsWithChildren } from "react";
import Taro, { useDidShow, useLaunch } from "@tarojs/taro";
import { autoLogin, updateWeapp } from "./utils";
import { useSetAtom } from "jotai";
import { authorityState } from "./store/authority";
import { userinfoState } from "./store/global";
import "./app.less";

function App({ children }: PropsWithChildren<any>) {
  const setAuthority = useSetAtom(authorityState);
  const setUserinfo = useSetAtom(userinfoState);

  useLaunch(() => {
    console.log("App launched.");
  });

  useDidShow(() => {
    // 登陆
    autoLogin().then((res) => {
      console.log("autoLogin", res);
      if (res.code === 0) {
        // 登陆成功
        const { authority, userInfo } = res.data!;
        setUserinfo(userInfo);
        setAuthority(authority);
      }
    });
    // 是否需要更新
    updateWeapp(true);
    // 网络
    Taro.onNetworkStatusChange((res) => {
      console.log("onNetworkStatusChange", res);
      if (!res.isConnected) {
        Taro.showModal({
          title: "提示",
          content: "无法连接到互联网，请检查你的网络",
          confirmText: "确定",
          showCancel: false,
          success: (modal) => {
            if (modal.confirm) {
              console.log("用户点击确定");
            } else if (modal.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
    });
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
