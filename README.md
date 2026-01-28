<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-09-05 15:58:41
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2024-09-06 11:42:42
 * @FilePath: /web/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 悦诉律服管理系统

### 项目介绍

YueSu-Devops 是一个网页版运维系统，集成在线聊天，前端使用 Naive UI + Vue3，后端采用 GO 开发。

### 功能模块

- 支持私聊及群聊
- 支持多种聊天消息类型 例如:文本消息、代码块、群投票、图片及其它类型文件，并支持文件下载
- 支持聊天消息撤回、删除(批量删除)、转发消息(逐条转发、合并转发)
- 支持编写笔记

### 项目安装

###### 修改 .env 配置信息

```env
VITE_BASE_API=http://127.0.0.1:9503
VITE_SOCKET_API=ws://127.0.0.1:9504
```

###### 关于 Nginx 的一些配置

```nginx
server {
    listen       80;
    server_name  www.yourdomain.com;

    root /project-path/dist;
    index  index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|ico)$ {
        expires 7d;
    }

    location ~ .*\.(js|css)?$ {
        expires 7d;
    }
}
```
# 悦诉客服

## 桌面打包改造（Tauri 2.x）
- 移除 Electron 相关目录与脚本，采用 Tauri 2 进行桌面打包，统一维护 PDF 预览与应用窗口。

### 环境依赖
- 必需：Rust 工具链（rustup + cargo）、Node.js、pnpm
- macOS：Xcode Command Line Tools，证书签名可选（开发版不强制）
- Windows：WebView2 运行时、MSVC 构建工具

### 安装依赖
- 安装 Tauri CLI 与前端 API：
  - `pnpm add -D @tauri-apps/cli@latest`
  - `pnpm add @tauri-apps/api@latest`

### 项目结构
- 新增 `src-tauri/`：
  - `Cargo.toml`、`build.rs`、`src/lib.rs`、`src/main.rs`
  - `tauri.conf.json`（Tauri 2 配置）
  - `icons/`（打包图标输出目录）

### 配置要点（Tauri 2）
- `src-tauri/tauri.conf.json`：
  - `productName`: 悦诉客服
  - `identifier`: cn.yuesu.kefu
  - `build.beforeDevCommand`: `pnpm dev`
  - `build.devUrl`: `http://localhost:5173`
  - `build.frontendDist`: `../dist`
  - `bundle.active`: `true`
  - `bundle.targets`: `all`（同时支持 macOS 与 Windows）
  - `bundle.icon`: `src-tauri/icons` 下的图标集合

### 应用图标
- 源图标：`src/assets/image/logo.png`
- 生成平台图标：
  - `pnpm tauri icon src/assets/image/logo.png --output src-tauri/icons`

### 开发与打包
- 开发模式：
  - `pnpm tauri:dev`
- 生产打包：
  - `pnpm tauri:build`（在 Windows 环境执行）
  - Windows 输出：`src-tauri/target/release/bundle/nsis/*.exe`（NSIS 安装包）或 `wix/*.msi`（MSI 安装包）

### GitHub 分发 Windows 应用

#### 自动构建与发布流程
1. **配置 GitHub Actions**
   - 项目已内置 `release.yml` 工作流，支持自动构建和发布
   - 当推送 `v*.*.*` 格式的标签时，会自动触发构建流程
   - 构建 Windows 版本，并上传到 GitHub Release

2. **创建版本发布**
   - 在 GitHub 仓库中创建新的 Release，使用 `v*.*.*` 格式的标签
   - GitHub Actions 会自动构建应用并上传安装包
   - Windows 应用会生成两种格式的安装包：
     - `悦诉客服_v*.*.*_windows.msi`（MSI 安装包）
     - `悦诉客服_v*.*.*_windows.exe`（NSIS 安装包）

3. **自动更新功能**
   - 应用内置自动更新功能，会定期检查 GitHub Release 上的新版本
   - 当检测到新版本时，会自动提示用户更新
   - 更新配置位于 `src-tauri/tauri.conf.json` 的 `updater` 部分

4. **Windows 用户安装指南**
   - 访问 GitHub 仓库的 Releases 页面
   - 下载最新版本的 Windows 安装包（推荐使用 `.exe` 格式）
   - 双击安装包进行安装
   - 安装完成后，应用会自动添加到开始菜单

5. **常见问题**
   - **安装失败**：可能是缺少 Visual C++ 运行时，建议安装最新的 Visual C++ Redistributable
   - **更新失败**：检查网络连接，确保可以访问 GitHub
   - **应用无法启动**：尝试以管理员身份运行应用

#### 手动构建 Windows 应用
如果需要在本地构建 Windows 应用：
1. 在 Windows 环境中安装依赖：
   - Node.js 18+
   - Rust 工具链
   - WiX Toolset（用于生成 MSI 安装包）
2. 执行构建命令：
   ```bash
   pnpm install
   pnpm build
   pnpm tauri build
   ```
3. 构建产物位于：
   - `src-tauri/target/release/bundle/nsis/`（EXE 安装包）
   - `src-tauri/target/release/bundle/msi/`（MSI 安装包）

### 迁移说明
- 删除 `electron/` 目录、`.env.electron`、`src/types/electron.d.ts`
- 清理 `package.json` Electron 脚本与依赖，新增 `tauri:dev`、`tauri:build`
- 保留 Vite 构建脚本，Tauri 通过 `beforeBuildCommand` 引用前端构建产物

### 常见问题
- 若打包失败，多为缺少 Rust/签名工具或平台运行时，请按上方依赖补齐。
- Windows 需在 Windows 环境进行打包以生成可执行安装包。

