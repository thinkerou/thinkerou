---
title: Github 上 Fork 项目后如何同步源项目的更新 
categories: [
  "Git"
]
tags: [
  "Git"
]
date: 2016-03-27
image: "read.jpg"
---

## 问题背景

最近 Fork 了 [grpc](https://github.com/grpc/grpc) 到我的 Github 帐号[grpc](https://github.com/thinkerou/grpc)下，以学习之然后记录点笔记上传，但是过段时间后发现原来的项目已经有了很多代码提交，那么我该如何将这些新提交的更新同步到我的帐号下的项目里呢？

通过查阅 [Github 帮助文档](https://help.github.com/)并通过关键字 `sync` `fork` 可以找到相应的解决方案。

## 解决方案

通过前述查阅可知，要解决 **Fork 项目后如何同步源项目的更新？**的问题，需要如下几个步骤：

#### 1. 使用 `git remote -v` 命令查看远程状态

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git remote -v
    origin	https://github.com/thinkerou/grpc.git (fetch)
    origin	https://github.com/thinkerou/grpc.git (push)

#### 2. 使用 `git remote add upstream` 命令给 Fork 的项目添加上游仓库

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git remote add upstream https://github.com/grpc/grpc.git
    
#### 3. 再次使用 `git remote -v` 查看远程状态

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git remote -v
    origin	https://github.com/thinkerou/grpc.git (fetch)
    origin	https://github.com/thinkerou/grpc.git (push)
    upstream	https://github.com/grpc/grpc.git (fetch)
    upstream	https://github.com/grpc/grpc.git (push)
    
#### 4. 使用 `git fetch upstream` 命令从上游仓库 fetch 分支到本地

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git fetch upstream
     
#### 5. 使用 `git checkout master` 命令切换到本地主干

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git checkout master
    
#### 6. 使用 `git merge upstream/master` 命令进行合并

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git merge upstream/master
    
#### 7. 使用 `git push origin master` 命令提交到 Github 项目下

>
    thinkerou@MacBook-Pro-thinkerou:~/opensource/grpc$ git push origin master

至此，就完美解决了 **Fork 项目后如何同步源项目的更新？**的问题！


## 参考资料

- [Configuring a remote for a fork](https://help.github.com/articles/configuring-a-remote-for-a-fork/)

- [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

