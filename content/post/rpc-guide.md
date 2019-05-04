---
title: RPC 原理初尝 
categories: [
  "GRPC"
]
tags: [
  "GRPC"
]
date: 2016-05-15
image: "stuck.jpg"
---

## 背景

在很早以前就了解过点 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 相关的概念，就仅此而已，写的那点网络示例程序也都是本机调用的，直到最近学习 [gRPC](http://www.grpc.io/) 才发现还有好多知识需要学习，或许部分原因也是由于以前的工作内容主要是客户端的吧。

现在接触的是服务端相关的东西，所以有必要好好学习下 RPC 等相关知识，公司系统涉及很多服务且都部署在不同的地域不同的机器上，维护也是由不同的团队维护的。

所以就需要学习如何编写、部署、搭建新的服务？如何依赖、调用其他服务？如何发布新服务给其他团队使用？等等。

## RPC 介绍

### 1. RPC 简介

 - RPC 是 Remote Procedure Call 的缩写, 即远程过程/函数调用
 - RPC 用于进程间或跨网络通讯
 - RPC 具有很好的横向扩展能力, 更适合网络/分布式环境通讯

### 2. RPC 原理

RPC 主要涉及到的角色有：

 - Client
 - Client Stub
 - Server
 - Server Stub

详细原理请[原理图](/static/image/rpc.jpg)进行查看(注：图片来源于参考资料4)。

![原理图](/static/image/rpc.jpg)

根据该原理图可知，完成一次 RPC 需要经历这样几个步骤：

> 1）Client 以本地调用方式调用服务

> 2）Client Stub 接收调用后将方法、参数等组装成能够进行网络传输的消息体（编码）

> 3）Client Stub 找到服务地址，并将消息发送到服务端

> 4）Server Stub 收到消息后进行解析（解码）

> 5）Server Stub 根据解码结果调用本地的服务

> 6）本地服务执行并将结果返回给 Server Stub

> 7）Server Stub 将返回结果打包成消息并发送给 Client（编码）

> 8）Client Stub 接收到消息，并进行解析（解码）

> 9）Client 得到最终结果完成调用

### 3. RPC 核心概念

 - 调用者 (只管发出请求, 而不需要关心是谁如何去完成)
 - 被调用者 (只负责完成请求, 而不需要关心是谁需要该数据)
 - 调用者和被调用者的中间代理(RPC调用框架)
 - 数据打包方式
 - 数据传输方式

### 4. gRPC 如何做的？

根据前述可以大致了解 RPC 的原理、流程了，那么具体完成一个 RPC 框架需要做些什么？会有哪些难点？如何解决？等等。

结合最近在阅读的 gRPC 框架和参考资料，列出后续在阅读 gRPC 框架时需要解决、总结的问题：

 - gRPC 如何做到透明化远程服务调用？
 - gRPC 如何对消息进行编码和解码？
   - 消息数据结构使用 Proto Buffer
   - 序列化反序列化
 - gRPC 如何进行网络通信？
   - 使用什么网络通信模型，NIO？BIO？or other？
   - RequestID

### 5. 如何发布新服务？

后续准备结合 zookeeper 或者 etcd 和 gRPC 来研究，尽请期待。

## 参考资料

- [Remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call)

- [Remote Procedure Calls (RPC)](https://www.cs.cf.ac.uk/Dave/C/node33.html)

- [GRPC](http://www.grpc.io/)

- [你应该知道的RPC原理](http://www.cnblogs.com/LBSer/p/4853234.html)
