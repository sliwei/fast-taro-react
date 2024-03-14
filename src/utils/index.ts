import Taro from "@tarojs/taro";
import appRequest from "@/utils/request";

// 升级 - 更新小程序 isForce 强制升级
export const updateWeapp = (isForce?: boolean): void => {
  const tipModal = (updateManager) => {
    Taro.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否马上重启小程序？",
      success: (res) => {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          try {
            Taro.clearStorageSync();
          } catch (e) {
            // Do something when catch error
          }
          updateManager.applyUpdate();
        } else {
          if (isForce) {
            tipModal(updateManager);
          }
        }
      },
    });
  };
  if (process.env.TARO_ENV === "weapp") {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log("是否有新版本: ", res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
      tipModal(updateManager);
    });

    updateManager.onUpdateFailed(() => {
      // 新的版本下载失败
      console.log("新的版本下载失败");
    });
  }
};

// 授权 - 获取用户当前的授权状态
export const checkAuthSetting = async (authSettingName) => {
  return new Promise((resolve) => {
    Taro.getSetting({
      success(res) {
        if (res.authSetting[authSettingName]) {
          resolve(true);
          console.log("授权过");
        } else {
          resolve(false);
          console.log("未授权过");
        }
      },
    });
  });
};

// 授权 - 发起授权请求
export const authSeting = async (authSettingName) => {
  return new Promise((resolve) => {
    Taro.authorize({
      scope: authSettingName,
      success() {
        resolve(true);
        console.log("授权成功");
      },
      fail() {
        resolve(false);
        console.log("授权失败");
      },
    });
  });
};

// 授权 - 打开设置界面
export const openSetting = async (authSettingName) => {
  return new Promise((resolve) => {
    Taro.openSetting({
      success(res) {
        if (res.authSetting[authSettingName]) {
          resolve(true);
        } else {
          resolve(false);
        }
        console.log("授权设置", res);
      },
      fail() {
        resolve(false);
        console.log("设置失败");
      },
    });
  });
};

// 授权 - 判断授权
export const userAPIAuthSeting = async (authSettingName, options, fn) => {
  const isAuthed = await checkAuthSetting(authSettingName);
  if (isAuthed) {
    // 授权过
    fn();
    return;
  }

  const isAuthSuccess = await authSeting(authSettingName);
  if (isAuthSuccess) {
    // 授权成功
    fn();
    return;
  }

  const defOptions = {
    content: "检测到您没打开相应授权，是否去设置打开？",
    confirmText: "确认",
    cancelText: "取消",
  };
  Taro.showModal({
    ...defOptions,
    ...options,
    success: async (res) => {
      if (res.confirm) {
        // 打开授权界面
        const result = await openSetting(authSettingName);
        if (result) {
          fn();
        }
      } else {
        console.log("用户点击取消");
      }
    },
  });
};

// 检查session
export const checkSession = () => {
  return new Promise((resolve) => {
    Taro.checkSession({
      success: () => {
        console.log("session 未过期");
        resolve(true);
      },
      fail: () => {
        console.log("session过期");
        resolve(false);
      },
    });
  });
};

// 登陆 - 用户登陆获取code
export const userLogin = () => {
  return new Promise((resolve) => {
    Taro.login({
      success: (res) => {
        console.log("登陆成功", res.code);
        resolve(res.code);
      },
      fail: () => {
        console.log("登录失败");
        resolve("");
      },
    });
  });
};

// 登陆 - 手机号授权 (code 0 授权成功， 1 授权失败)
export const phoneAuth = async ({ code }: { code: string }) => {
  console.log("phoneAuth", code);
  return appRequest.post({
    url: `/api/users/wxBindMobile`,
    data: { code },
  });
};

// 登陆 - 登录流
export const autoLogin = async () => {
  const code = await userLogin();
  if (code) {
    const userInfo = await appRequest.post({
      url: `/api/users/wxLogin`,
      data: { code },
    });
    console.log("userInfo", userInfo);
    if (userInfo.code === 0) {
      Taro.setStorageSync("__weapp_open_id__", userInfo.data.openid);
      Taro.setStorageSync("__weapp_token__", userInfo.data.token);
      const authority = await appRequest.get({
        url: `/api/role/findAuthority`,
      });
      return {
        code: 0,
        data: { userInfo: userInfo.data, authority: authority.data },
      };
    }
    return { code: 1, msg: "用户code解析openId失败~" };
  }
  return { code: 1, msg: "用户登录获取code失败~" };
};

type Tkey =
  | "albumAuthorized"
  | "bluetoothAuthorized"
  | "cameraAuthorized"
  | "locationAuthorized"
  | "locationReducedAccuracy"
  | "microphoneAuthorized"
  | "notificationAlertAuthorized"
  | "notificationSoundAuthorized"
  | "notificationBadgeAuthorized"
  | "phoneCalendarAuthorized";

/**
 * 获取系统权限状态
 * 0 用户已开通对应权限
 * 1 获取系统权限失败
 * 1001 当前微信版本过低，部分功能无法使用~
 * 100 打开系统授权页成功
 * 101 打开系统授权页失败
 * 403 用户点击取消
 * 401 权限没打开
 * */
export const getSystemInfo = (keys: Tkey[], content = "") => {
  return new Promise((resolve) => {
    const canUseSta = Taro.canIUse("getAppAuthorizeSetting");
    console.log("canUseSta", canUseSta);
    if (!canUseSta) {
      return resolve({
        code: 1001,
        msg: "当前微信版本过低，部分功能无法使用~",
      });
    }

    const systemInfo = Taro.getAppAuthorizeSetting();
    console.log("system", systemInfo);
    if (!systemInfo) {
      return resolve({ code: 1, msg: "获取系统权限失败~" });
    }
    keys.forEach((item) => {
      if (systemInfo[item] !== "authorized") {
        Taro.showModal({
          content,
          success: (res) => {
            if (res.confirm) {
              Taro.openAppAuthorizeSetting({
                success: () => {
                  return resolve({ code: 100, msg: "打开系统授权页成功~" });
                },
                fail: () => {
                  return resolve({ code: 101, msg: "打开系统授权页失败~" });
                },
              });
            } else {
              return resolve({ code: 403, msg: "用户点击取消~" });
            }
          },
        });
        return resolve({ code: 401, msg: "权限没打开~" });
      }
    });
    return resolve({ code: 0, msg: "用户已开通对应权限~" });
  });
};

// 时间格式化,默认2023/08/08 16:27:59
export const formatTime = (date, fill = "/") => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join(fill) +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

// 10内数字补充0
export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 防抖
export const debounce = (func, time) => {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
};

// 节流
export const throttle = (callback, wait = 3000) => {
  let timer: any = null;
  let startTime;
  return (...args) => {
    const ctx = this;
    const now = +new Date();
    if (startTime && now < startTime + wait) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        startTime = now;
        callback.apply(ctx, args);
      }, wait);
    } else {
      startTime = now;
      callback.apply(ctx, args);
    }
  };
};

// 指定区间随机数
export const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

// 获取当前页面栈
export const path = () => {
  const pages = Taro.getCurrentPages();
  return pages[pages.length - 1];
};

// 强行睡觉,默认800
export const sleep = (time: number = 800) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, time)
  );
};
