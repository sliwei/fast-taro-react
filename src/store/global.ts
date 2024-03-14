import { atom } from "jotai";

export interface Userinfo {
  head: string;
  id: number;
  mobile: null | string;
  name: string;
  openid: string;
  session_key: string;
  token: string;
}

export const activeIndexState = atom("/pages/index/index");
export const showTabBarState = atom(true);
export const userinfoState = atom<null | Userinfo>(null);
