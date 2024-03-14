import Taro, { useLoad, useShareAppMessage } from "@tarojs/taro";
import { useAtom, useSetAtom } from "jotai";
import Test from "@/components/Test";
import "./index.less";
import { countAtom } from "@/store/count";
import { Button } from "@tarojs/components";
import { autoLogin, phoneAuth } from "@/utils";
import { authorityState } from "@/store/authority";

export default function Index() {
  const [count, setCount] = useAtom(countAtom);
  const setAuthority = useSetAtom(authorityState);

  useLoad(() => {
    console.log("Page loaded.");
  });

  useShareAppMessage(() => {
    return {
      title: "分享文案",
      path: "/pages/index/index",
      imageUrl: "https://img.yzcdn.cn/vant/cat.jpeg",
    };
  });

  // 授权手机号
  const getPhoneNumber = async (val) => {
    console.log(val);
    const { detail } = val;
    if (detail.code) {
      const res = await phoneAuth(detail);
      console.log("wxBindMobile", res);
      if (res.code === 0) {
        await autoLogin();
      } else {
        Taro.showToast({
          title: `授权失败${res.msg}`,
          icon: "none",
        });
      }
    } else {
      console.log("取消授权");
    }
  };

  return (
    <div className="index text-[40px]">
      <div className="text-red-500 text-xl">Hello world!</div>
      <div>Count:{count}</div>
      <Button onClick={() => setCount(count + 1)}>Count+1</Button>
      <Test />
      <Button
        className="new"
        openType="getPhoneNumber"
        onGetPhoneNumber={getPhoneNumber}
      >
        授权手机号
      </Button>
      <Button onClick={() => setAuthority("")}>修改权限</Button>
    </div>
  );
}
