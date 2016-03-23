---
layout: post
title: 更新 PHP5 扩展到 NG 记录
categories: PHP
tags: PHP
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

    map<string, int> m;
    map<string, int>::iterator it = m.begin();
    for( ; it != m.end(); )
    {
        m.erase(it++);
    }
    
这样操作就不会导致迭代器实效了，前面代码等同于如下代码：

    map<string, int> m;
    map<string, int>::iterator it = m.begin();
    for(; it != m.end(); )
    {
        map<string, int>::iterator tmp = it;
        ++it;
        m.erase(tmp);
    }
    
即在 `erase` 操作前先将其迭代器保存起来，然后递增后再操作，这些步骤组合在一起也即是 `it++` 的含义。
