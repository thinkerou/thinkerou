---
layout: post
title: MySQL 快速入门
categories: Database
tags: MySQL Shell
---

## 一、概览

最近开始在 `LNMP` 环境下进行工作，虽说对于 `MySQL` 这块内容暂时还排不上时间进行深入学习，比如阅读[《高性能 MySQL》](http://book.douban.com/subject/23008813/)等书籍，但是对于一些基本操作、基本语句还是需要先系统进行学习。

#### 1. 安装 MySQL

> 本文里的安装环境为：Mac OS X

在[《Nginx 与 PHP 环境搭建》](http://thinkerou.com/2015-11/nginx-php-fpm/)一文里已经提到，在 Mac 上使用 `brew` 来进行安装包的管理，使用如下命令安装 mysql：

> brew install mysql

安装成功后，MySQL 的各种信息会出现在目录下：

> /usr/local/Cellar/mysql/5.7.9

该目录下有这样一些文件：

	COPYING						include
	INSTALL-BINARY				lib
	INSTALL_RECEIPT.json		mysql-test
	README						scripts
	bin							share
	homebrew.mxcl.mysql.plist	support-files

目录 `bin` 包括 `mysql`、`mysqld` 、`mysql.server` 等常见命令，具体包括：

	innochecksum				mysqladmin
	my_print_defaults			mysqlbinlog
	myisam_ftdump				mysqlcheck
	myisamchk					mysqld
	myisamlog					mysqld_multi
	myisampack					mysqld_safe
	mysql						mysqldump
	mysql.server				mysqldumpslow
	mysql_client_test			mysqlimport
	mysql_client_test_embedded	mysqlpump
	mysql_config				mysqlshow
	mysql_config_editor			mysqlslap
	mysql_embedded				mysqltest
	mysql_install_db			mysqltest_embedded
	mysql_plugin				perror
	mysql_secure_installation	replace
	mysql_ssl_rsa_setup			resolve_stack_dump
	mysql_tzinfo_to_sql			resolveip
	mysql_upgrade
	
#### 2. 操控 MySQL

这里的操控 MySQL 主要是指 `MySQL 服务`的启动、暂停、停止等操作，启动 MySQL 服务主要是 `mysql.server`、`mysqld`、`mysqld_safe`等三种方式。

使用 `mysqld` 或 `mysqld_safe` 命令启动服务时，是在 `console` 模式下运行的，而使用 `sudo mysql.server start` 命令启动服务时，则是在后台无控制台窗口下运行。

<!--more-->

> mysqld 或 mysqld --console

> mysqld_safe 执行该命令后出现如下信息：

	151201 23:38:48 mysqld_safe Logging to '/usr/local/var/mysql/MacBook-Pro-tianou.local.err'.

	151201 23:38:48 mysqld_safe Starting mysqld daemon with databases from /usr/local/var/mysql

> 意思很明显：mysqld_safe 启动的是 mysqld 的守护进程

> 使用 `mysql.server start` 命令会更加友好
	
	MacBook-Pro:~ thinkerou$ mysql.server start
	Starting MySQL
	. SUCCESS!
	
> 命令 mysql.server 有如下参数：

> start | stop | restart | reload | force-reload | status

#### 3. 启动方式的联系与区别

前面说了三种启动服务的方式，那么这三种方式又有何联系与区别呢？一种直观的区别是：`mysql.server` 和 `mysqld_safe` 是 `shell` 脚本， 而 `mysqld` 是二进制可执行文件。

首先看看 mysql.server 脚本里都有些什么信息，在脚本的开头有注释： `MySQL daemon start/stop script.` 清楚的说明了脚本的作用是启动、停止 MySQl 守护进程。同时，在前面已经看到使用 mysql.server 命令操控服务时需要带参数 start、stop 等，那么在 shell 脚本里就应该有所体现，看看具体怎么做的（*摘录 case 语句中匹配 start 的部分*）：

	case "$mode" in
	  'start')
	    # Start daemon
       
       # Safeguard (relative paths, core dumps..)
       cd $basedir
       
       echo $echo_n "Starting MySQL"
       if test -x $bindir/mysqld_safe
       then
         # Give extra arguments to mysqld with the my.cnf file. This script
         # may be overwritten at next upgrade.
         $bindir/mysqld_safe --datadir="$datadir" --pid-file="$mysqld_pid_file_path" $other_args >/dev/null 2>&1 &
         wait_for_pid created "$!" "$mysqld_pid_file_path"; return_value=$?
         
         # Make lock for RedHat / SuSE
         if test -w "$lockdir"
         then
           touch "$lock_file_path"
         fi
         
         exit $return_value
       else
         log_failure_msg "Couldn't find MySQL server ($bindir/mysqld_safe)"
       fi
       ;;
       
       
## 二、参考资料