---
layout: post
title: 【译】Go map [译] 
categories: Golang
tags: Golang
---

## 一、问题描述

在 [Github 上 Fork 项目后如何同步源项目的更新](http://thinkerou.com/2016-03/git-fork-sync/) 一文中已经介绍了 **Fork 别人项目后如何同步其更新**，本文要介绍的是 **Fork 别人项目后如何提交 PR？** 

## 二、解决方案

在修改 Fork 的项目前需要先[**同步源项目的更新**](http://thinkerou.com/2016-03/git-fork-sync/)，然后再修改 Fork 的项目并提交。

> 这里提交是指提交到 Fork 到自己名下的项目

接下来就开始解决 **Fork 别人项目后如何提交 PR？**，需要如下几个步骤：

#### 1. 进入 Fork 的项目的 Github 页面

>
    如：https://github.com/thinkerou/grpc

#### 2. 点击页面的 **New pull request**

>
    会有一些支线选择，请根据源项目的贡献说明来选择，如：选择 master
    
#### 3. 编写相关说明并提交
    
#### 4. 如果是第一次提交 PR 需要 CLA 认证

>
    根据提示申请 CLA 认证后，回复 I signed it! 之后，就会出现 cla: yes 标签，如果没有 CLA 认证该标签为 cla: no
     
#### 5. 然后就是等待各种测试通过

>
    如果没有通过，则根据日志查看是否是代码问题
    
#### 6. 测试都通过后就等待管理员 review 代码后评估是否 Merged

至此，就完美解决了 **Fork 别人项目后如何提交 PR？**的问题！

<!--more-->

## 三、参考资料

> [Go maps in action](https://blog.golang.org/go-maps-in-action)

