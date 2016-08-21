---
layout: post
title: 搭建 sonar 记录
categories: 测试
tags: sonar
---

### 1. 必要准备

操作系统为：`Mac OS`

版本为：`sonarqube-6.0`

在安装 `sonar` 前需要安装一些其必要的基础工具：

    java
    ruby
    database: mysql, Oracle, etc.
    gem
    
必须准备的是 `java` 环境，因为 `sonar` 是用 Java 编写的；数据库支持多种，本文使用 MySQL 作为示例；而 `ruby` 和 `gem` 并不是必须要的，如果在安装、运行过程中，根据日志记录，或许需要安装它们以解决错误问题。

<!--more-->

详细需要准备的环境，请见[官方说明](http://docs.sonarqube.org/display/SONAR/Requirements)。
    
### 2. 启动服务

从官方网站[下载](http://www.sonarqube.org/downloads/) `sonarqube-6.0`，假设存放目录为：`~/sonarqube-6.0`

使用如下命令启动服务：

    cd ~/sonarqube-6.0/bin/macosx-universal-64
    sh sonar.sh start
    
服务启动后，就可以在浏览器里进行查看了，默认端口为 `9000`，即访问： `localhost:9000`，如果访问一切正常则启动成功。

如果在页面出现如下错误提示信息：

    We're sorry, but something went wrong.
    Please try back in a few minutes and contact support if the problem persists.
    <%= link_to "Go back to the homepage", home_path %>
    
则需要查看日志定位错误原因，日志目录为：`~/sonarqube-6.0/logs/sonar.log`

对于上述错误，通常在日志里会有如下错误提示信息：

    “zh-CN” is not a valid locale
    或
    “en” is not a valid locale

那么需要执行如下命令以解决：

    gem uninstall -i ~/.rvm/gems/ruby-2.3.0 i18n
    # ruby 版本号可以通过 ruby -v 获得
    
重启服务查验是否成功，如果还是不能正常访问，请继续查看日志定位问题，修复验证。

如果一切都成功了，这时会在页面底部提示 `DB` 相关的错误，这是因为没有配置数据库导致的。

### 3. 配置数据库

配置文件在 `~/sonarqube-6.0/conf/` 目录下，主要包括两个配置文件：`sonar.properties` 和 `wrapper.conf`，配置数据库相关是在 `sonar.properties` 文件里进行。

1. 为了使得 sonar 用上 MySQL 需要首先新建一个数据库，数据库名为：`sonar`，即使用语句：

    create database sonar;
    
2. 修改 `sonar.properties` 中数据库的登录名和密码配置为：

     # User credentials.
     
     # Permissions to create tables, indices and triggers must be granted to JDBC user.
     
     # The schema must be created first.
     
     sonar.jdbc.username=root
     
     sonar.jdbc.password=
    
  其中 `sonar.jdbc.username` 和 `sonar.jdbc.password` 分别为数据库的登录名和密码，这里使用 MySQL 的默认配置。
  
3. 修改 `sonar.properties` 中数据库访问链接为：
     
     #----- MySQL 5.6 or greater
     
     # Only InnoDB storage engine is supported (not myISAM).
     
     # Only the bundled driver is supported. It can not be changed.
     
     sonar.jdbc.url=jdbc:mysql://localhost:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance
     
  其中 `sonar` 即为数据库名，如果前面创建的数据库名不为 `sonar` 则这里需要做相应的修改。
  
4. 保存后再重新启动服务，访问 `localhost:9000` 即可

    访问页面时，如果提示无法访问时，请强制刷新页面几次，因为刚开始的时候需要创建数据库，故需要花费点时间。如果长时间都无法正常访问，则需要**查看日志定位问题并修复**。

    如果一切正常，则上述说到的提示 `DB` 失败的问题将得到解决。
    
### 4. 配置插件

可以正常访问页面，即可使用 `admin` 和 `admin` 进行登录。

为了安装插件需要做如下操作，[如图](/static/image/sonar.png)

在页面上有大量的插件供安装，根据需求选择必要的插件即可。






