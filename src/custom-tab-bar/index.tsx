import Taro from "@tarojs/taro";
import AuthorityVerify from "@/components/AuthorityVerify";
import { useAtom, useAtomValue } from "jotai";
import { activeIndexState, showTabBarState } from "@/store/global";

const pages = [
  {
    pagePath: "pages/index/index",
    text: "主页",
  },
  {
    pagePath: "pages/my/index",
    text: "我的",
  },
];

function Index() {
  const [activeIndex, setActiveIndex] = useAtom(activeIndexState);
  const showTabBar = useAtomValue(showTabBarState);

  const switchTab = (path: string) => {
    Taro.switchTab({
      url: path,
      success: () => {
        setActiveIndex(path);
      },
    });
  };

  return (
    <div
      className="tab-bar h-16 bg-white fixed bottom-0 w-full z-50 border-t border-gray-200 flex justify-center items-center"
      style={{ display: showTabBar ? "flex" : "none" }}
    >
      <div
        className={`h-full flex flex-1 justify-center items-center text-[40px] ${
          activeIndex === "/pages/index/index" ? "text-red-500" : ""
        }`}
        onClick={() => switchTab("/pages/index/index")}
      >
        主页
      </div>
      <AuthorityVerify code="my:0">
        <div
          className={`h-full flex flex-1 justify-center items-center text-[40px] ${
            activeIndex === "/pages/my/index" ? "text-red-500" : ""
          }`}
          onClick={() => switchTab("/pages/my/index")}
        >
          我的
        </div>
      </AuthorityVerify>
    </div>
  );
}

Index.options = {
  addGlobalClass: true,
};

export default Index;
