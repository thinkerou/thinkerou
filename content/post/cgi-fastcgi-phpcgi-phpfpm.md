---
title: 细说 CGI、FastCGI、PHP-CGI 和 PHP-FPM 的关系
categories: [
  "PHP"
]
tags: [
  "PHP"
]
date: 2015-10-18
image: "simple.jpg"
---

## 概念总结

刚开始学习的 PHP 的时候，就会被几个词搞混：`CGI`、`FastCGI
`、`PHP-CGI`、`PHP-FPM`，它们都是干什么活的？之间又有些什么联系和区别呢？接下来就先介绍它们的概念。

#### 1. CGI

**CGI** 是 `Common Gateway Interface` 的缩写，可以使客户端从网页浏览器向执行在网络服务器上的程序请求数据，它描述了客户端与服务器程序之间进行数据传输的标准，是一种`协议`。

#### 2. FastCGI

顾名思义，是 CGI 的改进版，也是一种协议，实现上是一个常驻进程，它会一直运行着，在请求到来时不会重新启新进程去处理（ CGI 为 fork-and-execute 模式）。

FastCGI 把 PHP 语言和 Web 服务器分开，故 Nginx 和 PHP 通常可以部署在不同机器上，以减轻 Nginx 和后端的压力。

> FastCGI 的主要特点有：

> 语言无关的、可伸缩架构的 CGI 开放扩展

> 将 CGI 解释器进程保持在内存中以此获取高性能

> 不依赖任何 web 服务器内部架构

> 平滑重新加载配置文件

**FastCGI 的工作原理：**（*markdown画图有问题，等解决后画出流程图会更清晰*）

> Web 服务器启动时载入 FastCGI 进程管理器（运行在 Web 服务器中）；

> FastCGI 进程管理器自身初始化，启动多个 CGI 解释器进程（可以看见有多个 PHP-CGI 进程），等待 Web 服务器的连接请求；

> 当客户端请求到达 Web 服务器时，FastCGI 进程管理器选择并连接到其中一个 CGI 解释器，Web 服务器将 CGI 环境变量和标准输入传给 FastCGI 子进程 PHP-CGI；

> FastCGI 子进程完成处理后将标准输出和错误信息从同一连接返回给 Web 服务器，当 FastCGI 子进程关闭连接时请求也就完成，接着 FastCGI 子进程继续等待并处理来自 FastCGI 进程管理器的下一个连
接。

使用 FastCGI 的好处很明显：解析 PHP 配置文件、载入扩展、初始化数据结构，只在进程启动时发生一次，同时，持久数据库连接（persistent database connection）可以使用。

> FastCGI 的缺点有：

> 多进程模式，会比 CGI 多线程模式消耗更多服务器内存

#### 3. PHP-CGI

PHP-CGI 是 PHP 自带的 FastCGI 管理器。

> PHP-CGI 主要有这样的缺点：

> PHP 配置变更后需要要重启 PHP-CGI 才能生效，不可以平滑重启；

> 直接杀死 PHP-CGI 进程后 PHP 就不能运行了，即守护进程不能平滑重新生成新的子进程。

#### 4. PHP-FPM

PHP-FPM 是一个 PHP FastCGI 管理器，是只用于 PHP 的，它提供了更好的 PHP 进程管理方式，可以有效控制内存和进程、可以平滑重载 PHP 配置。

**总结：**

> CGI & FastCGI ：是一种通信标准，是协议；

> PHP-CGI ：是一个程序，用来解释 PHP 脚本；

> PHP-FPM ：是一个只用于 PHP 的进程管理器，提供更好的 PHP 进程管理方式，可以有效控制进程，平滑地加载 PHP 配置文件。


## 参考资料

- [FastCGI](http://www.fastcgi.com/drupal/)

- [PHP-FPM](http://php-fpm.org/)

- [PHP 手册：FastCGI 进程管理器（FPM）](http://php.net/manual/zh/install.fpm.php)

> [segmentfault 讨论贴](http://segmentfault.com/q/1010000000256516)
