---
title: GRPC 入门
categories: [
  "grpc"
]
tags: [
  "GRPC"
]
date: 2016-02-28
image: "stuck.jpg"
---

## 开始 grpc 

最近准备开始看看 [grpc](https://github.com/grpc/grpc) 相关代码，那首先得让其跑起来，以下记录安装步骤：

注：系统为 mac

### 1. 安装 grpc core

主要是修改 url 路径，否则会被强。

> clone 代码

> 修改 .gitmodules 和 .git/config 里 boringssl 的url为：https://github.com/google/boringssl.git

> 运行 git submodule update --init 下载 third_party 文件

> make

> sudo make install

如此，会在 `/usr/local/lib/` 目录下产生 `libgrpc.a` 和 `libgrpc.dylib` 等文件。

### 2. 安装 cpp example

验证安装 grpc 核心库成功。

> cd examples/cpp/route_guide

> make

> ./route_guide_server

> ./route_guide_client

## 参考资料

- [grpc Github 主页](https://github.com/grpc/grpc)

- [grpc 文档](http://www.grpc.io/docs/)


