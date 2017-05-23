---
layout: post
title: Go 语言 sync 包使用记录
categories: Go
tags: Go
---

在 Go 语言中 `sync` 包提供了互斥锁、读写锁等基本同步原语，除了 `Once` 和 `WaitGroup` 类型外，其他类型基本都是为底层函数库而准备，上层次的同步最好还是通过 `channel` 来完成。

更多更全的信息和使用说明请见[官网文档](https://golang.org/pkg/sync/)

<!--more-->

### 1. Mutex 类型    

一个 Mutex 就是一个互斥锁，这类锁可以用作其他结构的一部分，Mutex 的零值是一个**未上锁**的互斥锁。

Mutex 类定义为：

	// A Mutex is a mutual exclusion lock.
	// Mutexes can be created as part of other structures;
	// the zero value for a Mutex is an unlocked mutex.
	//
	// A Mutex must not be copied after first use.
	type Mutex struct {
		state int32
		sema  uint32
	}
	
Mutex 类实现了 `Locker` 接口：

	// A Locker represents an object that can be locked and unlocked.
	type Locker interface {
		Lock()
		Unlock()
	}
	
#### 1.1 Lock 方法

Lock 方法原型为：

    func (m *Mutex) Lock() {}
    
对 m 进行加锁，如果 m 已经被加锁，则执行该方法的 goroutine 将被阻塞直到 m 可用为止。

#### 1.2 Unlock 方法

Unlock 方法原型为：

    func (m *Mutex) Unlock() {}
    
对 m 进行解锁，如果 m 并未加锁，则会引发一个运行时错误。被加锁的 Mutex 并不与特定的 goroutine 绑定，在一个 goroutine 里面对 Mutex 进行加锁，然后在另一个 goroutine 里面对 Mutex 进行解锁，这是可行的。

### 2. WaitGroup 类型

一个 WaitGroup 会等待一系列 goroutine 直到它们**全部**运行完毕。主 goroutine 通过调用 `Add` 方法来设置需要等待的 goroutine 数量，而每个运行的 goroutine 在它们运行完毕时调用 `Done` 方法，调用 `Wait` 方法可以阻塞直到所有 goroutine 都运行完毕为止。

WaitGroup 类型定义为：

	// A WaitGroup waits for a collection of goroutines to finish.
	// The main goroutine calls Add to set the number of
	// goroutines to wait for. Then each of the goroutines
	// runs and calls Done when finished. At the same time,
	// Wait can be used to block until all goroutines have finished.
	//
	// A WaitGroup must not be copied after first use.
	type WaitGroup struct {
		noCopy noCopy
	
		// 64-bit value: high 32 bits are counter, low 32 bits are waiter count.
		// 64-bit atomic operations require 64-bit alignment, but 32-bit
		// compilers do not ensure it. So we allocate 12 bytes and then use
		// the aligned 8 bytes in them as state.
		state1 [12]byte
		sema   uint32
	}
	
#### 2.1 Add 方法

Add 方法原型为：

    func (m *WaitGroup) Add(delta int) {}
    
为 WaitGroup 计数器加上给定的增量 delta 值，其中 delta 值可以为负数。

当计数器的值变为 0 时，所有被 Wait 阻塞的 goroutine 都将被释放，当计数器的值变为负数时，Add 调用将引发一个 panic。

**注意：**Add 操作必须在创建 goroutine 的语句之前调用，或者在其他需要等待的事件之前调用；在重复使用同一个 WaitGroup 对不同的独立事件集合进行等待时，新的 Add 调用必须发生在之前的所有 Wait 调用均已返回的情况时。

#### 2.2 Done 方法

Done 方法原型为：

    func (m *WaitGroup) Done() {}
    
对 WaitGroup 计数器执行减 1 操作。

#### 2.3 Wait 方法

Wait 方法原型为：

    func (wg *WaitGroup) Wait()
    
它会阻塞直到 WaitGroup 计数器的值为 0 为止。

#### 2.4 示例

该示例会并发的获取给定的多个url的返回值，并使用WaitGroup进行租塞，直到所有获取操作都已完成。

	var wg sync.WaitGroup
	var urls = []string{
	        "http://www.golang.org/",
	        "http://www.google.com/",
	        "http://www.somestupidname.com/",
	}
	for _, url := range urls {
	        // 对 WaitGroup 计数器执行加一操作
	        wg.Add(1)
	        // 启动一个 goroutine ，用于获取给定的 URL 
	        go func(url string) {
	            // 在 goroutine 执行完毕时，对计数器执行减一操作
	            defer wg.Done()
	            // 获取 URL
	            http.Get(url)
	        }(url)
	}
	
	// 等待直到所有 HTTP 获取操作都执行完毕为止
	wg.Wait()