import Taro from "@tarojs/taro";
import AuthorityVerify from "@/components/AuthorityVerify";
import { useAtom, useAtomValue } from "jotai";
import { activeIndexState, showTabBarState } from "@/store/global";
import { authorityState } from "@/store/authority";
import { history } from '@tarojs/router'
import { useEffect } from "react";

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
  const authority = useAtomValue(authorityState);
  console.log(authority);

  // useEffect(() => {
  //   // Block navigation and register a callback that
  //   // fires when a navigation attempt is blocked.
  //   let unblock = history.block((tx) => {
  //     // Navigation was blocked! Let's show a confirmation dialog
  //     // so the user can decide if they actually want to navigate
  //     // away and discard changes they've made in the current page.
  //     let url = tx.location.pathname;
  //     if (window.confirm(`Are you sure you want to go to ${url}?`)) {
  //       // Unblock the navigation.
  //       unblock();

  //       // Retry the transition.
  //       tx.retry();
  //     }
  //   });
  //   return () => unblock();
  // }, []);

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
      className="tab-bar h-[128px] bg-white fixed bottom-0 w-full z-50 border-t border-gray-200 flex justify-center items-center"
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
      <div
        className={`h-full flex flex-1 justify-center items-center text-[40px] ${
          activeIndex === "/pages/my/index" ? "text-red-500" : ""
        }`}
        onClick={() => switchTab("/pages/my/index")}
      >
        我的2
      </div>
    </div>
  );
}

Index.options = {
  addGlobalClass: true,
};

export default Index;
