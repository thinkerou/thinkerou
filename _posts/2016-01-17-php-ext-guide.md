---
layout: post
title: 编写 PHP 扩展入门
categories: PHP
tags: PHP
---

## 一、环境

文中示例 PHP 扩展的环境为：

 - Mac OS
 - PHP7

在开始编写 PHP 扩展前需要准备如下环境：

 - PHP7 源码
 - 使用 brew 安装 libtool

## 二、编写

环境准备好以后，就可以开始编写 `Hello world` 程序了，需要经历如下步骤：

#### 1. 进入 PHP 源码文件

    $ cd php-7.0.5/ext

#### 2. 创建扩展骨架

    $ ./ext_skel --extname=helloworld
    Creating directory helloworld
    Creating basic files: config.m4 config.w32 .gitignore helloworld.c php_helloworld.h CREDITS EXPERIMENTAL tests/001.phpt helloworld.php [done].

    To use your new extension, you will have to execute the following steps:

    1.  $ cd ..
    2.  $ vi ext/helloworld/config.m4
    3.  $ ./buildconf
    4.  $ ./configure --[with|enable]-helloworld
    5.  $ make
    6.  $ ./sapi/cli/php -f ext/helloworld/helloworld.php
    7.  $ vi ext/helloworld/helloworld.c
    8.  $ make

    Repeat steps 3-6 until you are satisfied with ext/helloworld/config.m4 and
    step 6 confirms that your module is compiled into PHP. Then, start writing
    code and repeat the last two steps as often as necessary.

使用 `ext_skel` 命令生成扩展骨架后，给出了非常详细清晰的后续流程说明，基本上跟着这些步骤来着就可以完成 `Hello world` 扩展程序了。

<!--more-->

骨架生成完成后，就会在 `ext` 目录下多一个 `helloworld` 目录，包含整个扩展所需的基本源码文件和配置文件：

    $ pwd
    /Users/thinkerou/Documents/opensource/php-7.0.5/ext/helloworld
    $ ls
    CREDITS          EXPERIMENTAL     config.m4        config.w32       helloworld.c     helloworld.php   php_helloworld.h tests
    
#### 3. 修改配置

使用任何编辑器打开 `config.m4` 文件，对文件进行适当修改即可。

    其中：文件中的 dnl 是表示行注释
    

## 三、参考资料

> [用C/C++扩展你的PHP](http://www.laruence.com/2009/04/28/719.html)

> [PHP扩展开发及内核应用](http://www.walu.cc/phpbook/) 