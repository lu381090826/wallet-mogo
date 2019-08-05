const fs = require("fs");
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin-for-multihtml");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const config = require("../config");

// 通过页面配置文件过去页面json
function generateByConfig() {
  return JSON.parse(fs.readFileSync("./src/page.json"));
}

// 生成extraEntry
const extraEntry = generateByConfig();

let newExtraEntry = {};

// 生成HtmlWebpackPlugin
let extraHtmlWebpackPlugins = [];
for (let i in extraEntry) {
  const usePlusReady = /\S+\|plusReady/.test(i);
  // 提前加载plus
  let chunk = i;
  if (usePlusReady) chunk = chunk.replace("|plusReady", "");
  newExtraEntry[chunk] = extraEntry[i];
  extraHtmlWebpackPlugins.push(
    new HtmlWebpackPlugin({
      filename: chunk + ".html",
      template: "index.html",
      multihtmlCache: true,
      chunks: [chunk, 'vue'],
      plusReady: usePlusReady ? '<script src="html5plus://ready"></script>' : ""
    })
  );
}

exports.extraEntry = newExtraEntry;
exports.extraHtmlWebpackPlugins = extraHtmlWebpackPlugins;
