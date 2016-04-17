---
layout: post
title: Windows 线程同步（用户态）
categories: windows
tags: windows
---

## 一、基本概念

所有线程都必须访问系统资源（如堆、串口、文件、窗口等），如果一个线程独占了对某个资源的访问，则其他线程就无法完成其工作；同时，不能让任何线程在任何时刻都能访问任何资源。

在如下两种基本情况下，线程之间需要相互通信：

>* 需要让多个线程同时访问一个共享资源，同时不能破坏资源的完整性；
>* 一个线程需要通知其他线程某项任务已经完成。

## 二、原子访问：Interlocked 系列函数

**原子访问**是指一个线程在访问某个资源的同时能够保证没有其他线程会在同一时刻访问同一资源。

有如下示例代码：

    // define a global var
	long g_x = 0
	DWORD WINAPI ThreadFunc1(PVOID pvParam)
	{
		g_x++;
		return 0;
	}

	DWORD WINAPI ThreadFunc2(PVOID pvParam)
	{
		g_x++;
		return 0;
	}

现创建两个线程分别执行 ThreadFunc1 和 ThreadFunc2 ，两个函数的代码完全相同，当两个线程都停止运行时 g_x 的值被认为是 2 。但真的是这样吗？答案是有可能。

<!--more-->

为了确保最终的值是个确定值，需要一种方法能够保证对一个值的递增操作是原子操作，即不会被打断。**Interlocked** 系列函数提供了这样的功能。

	LONG InterlockedExchangeAdd(PLONG volatile plAddend, LONG lIncrement);
	LONG InterlockedExchangeAdd64(PLONG volatile plAddend, LONG lIncrement);

是不是很简单？！只要调用这个函数，传一个长整型变量的地址和另一个增量值，函数就会保证递增操作是以原子方式进行的。从而前文的代码可以改写为：

	// define a global var
	long g_x = 0
	DWORD WINAPI ThreadFunc1(PVOID pvParam)
	{
		InterlockedExchangeAdd(&g_x, 1);
		return 0;
	}

	DWORD WINAPI ThreadFunc2(PVOID pvParam)
	{
		InterlockedExchangeAdd(&g_x, 1);
		return 0;
	}

这样一来，对 g_x 的递增操作会以原子方式进行，保证其最终的值将等于 2 。

如果只是以原子方式给一个值加 1 的话，还可以使用 **InterlockedIncrement** 函数。

>* 所有线程都应该调用 **Interlocked** 系列函数来修改共享变量的值，任何一个线程都不应该使用简单的 C++ 语句来修改共享变量。

**Interlocked 函数是如何工作的呢？**

这取决于代码运行的 CPU 平台，如果是 x86 系列 CPU，则 Interlocked 函数会在总线上维持一个硬件信号，这个信号会阻止其他 CPU 访问同一个内存地址。

>* 必须确保传给这些函数的变量地址是经过对齐的，否则可能会失败；
>* Interlocked 函数执行得非常快，调用一次 Interlocked 函数通常只占用几个 CPU 周期（通常小于50），也不需要在用户态和内核态间进行切换（切换通常需要占用1000个周期以上）。

**InterlockedExchangeAdd** 也可用来做减法（第二个参数传负数），它会返回 *plAddend 中原来的值。

	LONG InterlockedExchange(PLONG volatile plTarget, LONG lValue);
	LONGLONG InterlockedExchange64(PLONGLONG volatile plTarget, LONGLONG lValue);
	PVOID InterlockedExchangePointer(PVOID* volatile ppvTarget, PVOID pvValue);

函数 **InterlockedExchange** 和 **InterlockedExchangePointer** 会把第一个参数所指向的内存地址的当前值，以原子方式替换为第二个参数指定的值。两个函数都会返回原来的值。

如果只需要以原子方式修改一个值， **Interlocked** 系列函数非常好用。但实际编程中需要处理的数据结构都要比一个简单的 32 位或 64 位值要复杂。这就需要其他线程同步策略来解决，如关键段等。

>* volatile 关键字说明
	* 示例：volatile BOOL g_b = FALSE;
	* 它告诉编译器这个变量可能会被应用程序之外的其他东西修改，如操作系统、硬件或并发执行的线程等。
	*确切说，volatile 限定符告诉编译器不要对这个变量进行任何形式的优化，而是始终从变量在内存中的位置读取变量的值。
	* 给一个结构体加上 volatile 限定符等于给结构体中的所有成员都加 volatile 限定符，这样可以确保任何一个成员始终都是从内存中读取的。

## 三、关键段 


## 四、参考资料

> [windows 核心编程](http://book.douban.com/subject/3106542/)