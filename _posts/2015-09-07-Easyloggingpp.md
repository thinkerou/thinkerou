---
layout: post
title: 一个超简单的 C++ 日志文件
categories: C++
tags: log
---

## 一、介绍

在平时的工作和学习中，编写一些 C++ 程序时，为了调式通常都是使用类似 **printf** 的函数和打断点的方式。但是，调式程序或者程序发布测试版后，记录程序执行日志也是一种比较有效的调式和收集问题信息的手段。在现在这个开源的时代，并不需要我们自己去写一套日志库（C++版），开源的已经有很多了，如：
	
> [spdlog](https://github.com/gabime/spdlog)

> [log4cplus](https://github.com/log4cplus/log4cplus)

> [boost log](https://github.com/mirror/boost)

> [glog](https://github.com/google/glog)

在 Github 上以关键字 **log** 搜索就会出来很多相关的，但是这些库中以我的了解经验来看，要数 **Easyloggingpp** 最为简单了，使用无需其他任何外部依赖，仅有一个 **easyloggin++.h** 头文件。下文就对此做一些简要介绍，以作记录。