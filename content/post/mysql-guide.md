---
title: MySQL 快速入门
categories: [
  "MySQL"
]
tags: [
  "MySQL"
]
date: 2015-12-13
image: "simple.jpg"
---

## 概览

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
       
从摘录的 shell 脚本可以知道，mysql.server 最终是去调用了 mysqld_safe 脚本，同时传入 `--datadir` 和 `--pid-file` 以及 `$other_args` 等参数，也即是 mysql.server 是为了方便操控 myslq 服务而存在的脚本，真正操控 mysql 服务的并不是它。

而在 mysql_safe 脚本里，启动、监控 mysql 服务是通过调用 mysqld 来实现，也就是说最终真正在干活的是通过可执行文件 mysqld 来完成的。

## MySQL 基础语句

经过上一部分介绍，使用命令 `mysql.server start` 启动 mysql 服务后，就可以开始介绍基础的 MySQL 语句了，使用如下命令启动 mysql 命令行模式：

> mysql -h address -P port -u username -p password

> mysql -u root -p

> 回车后提示输入密码，默认密码为空，直接回车即可

成功后，会出现如下内容：

	MacBook-Pro:bin thinkerou$ mysql -u root -p
	Enter password:
	Welcome to the MySQL monitor.  Commands end with ; or \g.
	Your MySQL connection id is 3
	Server version: 5.7.9 Homebrew
	
	Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.
	
	Oracle is a registered trademark of Oracle Corporation and/or its
	affiliates. Other names may be trademarks of their respective
	owners.
	
	Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
	
	mysql>
	
然后，就可以在这里做操作，比如：

> show processlist; # 查看哪些进程在运行

	mysql> show processlist; # test
	+----+------+-----------+------+---------+------+----------+------------------+
	| Id | User | Host      | db   | Command | Time | State    | Info             |
	+----+------+-----------+------+---------+------+----------+------------------+
	|  3 | root | localhost | NULL | Query   |    0 | starting | show processlist |
	+----+------+-----------+------+---------+------+----------+------------------+
	1 row in set (0.00 sec)

> show variables like "port"; # 查看端口号

	mysql> show variables like "port";
	+---------------+-------+
	| Variable_name | Value |
	+---------------+-------+
	| port          | 3306  |
	+---------------+-------+
	1 row in set (0.00 sec)

#### 1. 数据库操作

> show databases[ like "pattern"]; # 查看当前有哪些数据库

	mysql> show databases;
	+--------------------+
	| Database           |
	+--------------------+
	| information_schema |
	| mobile             |
	| mysql              |
	| performance_schema |
	| sys                |
	+--------------------+
	5 rows in set (0.00 sec)
	
> use dbname; # 使用 dbname 数据库

	mysql> use mysql;
	Reading table information for completion of table and column names
	You can turn off this feature to get a quicker startup with -A

	Database changed

> show create database dbname; # 查看当前数据库信息

	mysql> show create database mysql;
	+----------+----------------------------------------------------------------+
	| Database | Create Database                                                |
	+----------+----------------------------------------------------------------+
	| mysql    | CREATE DATABASE `mysql` /*!40100 DEFAULT CHARACTER SET utf8 */ |
	+----------+----------------------------------------------------------------+
	1 row in set (0.00 sec)

> select database(); # 查看当前数据库

	mysql> select database();
	+------------+
	| database() |
	+------------+
	| mysql      |
	+------------+
	1 row in set (0.00 sec)
	
> select now(), user(), version(); # 查看当前时间、用户名及数据库版本

	mysql> select now(), user(), version();
	+---------------------+----------------+-----------+
	| now()               | user()         | version() |
	+---------------------+----------------+-----------+
	| 2015-12-02 23:38:45 | root@localhost | 5.7.9     |
	+---------------------+----------------+-----------+
	1 row in set (0.00 sec)	

> create database[ if not exists] dbname dboption; # 创建数据库

> - 数据库选项 dboption 有：

> - CHARACTER SET charset_name

> - COLLATE collation_name

> alter database dbname option; # 修改数据库选项信息

> drop database[ if exists] dbname; # 删除数据库，同时删除相关目录及内容

#### 2. 表操作

> show tables[ like "pattern"]; # 显示当前数据库有哪些表

	mysql> show tables;
	+---------------------------+
	| Tables_in_mysql           |
	+---------------------------+
	| columns_priv              |
	| db                        |
	| engine_cost               |
	| event                     |
	| func                      |
	| general_log               |
	| gtid_executed             |
	| help_category             |
	| help_keyword              |
	| help_relation             |
	| help_topic                |
	| innodb_index_stats        |
	| innodb_table_stats        |
	| ndb_binlog_index          |
	| plugin                    |
	| proc                      |
	| procs_priv                |
	| proxies_priv              |
	| server_cost               |
	| servers                   |
	| slave_master_info         |
	| slave_relay_log_info      |
	| slave_worker_info         |
	| slow_log                  |
	| tables_priv               |
	| time_zone                 |
	| time_zone_leap_second     |
	| time_zone_name            |
	| time_zone_transition      |
	| time_zone_transition_type |
	| user                      |
	+---------------------------+
	31 rows in set (0.00 sec)> 

> show tables from dbname; # 查看某个表，结果同 use dbname; show tables;

> show create table tablename; # 查看表结构

> desc tablename /describe tablename /explain tablename /show columns from talbename[ like "pattern"]; # 查看表结构

> show table status[ from dbname] [like "pattern"]; # 查看表结构

	mysql> desc db;
	+-----------------------+---------------+------+-----+---------+-------+
	| Field                 | Type          | Null | Key | Default | Extra |
	+-----------------------+---------------+------+-----+---------+-------+
	| Host                  | char(60)      | NO   | PRI |         |       |
	| Db                    | char(64)      | NO   | PRI |         |       |
	| User                  | char(32)      | NO   | PRI |         |       |
	| Select_priv           | enum('N','Y') | NO   |     | N       |       |
	| Insert_priv           | enum('N','Y') | NO   |     | N       |       |
	| Update_priv           | enum('N','Y') | NO   |     | N       |       |
	| Delete_priv           | enum('N','Y') | NO   |     | N       |       |
	| Create_priv           | enum('N','Y') | NO   |     | N       |       |
	| Drop_priv             | enum('N','Y') | NO   |     | N       |       |
	| Grant_priv            | enum('N','Y') | NO   |     | N       |       |
	| References_priv       | enum('N','Y') | NO   |     | N       |       |
	| Index_priv            | enum('N','Y') | NO   |     | N       |       |
	| Alter_priv            | enum('N','Y') | NO   |     | N       |       |
	| Create_tmp_table_priv | enum('N','Y') | NO   |     | N       |       |
	| Lock_tables_priv      | enum('N','Y') | NO   |     | N       |       |
	| Create_view_priv      | enum('N','Y') | NO   |     | N       |       |
	| Show_view_priv        | enum('N','Y') | NO   |     | N       |       |
	| Create_routine_priv   | enum('N','Y') | NO   |     | N       |       |
	| Alter_routine_priv    | enum('N','Y') | NO   |     | N       |       |
	| Execute_priv          | enum('N','Y') | NO   |     | N       |       |
	| Event_priv            | enum('N','Y') | NO   |     | N       |       |
	| Trigger_priv          | enum('N','Y') | NO   |     | N       |       |
	+-----------------------+---------------+------+-----+---------+-------+
	22 rows in set (0.01 sec)

> create [temporary] table [if not exists] [dbname.]tablename (table define) [option]; # 创建表

> 临时表 temporary 在会好结束后自动消失

> 每个字段必须有类型，且最后一个字段后不能有逗号

表结构定义中字段定义为：

> 字段名 类型 [not null | null] [default default_value] [auto_increment] [unique [key] | [primary] key] [comment "string"]

表选项（option）主要有：

> 字符集：charset=charset_name

> 存储引擎：engine=engine_name，通常为 InnoDB

> 表注释：comment="string"

示例如下：

	  CREATE TABLE `read_status` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	      `user_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '用户Id',
	      `source` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '信息来源',
	      `read_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '当前读取信息中最新操作时间',
	      `db_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '记录更新时间',
	      PRIMARY KEY(`id`),
	      UNIQUE KEY `idx_user_id_source` (`user_id`, `source`)
	  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=gbk;
 
> alter table tablename option; #修改表

> rename table old_table_name to new_table_name; # 重命名表名

> drop table [if exists] tablename; # 删除表

> truncate [table] tablename; # 清空表数据

> create table tablename like src_table_name; # 复制表结构

> create table tablename [as] select * from src_table_name; # 复制表结构和数据

#### 3. 数据操作（*增删改查*）

> insert [info] tablename [(字段列表)] value (值列表)[, (值列表), ...]

> select 字段列表 from tablename[ 其他子句]

> delete from tablename[ 删除条件子句]

> update tablename set 字段名=新值[, 字段名=新值] [更新条件]

#### 4. 导出导入

数据导出需要使用命令 `mysqldump` 来完成：

> mysqldump -u username -p password dbname tablename > filename.sql # 导出表

> mysqldump -u username -p password -B dbname > filename.sql # 导出数据库

而数据的导入则需要使用命令 `source` 来完成：

> source backup.sql # 需要登录 mysql 控制台后完成

> mysql -u username -p password dbname < backup.sql # 不需要登录 mysql 控制台


## 参考资料

- [MySQL tutorial 官方手册](http://dev.mysql.com/doc/refman/5.7/en/tutorial.html)

- [MySQL tutorial](http://www.mysqltutorial.org/)

- [A Beginner’s Guide to SQL: A MySQL Tutorial](https://blog.udemy.com/beginners-guide-to-sql/)

- [tutorialspoint](http://www.tutorialspoint.com/mysql/)
