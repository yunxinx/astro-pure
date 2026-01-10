---
title: 使用 WSL2 的一些注意事项
description: 'WSL2 使用建议：包含发行版管理工具推荐、终端卡顿解决方案、网络配置、Docker 使用建议和内网穿透设置等实用技巧'
publishDate: '2025-07-17 12:33:22'
updatedDate: '2026-01-10 14:22:00'
tags:
  - WSL2
---

> 这个文章的内容最先发布在 L 站上，如果你想要看原帖则可以移步至[链接](https://linux.do/t/topic/784102/5)

>但是这个原贴内容是旧的不准确的，建议还是以下面内容为准，我 2026年01月10日 更新修复了不少描述问题，不过可能还是会有一些细节没有表述到位，见谅。碰到疑问可以看看官方 wsl 文档或者问问 AI 也是个不错的选择

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

1. 关于 WSL2 使用代理（mirrored 网络情况下）

首先自己主机上开启系统代理后，wsl2 会弹出“检测到代理已经更改，请重启生效”类似的提示，这个时候如果不嫌麻烦，请在确认没有在 wsl 中执行任何任务或者操作并且保存好文件后，以管理员身份（似乎不用管理员也可以）打开 PowerShell 或 命令提示符（也就是 CMD），输入 `wsl --shutdown` 命令并按下回车键，此命令将关闭所有正在运行的 WSL 实例并终止 WSL 2 的虚拟机。然后等待 7s 左右再启动即可生效

如果觉得这个麻烦，可以在 wsl 的配置文件中，比如 `.zshrc` 中添加：

```bash
proxy () {
  export HTTP_PROXY="http://127.0.0.1:8888"
  export HTTPS_PROXY="http://127.0.0.1:8888"
  export ALL_PROXY="socks5://127.0.0.1:8888"
  export http_proxy="http://127.0.0.1:8888"
  export https_proxy="http://127.0.0.1:8888"
  export all_proxy="socks5://127.0.0.1:8888"
  echo "Proxy environment variables set."
}

unproxy () {
  unset HTTP_PROXY HTTPS_PROXY ALL_PROXY
  unset http_proxy https_proxy all_proxy
  echo "Proxy environment variables cleared."
}

proxy_status(){
  echo "HTTP_PROXY: $HTTP_PROXY"
  echo "HTTPS_PROXY: $HTTPS_PROXY"
  echo "ALL_PROXY: $ALL_PROXY"
}
```

这样的代码，其中 `8888` 需要修改为代理软件实际监听的端口。然后保存（可能需要新开终端或者用 `source .zshrc` 命令刷新一下）后输入 `proxy` 命令即可开启代理。开启之后可以通过 `curl -I google.com` 类似命令查看是否返回有效内容。如果不需要使用了，则可以用 `unproxy` 命令取消代理，通过 `proxy_status` 命令可以查看当前终端的代理配置情况

值得一提的是，如果使用的是 Windows 自带的 Terminal 软件打开 wsl 的终端窗口的话，只要先启动代理后启动 wsl，那么 Windows 会自动在你通过 Terminal 打开的终端中配置好代理环境变量，因此如果使用的流程是：“开代理 -> 使用 Windows Terminal 软件打开 wsl（wsl 会自动启动）”。这样的顺序的话，就无需在自己的配置文件中写入上分的命令，日常直接使用即可

配置命令是面向使用 vscode 连接 wsl 或者同一局域网连接 wsl 或者是通过内网传统等其他的手段进行远程 ssh 连接的时候，如果不这样配置的话，哪怕运行着 wsl 的 Windows 主机开了系统代理，默认也不会有正确的环境变量，导致无法正确使用代理（如果觉得写配置文件麻烦，可以通过 TUN 模式代理或者软路由方式上网，这样的话就无需这么折腾了）

2. 在 Windows 上面使用 Docker

但是实际上 Docker Desktop 在 Windows 上面的体验很差。我建议是不要使用 Docker Desktop，而是直接在 WSL2 中原生安装 Docker 使用。

WSL2 启动很快，远比使用 Docker Desktop 方便，而且因为使用的是镜像模式的网络共享方案，在 WSL2 中启动好 Docker 容器后，可以原生地使用 `localhost:<端口号>` 的方式来访问 WSL2 中的容器服务

3. 关于内网穿透

如果想要实现内网穿透然后远程访问的效果，需要先在 WSL2 中启用 SSH 服务，并且设定好端口号和验证方式（我选择的是密钥认证，关闭密码认证，因为一般情况下，内网穿透就意味着将自己内网的服务暴露到公网，如果没有额外的配置安全手段的话，是很危险的一件事情），然后在的 Windows 防火墙中放通所设定的端口（比如设置 SSH 端口为高位的 25588 而不是默认的 22 的话，就需要在防火墙中开放 25588 端口准入，协议选择 TCP 即可），最后使用内网穿透软件将自己电脑上对应的端口比如 25588 映射出去，外部主机通过映射出来的地址直接进行连接即可

4. 关于终端

在 Windows 上，使用自带的 Windows Terminal 就可以规避大部分问题，不过为了有更好的体验，我建议准备一个能够支持显示图标的字体（避免在使用一些工具比如 Claude Code 等 TUI 工具出现图标缺失显示方括号或者一些其他的奇奇怪怪的字符的问题）

Windows Terminal 默认使用的字体我不太记得是什么了，因为我是直接修改字体为我常用的 [Maple Mono NF](https://font.subf.dev/zh-cn/) 字体的，我也推荐一下这个字体，个人觉得还不错

安装好之后，在 Windows Terminal 的设置的默认值里面可以修改字体为自己下载好的字体，选择好之后保存即可

5. 暂时只想到这么多。。。。

最后放一下我的 `wsl.config` 文件给大家参考一下（其实一般情况下不需要配置这么麻烦，保持默认即可，最有必要配置的可能就是 mirrored 的网络连接方式了）：

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

配置文件中的内容作用都可以在微软的官方文档找到，有些配置是我很久之前写的，实际作用我自己也不太记得了，但是我用起来倒是还行

其实还有一点点配置有可能是需要修改 wsl 里面的一个配置文件的，我记得是关于 `systemctl` 的启用的。但是我后面使用新的发行版的时候似乎不需要显式地修改配置文件去配置了，而是默认启用了 `systemctl` 的支持，因此就更加不需要怎么修改配置文件了，只要确保上网方式是 mirrored 即可（好像 Windows 10 的一个版本号之后才支持，如果系统太老了也是不支持的，Windows 11 默认支持）
