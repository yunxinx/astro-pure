---
title: 使用 WSL2 的一些注意事项
description: 'WSL2 使用建议：包含发行版管理工具推荐、终端卡顿解决方案、网络配置、Docker 使用建议和内网穿透设置等实用技巧'
publishDate: '2025-07-17 12:33:22'
tags:
  - WSL2
---

> 这个文章的内容最先发布在 L 站上，如果你想要看原帖则可以移步至[链接](https://linux.do/t/topic/784102/5)

我使用 WSL2 的一般情况是 Windows 电脑放在固定的位置，然后启动内网穿透服务，再在外面用 Macbook 远程 ssh 连接使用。

先补充一下我的 Windows 电脑系统情况：

> Windows 版本：24H2 专业版
>
> 操作系统版本：26100.4652
>
> 已经通过 `wsl --update` 升级到最新版本（2025-07-14）
>
> WSL2 发行版：Ubuntu 24.04

## 辅助工具分享

WSL Manager 项目地址：https://github.com/bostrot/wsl2-distro-manager

<img src="https://free.picui.cn/free/2025/08/31/68b3cea5a4150.webp" alt="image-20250715153030328.webp" style="zoom:33%;" />

这个是个发行版管理工具，图形化地管理和创建 WSL2 实例，并且可以在创建的时候就修改数据存放的位置，不需要一开始通过 Microsoft Store 下载发行版后再用命令迁移数据位置，并且可以直接搜索需要创建的镜像和进行下载创建等高级功能（支持中文，详细内容使用方法移步到项目地址，免安装下载后即点即用；实例创建的时候如果无法搜索发行版，请开启 TUN 模式即可解决）

## 解决终端卡顿的方法

有时候 WSL2 内置终端在输入命令的时候会出现输出延迟感，这个是因为 WSL2 默认将 Windows 的环境变量加载到了系统里。WSL2 默认会进行遍历环境变量，而 WSL2 访问 Windows 的 I/O 性能并不理想，因此导致卡顿，尤其是如果你也将 bash 切换为了 zsh 并且安装配置好了 Oh-my-zsh 的命令高亮提示插件后，卡顿感觉更为明显

解决方案也简单，直接禁用 WSL2 访问 Windows 的环境变量即可

编辑 `/etc/wsl.conf` 文件，添加如下内容：

```text
[interop]
appendWindowsPath=false
```

然后再编辑 `/etc/profile` 文件，将自己需要挂载的目录添加进去，我默认只添加了一个路径，你可以根据情况自己修改用户名和路径情况：

```bash
export PATH="$PATH:/mnt/c/Users/idea/AppData/Local/Microsoft/WindowsApps"
```

重启 WSL2 即可解决问题

## 其他的一些补充

1. 关于 WSL2 的代理问题，似乎只要 Windows 上面开启系统代理，然后 WSL2 就会弹出通知说自己检测到了代理的更改。重启一次 WSL2 即可使代理在 WSL2 中生效，并且似乎是全局代理，无须使用 TUN 模式

2. 我猜测可能有部分佬友使用 WSL2 的原因，是为了在 Windows 上面使用 Docker，但是实际上我可以说 Docker Desktop 在 Windows 上面的体验很差。我建议是不要使用 Docker Desktop，而是直接在 WSL2 中原生安装 Docker 使用。WSL2 启动很快，远比使用 Docker Desktop 方便，而且因为使用的是镜像模式的网络共享方案，在 WSL2 中启动好 Docker 容器后，可以原生地使用 `localhost:<端口号>` 的方式来访问 WSL2 中的容器服务

3. 关于内网穿透问题，如果想要实现内网穿透然后远程访问的效果，需要先在 WSL2 中启用 SSH 服务，并且设定好端口号和验证方式（我选择的是密钥认证，关闭密码认证），然后在你的 Windows 防火墙中放通所设定的端口。如果你采用的是 Mirrored 的网络连接方式，那么就可以进行穿透和连接了，因为 WSL2 和宿主机的 IP 是一致的。如果是其他的网络共享方式，这个就需要自行查找资料了

4. 暂时只想到这么多。。。。

最后放一下我的 `wsl.config` 文件给大家参考一下：

```text
[wsl2]
processors=12
firewall=true
networkingMode=mirrored
dnsProxy=false
dnsTunneling=false
memory=17179869184
swap=8589934592

[experimental]
hostAddressLoopback=true
```

配置文件中的内容作用都可以在微软的官方文档找到，有些配置是我很久之前写的，实际作用我自己也不太记得了，但是我用起来倒是还行。
