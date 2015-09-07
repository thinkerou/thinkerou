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

## 二、示例

在编写 C++ 应用时，通常是以 EXE 或者 DLL 的形式存在，对于这两种不同形式，使用 Easyloggingpp 也有所区别。

#### 1. 在 EXE 工程中使用 Easyloggingpp

先看代码，如：

	#include "easylogging++.h"

	INITIALIZE_EASYLOGGINGPP

	int main(void)
	{
   		LOG(INFO) << "easylogging++ test!";
   		return 0;
	}

代码看起来很简单，主要做了三件事：

> a. 引入 **easylogging++.h** 头文件

> b. 使用初始化宏进行初始化

> c. 使用日志宏进行日志输出（记录到文本）

#### 2. 在 DLL 工程中使用 Easyloggingpp

在 DLL 工程中使用时，有所区别，代码如：

	// tells easylogging++ that it's used for DLL
	#define ELPP_AS_DLL
	// tells easylogging++ to export symbols
	#define ELPP_EXPORT_SYMBOLS

	#include "easylogging++.h"

	INITIALIZE_EASYLOGGINGPP

	int main(void)
	{
   		LOG(INFO) << "easylogging++ test!";
   		return 0;
	}

<!--more-->

正如注释所说，需要使用宏 **ELPP_AS_DLL** 告诉 easylogging++ 是以 DLL 方式在使用它。

#### 3. 其它简要说明

Easyloggingpp 也支持配置文件方式来定义输出格式。

关于 Easyloggingpp 的更多详细内容请阅读其 Github 上的说明，以及在实际项目或自己的小程序中使用以体会。

## 三、参考文献

> [Eaysloggingpp Github 地址](https://github.com/easylogging/easyloggingpp)

> [在单元测试中使用 Easyloggingpp 示例](https://github.com/thinkerou/gtest-dll-test)

