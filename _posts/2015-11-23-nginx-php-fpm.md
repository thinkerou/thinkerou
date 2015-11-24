---
layout: post
title: Nginx 与 PHP 环境搭建 
categories: PHP Nginx
tags: PHP Nginx php-fpm
---

## 一、基础工具

为了快速便捷的在本机（Mac OS）上搭建 Nginx+PHP 环境，首先安装 OS X 系统中最受欢迎的包管理工具 [Homebrew](http://brew.sh/)。

使用如下命令进行 Homebrew 安装：

> ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Homebrew 有如下常用的命令：

> brew install <package_name> #安装一个包

> brew update #更新 Homebrew 在服务端上的包目录

> brew upgrade <package_name> #更新一个包

> brew list --versions #查看已安装的包列表（包括版本号）

## 二、Nginx 与 PHP 安装

#### 1. PHP 与 PHP-FPM 环境设置

Mac 系统已经自带安装了 PHP 环境，所以这里不再安装，可以使用如下命令查看自带版本是否为需要的版本：

> php -v

> php-fpm -v

验证版本满足需求后即可，否则使用 `brew install` 进行安装。

然后就可以使用命令 `php-fpm`（非管理员会有 warning 信息，忽略即可）或者命令 `sudo php-fpm` 启动 php-fpm 进程了，如果提示默认端口 `9000` 被占用，则需要更改 `php-fpm.conf` 配置文件里的端口号。

<!--more-->

> 需要特别注意的是，如果更改了默认端口号，则必须同时更改 Nginx 的配置文件 `nginx.conf` 里对应的端口号。
 
可以使用如下命令查看 php-fpm 进程是否正确启动：

> lsof -Pni4 | grep php

> ps -ef | grep php

> kill -9 xxx #关闭 php-fpm 进程，xxx 为 `ps -ef | grep php` 命令查出的 php-fpm 进程 id，通常有三个进程

#### 2. Nginx 环境设置

使用 `brew` 进行 Nginx 安装：

> brew install nginx

Nginx 有如下常用命令：

> sudo nginx #启动nginx

> sudo nginx -s reload #重启nginx

> sudo nginx -s stop #停止nginx

> nginx -t #测试配置是否有语法错误

使用命令 `sudo nginx` 启动 Nginx 后，在浏览器里输入 `127.0.0.1:8080` （默认端口为 `8080`）即可看见 Nginx 的欢迎页面。

## 三、设置 Nginx 的 PHP-FPM 配置

打开 `nginx.conf` 配置文件，打开默认注释掉的 PHP location 设置，修改为如下：

    location ~ \.php$ {
        root html;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        #fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    } 
    
同时修改 `php-fpm.conf` 配置文件中的 `listen` 为：

    listen = 127.0.0.1:9000
    
也即是去掉前面的 `;` 注释符号。

正如在第二部分提到的，如果修改了默认端口号 `9000`，则前面的 Nginx 配置文件里的 `fastcgi_pass` 字段的端口 `9000` 也需要随着改变。

编写一个测试文件 `test.php` 并放在 `html`（使用 `brew` 安装 Nginx，则该目录为 `/usr/local/Cellar/nginx/1.8.0/html/`） 目录下，内容为：

    <?php
        echo "Hello world.";
    ?>
    
正确（重新）启动 Nginx 和 PHP-FPM 后，访问 `127.0.0.1:8080/test.php` 则会看到页面显示 `Hello world.` 内容。

> **常见错误**

> * 页面空白：检查 `fastcgi_param` 参数路径是否正确。

> * 页面提示语法错误：通常是修改了默认端口 `9000`，修改了一个地方另一个地方没有修改。
 
## 四、参考资料

> [Beginner's Guide](http://nginx.org/en/docs/beginners_guide.html)

> [PHP FastCGI Example](https://www.nginx.com/resources/wiki/start/topics/examples/phpfcgi/)

> [nginx php-fpm安装配置](http://www.nginx.cn/231.html)

> [Install Nginx, PHP-FPM, MySQL and phpMyAdmin on OS X Mavericks or Yosemite](http://blog.frd.mn/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/)