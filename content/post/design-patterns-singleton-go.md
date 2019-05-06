---
title: 如何在 Go 语言中实现单例模式
description: ""
categories: [
  "设计模式",
  "GO",
]
tags: [
  "设计模式",
  "GO",
]
author: "thinkerou"
date: 2017-05-14
image: 'posts/mill-4166018_1280.jpg'
---

有关单例模式的相关内容可以参考[《设计模式之单例模式》](http://thinkerou.com/2017-02/design-patterns-singleton/)

单例模式的核心在于**保证系统中一个类只有一个实例且该实例易于外界访问**。

## 1. 非线程安全 Lazy 方式

非线程安全的单例模式是最常见的实现方式，但是它不能在多线程情况下使用，在 Go 中实现如：

```
    type Singleton struct {
        // something
    }
    
    var instance *Singleton
    
    func GetInstance() *Singleton {
        if instance == nil {
            instance = &Singleton{}
        }
        
        return instance
    }
```

这种写法对应着 CPP 中的实现方式。

## 2. 线程锁方式

在 Go 语言中提供了包 `sync/mutex` 用于构建多个 goroutine 间的同步逻辑。

在 Go 中使用线程锁实现的单例模式，如下：

```
    type Singleton struct {
        // something
    }
    
    var (
        instance *Singleton
        mtx Sync.Mutex
    )
    
    func GetInstance() *Singleton {
        mtx.Lock()
        defer mtx.Unlock()
        
        if instance == nil {
            instance = &Singleton{}
        }
        
        return instance
    }
```

## 3. 检查锁方式

正如在[文中](http://thinkerou.com/2017-02/design-patterns-singleton/)提到的**双检测锁**实现方式，在 Go 中可以实现为：

```
    type Singleton struct {
        // something
    }
    
    var (
        instance *Singleton
        mtx Sync.Mutex
    )
    
    func GetInstance() *Singleton {
        if instance == nil {
            mtx.Lock()
            defer mtx.Unlock()
            
            if instance == nil {
                instance = &Singleton{}
            }
        }
        return instance
    }
```

这种实现方式中，编译器会优化没有检查实例存储状态。如果使用 `sync/atomic` 包可以自动加载和标记状态，如下实现：

```
    package main
    
    import (
        "sync"
        "sync/atomic"
    )
    
    type Singleton struct {
        // something
    }
    
    var (
        initialized uint32
        instance *Singleton
        mtx Sync.Mutex
    )
    
    func GetInstance() *Singleton {
        if atomic.LoadUInt32(&initialized) == 1 {
            return instance
        }
        
        mtx.Lock()
        defer mtx.Unlock()
        
        if initialized == 0 {
            instance = &Singleton{}
            atomic.StoreUint32(&initialized, 1)
        }
        
        return instance
    }
```
  
如果读过 Go 源码，或许对上面的实现代码会感到熟悉，正式来源于源码中的 `once.go` 的实现方式：

```
	package sync
	
	import (
		"sync/atomic"
	)
	
	// Once is an object that will perform exactly one action.
	type Once struct {
		m    Mutex
		done uint32
	}
	
	// Do calls the function f if and only if Do is being called for the
	// first time for this instance of Once. In other words, given
	// 	var once Once
	// if once.Do(f) is called multiple times, only the first call will invoke f,
	// even if f has a different value in each invocation. A new instance of
	// Once is required for each function to execute.
	//
	// Do is intended for initialization that must be run exactly once. Since f
	// is niladic, it may be necessary to use a function literal to capture the
	// arguments to a function to be invoked by Do:
	// 	config.once.Do(func() { config.init(filename) })
	//
	// Because no call to Do returns until the one call to f returns, if f causes
	// Do to be called, it will deadlock.
	//
	// If f panics, Do considers it to have returned; future calls of Do return
	// without calling f.
	//
	func (o *Once) Do(f func()) {
		if atomic.LoadUint32(&o.done) == 1 {
			return
		}
		// Slow-path.
		o.m.Lock()
		defer o.m.Unlock()
		if o.done == 0 {
			defer atomic.StoreUint32(&o.done, 1)
			f()
		}
	}
```

看完 `once.go` 的代码，那是不是可以直接使用 `sync.Once` 来实现单例模式呢？答案是肯定的。

## 4. 更完美方式

以一个实际项目为示例来说明：

> 实现一个全局的计算器

直接使用 `sync.Once` 实现的单例模式如下：

```
    package main

    import (
        "sync"
    )

    var (
        instance *Counter
        once sync.Once
    }

    type Counter struct {
        number int
        mux sync.RWMutx
    }

    func (c *Counter) Add(n int) {
        c.mux.Lock()
        defer c.mux.Unlock()
    
        c.number += n
    }

    func (c *Counter) Sub(n int) {
        c.mux.Lock()
        defer c.mux.Unlock()
    
        c.number -= n
    }

    func (c *Counter) Get() int {
        c.mux.RLock()
        defer c.mux.RUnlock()
    
        return c.number
    }

    func GetInstance() *Counter {
        once.Do(func() {
            instance = &Counter{
                number: 0,
            }
        })
    
        return instance
    }
```

