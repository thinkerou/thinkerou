---
layout: post
title: Git submodule 使用记录
categories: Git
tags: Git
---

## 一、问题背景

最近在阅读 [**grpc**](http://www.grpc.io/) 相关的代码，在阅读前需要先让代码跑起来，然后跟着 **INSTALL** 里的说明进行编译，里面有这样的步骤：

    git submodule update --init
    
这是第一次遇见 `git` 的 `submoduel` 参数，从参数名字可以大概知道是要干什么事，但是具体是如何做的并不知道，所以有必要认真阅读 `git` 的 `submoduele` 参数相关的资料来了解其使用。


## 二、使用详情

先来看看命令 `git submodule help` 输出的信息：

    thinkerou@MacBook-Pro-thinkerou:~/Documents/thinkerou.github.io$ git submodule help
    usage: git submodule [--quiet] add [-b <branch>] [-f|--force] [--name <name>] [--reference <repository>] [--] <repository> [<path>]
    or: git submodule [--quiet] status [--cached] [--recursive] [--] [<path>...]
    or: git submodule [--quiet] init [--] [<path>...]
    or: git submodule [--quiet] deinit [-f|--force] [--] <path>...
    or: git submodule [--quiet] update [--init] [--remote] [-N|--no-fetch] [-f|--force] [--checkout|--merge|--rebase] [--reference <repository>] [--recursive] [--] [<path>...]
    or: git submodule [--quiet] summary [--cached|--files] [--summary-limit <n>] [commit] [--] [<path>...]
    or: git submodule [--quiet] foreach [--recursive] <command>
    or: git submodule [--quiet] sync [--recursive] [--] [<path>...]
    
接下来就以 `grpc` 代码来作为示例，在 `grpc` 源代码目录下有这样一个特殊的文件：

    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ ls -la
    -rw-r--r--   1 baidu  staff     665  3 22 20:27 .gitmodules 

从文件名可以看出是跟本文讨论的 `submodule` 相关的。

<!--more-->



## 三、参考资料

> [Git submodule 使用完整教程](http://www.kafeitu.me/git/2012/03/27/git-submodule.html)

> [Git Documentation](https://git-scm.com/doc) 

> [Git 教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

> [Git 简易指南](http://www.bootcss.com/p/git-guide/)

> [Pro Git（中文版）](https://git.oschina.net/progit/)