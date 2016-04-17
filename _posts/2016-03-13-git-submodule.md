---
layout: post
title: Git submodule 使用记录
categories: Git
tags: Git
---

## 一、问题背景

对于 C++ STL 中的 `map` 都不陌生，但是对其 `erase` 操作后的迭代器使用是否遇到过问题呢？看如下代码：

    map<string, int> m;
    map<string, int>::iterator it = m.begin();
    for( ; it != m.end(); ++it)
    {
        m.erase(it);
    }
    
这样操作会引起程序崩溃，因为 `erase` 后迭代器就实效了，再根据迭代器进行操作当然就会导致程序崩溃。

## 二、解决方案

解决这个问题的方法也很简单，如果熟悉 `it++` 操作的含义，就会瞬间想到该怎么做，代码如下：

