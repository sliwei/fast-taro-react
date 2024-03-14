import { authorityState } from "@/store/authority";
import { useAtomValue } from "jotai";
import React from "react";

export interface IProps {
  /* 权限1,权限2 */
  code: string | undefined;
  replace?: React.ReactNode | string;
  children: React.ReactNode;
  /* 条件是否满足 */
  term?: boolean;
}

// 权限验证组件
export default function Index({
  code,
  replace = "",
  term = true,
  children,
}: IProps) {
  const authority = useAtomValue(authorityState);

  const has = () => {
    const codes = (code || "").split(",").filter((v) => v);
    let state = false;
    for (let i = 0; i < codes.length; i++) {
      if (authority.includes(codes[i])) {
        state = true;
        break;
      }
    }
    return state;
  };
  return term ? <>{authority && has() ? children : replace}</> : null;
}

// 权限验证函数
export const getAuthorityVerify = (
  code: string | undefined,
  authority: string
) => {
  const has = () => {
    const codes = (code || "")
      .split(",")
      .filter((v) => v)
      .map((v) => `${v}:1`);
    let state = false;
    for (let i = 0; i < codes.length; i++) {
      if (authority.includes(codes[i])) {
        state = true;
        break;
      }
    }
    return state;
  };
  return has();
};
