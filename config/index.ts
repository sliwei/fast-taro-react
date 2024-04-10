import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { UnifiedWebpackPluginV5 } from "weapp-tailwindcss/webpack";
import RemovePlugin from "remove-files-webpack-plugin";
import WebpackAliyunOss from "webpack-aliyun-oss";
import devConfig from "./dev";
import prodConfig from "./prod";
import pkg from "../package.json";

const isBuild = process.env.NODE_ENV === "production";
const CDN_URL = `https://cdn.xxx.com/fast-taro-react/${process.env.TARO_APP_ENV}/${pkg.version}/`;

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    projectName: "taro-240314",
    date: "2024-3-14",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: ["@tarojs/plugin-html"],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: "react",
    compiler: "webpack5",
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: isBuild ? 5 : 1024, // 设定转换尺寸上限
            basePath: isBuild ? CDN_URL : "",
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      imageUrlLoaderOption: {
        limit: 10,
        name: "assets/[name].[hash][ext]",
        publicPath: isBuild ? CDN_URL : "",
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: "taro",
                },
              ],
            },
          },
        });
        // 图片资源上传OSS,并删除本地assets资源,减少小程序体积
        if (isBuild) {
          chain.plugin("webpack-aliyun-oss").use(WebpackAliyunOss, [
            {
              from: ["./dist/assets/**"], //排除html文件
              dist: `fast-taro-react/${process.env.TARO_APP_ENV}/${pkg.version}`,
              region: process.env.CICD_region,
              accessKeyId: process.env.CICD_accessKeyId,
              accessKeySecret: process.env.CICD_accessKeySecret,
              bucket: process.env.CICD_bucket,
            },
          ]);
          chain
            .plugin("remove-files-webpack-plugin")
            .use(RemovePlugin, [
              { after: { include: ["dist/assets"], trash: true } },
            ]);
        }
      },
    },
    h5: {
      publicPath: isBuild ? CDN_URL : "/",
      staticDirectory: "assets",
      output: {
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js",
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      imageUrlLoaderOption: {
        limit: 10,
        name: "assets/[name].[hash][ext]",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
        // 所有资源上传OSS
        if (isBuild) {
          chain.plugin("webpack-aliyun-oss").use(WebpackAliyunOss, [
            {
              from: ["./dist/**"], //排除html文件
              dist: `fast-taro-react/${process.env.TARO_APP_ENV}/${pkg.version}`,
              region: process.env.CICD_region,
              accessKeyId: process.env.CICD_accessKeyId,
              accessKeySecret: process.env.CICD_accessKeySecret,
              bucket: process.env.CICD_bucket,
            },
          ]);
        }
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (!isBuild) {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
