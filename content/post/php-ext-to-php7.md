---
title: 更新 PHP5 扩展到 PHP7(NG) 记录
categories: [
  "PHP"
]
tags: [
  "PHP"
]
date: 2016-03-06
image: "artist.jpg"
---

## 升级扩展到 PHP7 记录

最近在学习 [**PHP**](http://php.net/) 、[**grpc**](http://www.grpc.io/) 以及 `PHP(PHP7)` 扩展编写，但是由于 **PHP7 内核更新**，扩展接口也有很大变动，先前基于 PHP5 编写的扩展并不能直接基于 PHP7 进行编译安装，需要修改一定代码才能编译通过。

在更新 **grpc php 扩展**到 PHP7 过程中记录的接口变化，以 [GitHub 项目](https://github.com/thinkerou/upgrade-ext-to-php7)形式来记录。

## 参考资料

- [GitHub: 更新 PHP 扩展到 PHP7](https://github.com/thinkerou/upgrade-ext-to-php7)

- [Upgrading PHP extensions from PHP5 to NG](https://wiki.php.net/phpng-upgrading)

- [Internal value representation in PHP 7 - Part 1](http://nikic.github.io/2015/05/05/Internal-value-representation-in-PHP-7-part-1.html)

- [Internal value representation in PHP 7 - Part 2](http://nikic.github.io/2015/06/19/Internal-value-representation-in-PHP-7-part-2.html)
