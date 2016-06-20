---
layout: post
title: 【读书笔记】The Art of Readable Code
categories: 读书笔记 
tags: 读书笔记 
---

## 一、前言

### 第一章、代码应当易于理解

众所周知，这段代码：

    for (Node* node = list->head; node != NULL; node = node->next)
        Print(node->data);
        
要比如下代码更好（尽管行为完全相同）：

    Node* node = list->head;
    if (node == NULL) return;
    while (node->next != NULL) {
        Print(node->data);
        node = node->next;
    }
    if (node != NULL) Print(node->data);
    
但大多时候这个选择很难把握，如这段代码：

    return exponent >= 0 ? mantissa * (1 << exponent) : mantissa / (1 << -exponent);
    
它会比如下代码更好还是更差呢？

    if (exponent >= 0) {
        return mantissa * (1 << exponent);
    } else {
        return mantissa / (1 << -exponent);
    }

前一版更紧凑而后一版更简单直接。哪个标准更重要？在实践中又是如何选择的呢？

<!--more-->

> **可读性基本定理**

> 代码的写法应当使别人理解它时所需要花费的时间最小化

**代码量总是越小越好吗？**

通常而言，解决问题所用的代码越少越好。但较少的代码并不总是好的，如这段代码：

    assert((!(bucket = FindBucket(key))) || !bucket->IsOccupied());
    
理解起来就比如下两行代码花费时间更多：

    bucket = FindBucket(key);
    if (bucket != NULL) assert(!bucket->IsOccupied());
    
**请记住：可读性基本定理总是先于其它条例或原则**


## 二、表层次的改进

### 第二章、把信息装到名字里

### 第三章、不会误解的名字

### 第四章、审美

### 第五章、该写什么样的注释


### 第六章、写出言简意赅的注释

## 三、简化循环和逻辑

## 四、重新组织代码

## 五、精选话题

## 六、深入阅读

