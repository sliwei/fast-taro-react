import { useLoad } from "@tarojs/taro";
import { useAtom } from "jotai";
import "./index.less";
import { countAtom } from "@/store/count";
import CustomTabBar from "@/custom-tab-bar";

export default function Index() {
  const [count, setCount] = useAtom(countAtom);

  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <div className="index pt-[100px]">
      <div className="text-[40px]">Count:{count}</div>
      {process.env.TARO_ENV === "h5" ? <CustomTabBar /> : null}
    </div>
  );
}
