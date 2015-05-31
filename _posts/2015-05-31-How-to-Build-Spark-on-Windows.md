---
layout: post
title: 如何在 Windows 上安装编译 Spark 环境
categories: 大数据
tags: Spark
---

## 一、写前面的话

我知道，在你阅读这篇文章时，或许会感到很诧异：为什么会在 Windows 安装 Spark 而不是在类 Unix 系统上？

如果你是通过搜索引擎来阅读该文的话，我想你心中也有了答案。而我只是不想装个双系统，但是又想学习了解下 Spark 到底多牛，同时，我认为，如果在 Windows 上能把 Spark 玩活了的话，在类 Unix 系统上应该不成问题吧（在 Windows 上很难搞定吧）？！

本篇文章记录下在安装编译 Spark 过程中涉及的问题和解决方案作为备忘，同时也分享给大家。

## 二、环境准备

> **机器配置**:

> ARM: 5.00 GB

> OS: win8 64bit

> CPU: 2.00 GHz

在安装 Spark 之前需要为其准备一些必须的前置环境。

>1. **JAVA**：建议安装最新的 Java，需要注意的是，是安装 **JDK** 而不是 **JRE**。

>2. **Git**：必须在命令行下能执行 git，因为在安装的时候有选项选择，默认是不行的，这的需要注意。

>3. **scala**：当前最好选择 scala 2.10.5 版本，当前的 Spark 版本对 scala 2.11.x 编译时较为麻烦。

>4. **sbt**：scala simple build tools，选择最新版即可。

> **特别注意**：javac、git、scala 和 sbt 都必须在命令行下能执行，也即是必须将它们加入到系统环境变量里。

## 三、安装编译 Spark

现在来到了重点部分：安装编译 Spark 环境。

#### 1. 下载 Spark

>a. 在官网上下载最新版本 Spark 源码（[spark-1.3.1.tgz](http://www.apache.org/dyn/closer.cgi/spark/spark-1.3.1/spark-1.3.1.tgz)）

>b. 解压到一个目录（E:\spark-learn\spark-1.3.1）

>
    E:\spark-learn\spark-1.3.1>ls
    CHANGES.txt      build   examples              pom.xml                streaming
    CONTRIBUTING.md  conf    external              project                target
    LICENSE          core    extras                python                 tools
    NOTICE           data    graphx                repl                   tox.ini
    README.md        dev     lib_managed           sbin                   yarn
    assembly         docker  make-distribution.sh  sbt
    bagel            docs    mllib                 scalastyle-config.xml
    bin              ec2     network               sql

#### 2. 安装 Spark

安装编译 Spark 环境需要在命令行下进行，这也是为什么需要将前置环境都加入到环境变量的原因。

同时，需要**特别说明**的是：由于在编译过程中需要去下载一些依赖库、包，而这些库、包可能需要**翻墙**才能访问，所以，在进行如下步骤前，请保证你的网络是能够处理这个问题的！

>a. 运行命令行（WIN + R）

>b. 进入 Spark 根目录（E:\spark-learn\spark-1.3.1）

>c. 输入命令 `sbt package` 并回车运行

>d. 输入命令 `sbt assembly` 并回车运行

整个安装编译过程，在网络保证没有问题的情况，大概需要 20 分钟左右，请耐心等待。

上述步骤成功后，运行 spark-shell 即可进行环境测试了，详情请见后文。

## 四、遇到的问题

这里重点分享**遇到的问题以及解决方案**，前述安装步骤中，在执行 `sbt` 命令时基本都会出错，通常会是如下两种错误：

> 1. java.lang.OutOfMemoryError: Java heap space

> 2. java.lang.OutOfMemoryError: GC overhead limit exceeded

两个问题的解决方案都是一样的，需要修改 sbtconfig.txt 文件配置，该文件在 sbt 的安装目录的 conf 目录下。

修改后的内容如下：

    D:\Program Files (x86)\sbt\conf>type sbtconfig.txt
	# Set the java args to high

	-Xmx2g

	-XX:MaxPermSize=512m

	-XX:ReservedCodeCacheSize=512m



	# Set the extra SBT options

	-Dsbt.log.format=true

## 五、测试 Spark

在 Spark 环境搭建成功后，就可以在 spark-shell 下进行简单测试了。

    E:\spark-learn\spark-1.3.1>cd bin

	E:\spark-learn\spark-1.3.1\bin>ls
	beeline                pyspark.cmd       spark-class.cmd   spark-submit
	beeline.cmd            pyspark2.cmd      spark-class2.cmd  spark-submit.cmd
	compute-classpath.cmd  run-example       spark-shell       spark-submit2.cmd
	compute-classpath.sh   run-example.cmd   spark-shell.cmd   utils.sh
	load-spark-env.sh      run-example2.cmd  spark-shell2.cmd  windows-utils.cmd
	pyspark                spark-class       spark-sql

	E:\spark-learn\spark-1.3.1\bin>cd ..

	E:\spark-learn\spark-1.3.1>bin\spark-shell
	log4j:WARN No appenders could be found for logger (org.apache.hadoop.conf.Configuration).
	log4j:WARN Please initialize the log4j system properly.
	log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
	Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
	15/05/31 21:05:45 INFO SecurityManager: Changing view acls to: Administrator
	15/05/31 21:05:45 INFO SecurityManager: Changing modify acls to: Administrator
	15/05/31 21:05:45 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users with view permissions: Set(Administrator); users with modify permissions: Set(Administrator)
	15/05/31 21:05:45 INFO HttpServer: Starting HTTP Server
	15/05/31 21:05:45 INFO Utils: Successfully started service 'HTTP class server' on port 23148.
	Welcome to
	      ____              __
	     / __/__  ___ _____/ /__
	    _\ \/ _ \/ _ `/ __/  '_/
	   /___/ .__/\_,_/_/ /_/\_\   version 1.3.1
	      /_/

	Using Scala version 2.10.4 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_40)
	Type in expressions to have them evaluated.
	Type :help for more information.
	15/05/31 21:05:56 INFO SparkContext: Running Spark version 1.3.1
	15/05/31 21:05:56 INFO SecurityManager: Changing view acls to: Administrator
	15/05/31 21:05:56 INFO SecurityManager: Changing modify acls to: Administrator
	15/05/31 21:05:56 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users with view permissions: Set(Administrator); users with modify permissions: Set(Administrator)
	15/05/31 21:05:57 INFO Slf4jLogger: Slf4jLogger started
	15/05/31 21:05:57 INFO Remoting: Starting remoting
	15/05/31 21:05:57 INFO Remoting: Remoting started; listening on addresses :[akka.tcp://sparkDriver@10.129.156.184:23161]
	15/05/31 21:05:57 INFO Utils: Successfully started service 'sparkDriver' on port 23161.
	15/05/31 21:05:57 INFO SparkEnv: Registering MapOutputTracker
	15/05/31 21:05:57 INFO SparkEnv: Registering BlockManagerMaster
	15/05/31 21:05:58 INFO DiskBlockManager: Created local directory at C:\Users\ADMINI~1\AppData\Local\Temp\spark-d5763ba3-a2c5-4518-8c76-0ccf06092e6f\blockmgr-c75d1552-40e1-4d17-99ac-981ee1dd14be
	15/05/31 21:05:58 INFO MemoryStore: MemoryStore started with capacity 265.1 MB
	15/05/31 21:05:58 INFO HttpFileServer: HTTP File server directory is C:\Users\ADMINI~1\AppData\Local\Temp\spark-ce9b148d-3289-446b-be24-bd8699f2f604\httpd-4ea33023-2714-42bf-aeac-c107a377d67e
	15/05/31 21:05:58 INFO HttpServer: Starting HTTP Server
	15/05/31 21:05:58 INFO Utils: Successfully started service 'HTTP file server' on port 23162.
	15/05/31 21:05:58 INFO SparkEnv: Registering OutputCommitCoordinator
	15/05/31 21:05:58 INFO Utils: Successfully started service 'SparkUI' on port 4040.
	15/05/31 21:05:58 INFO SparkUI: Started SparkUI at http://10.129.156.184:4040
	15/05/31 21:05:58 INFO Executor: Starting executor ID <driver> on host localhost

	15/05/31 21:05:58 INFO Executor: Using REPL class URI: http://10.129.156.184:23148
	15/05/31 21:05:58 INFO AkkaUtils: Connecting to HeartbeatReceiver: akka.tcp://sparkDriver@10.129.156.184:23161/user/HeartbeatReceiver
	15/05/31 21:05:59 INFO NettyBlockTransferService: Server created on 23173
	15/05/31 21:05:59 INFO BlockManagerMaster: Trying to register BlockManager
	15/05/31 21:05:59 INFO BlockManagerMasterActor: Registering block manager localhost:23173 with 265.1 MB RAM, BlockManagerId(<driver>, localhost, 23173)
	15/05/31 21:05:59 INFO BlockManagerMaster: Registered BlockManager
	15/05/31 21:05:59 INFO SparkILoop: Created spark context..
	Spark context available as sc.
	15/05/31 21:06:00 INFO SparkILoop: Created sql context..
	SQL context available as sqlContext.

	scala>

从上面的命令行结果可以看出，打印了很多 `INFO` 信息，是不是很讨厌呢？！要是没有这些 `INFO` 会不会更清爽些呢？！

那下面就尝试着解决下这个问题吧。

首先打开 conf 目录，会发现 conf 目录下有很多以 `template` 结尾文本文件，从名字即可看出，是一些配置文件的模板，也即是默认的配置信息。 

	E:\spark-learn\spark-1.3.1>cd conf

	E:\spark-learn\spark-1.3.1\conf>ls
	fairscheduler.xml.template   slaves.template
	log4j.properties.template    spark-defaults.conf.template
	metrics.properties.template  spark-env.sh.template

为了不打印 `INFO` 信息，从名字上看就知道应该是 `log4j.properties.template` 文件，拷贝一份去掉后面的 `template` 后缀，然后修里面的内容即可。

	E:\spark-learn\spark-1.3.1\conf>type log4j.properties
	# Set everything to be logged to the console
	log4j.rootCategory=WARN, console
	log4j.appender.console=org.apache.log4j.ConsoleAppender
	log4j.appender.console.target=System.err
	log4j.appender.console.layout=org.apache.log4j.PatternLayout
	log4j.appender.console.layout.ConversionPattern=%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n
	
	# Settings to quiet third party logs that are too verbose
	log4j.logger.org.eclipse.jetty=WARN
	log4j.logger.org.eclipse.jetty.util.component.AbstractLifeCycle=ERROR
	log4j.logger.org.apache.spark.repl.SparkIMain$exprTyper=INFO
	log4j.logger.org.apache.spark.repl.SparkILoop$SparkILoopInterpreter=INFO 

即将 `log4j.rootCategory=INFO, console` 行改为 `log4j.rootCategory=WARN, console`。

再次重启 `spark-shell` 看看效果如何。

	E:\spark-learn\spark-1.3.1>bin\spark-shell
	Welcome to
	      ____              __
	     / __/__  ___ _____/ /__
	    _\ \/ _ \/ _ `/ __/  '_/
	   /___/ .__/\_,_/_/ /_/\_\   version 1.3.1
	      /_/
	
	Using Scala version 2.10.4 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_40)
	Type in expressions to have them evaluated.
	Type :help for more information.
	Spark context available as sc.
	SQL context available as sqlContext.
	
	scala>

这回看起来是不是很清爽了？！

那下面开始我们的测试吧，直接看代码：

	scala> val textFile = sc.textFile("README.md")
	textFile: org.apache.spark.rdd.RDD[String] = README.md MapPartitionsRDD[1] at te
	xtFile at <console>:21
	
	scala> textFile.first()
	res1: String = # Apache Spark
	
	scala> val linesWithSpark = textFile.filter(line => line.contains("Spark"))
	linesWithSpark: org.apache.spark.rdd.RDD[String] = MapPartitionsRDD[2] at filter
	 at <console>:23
	
	scala> linesWithSpark.count()
	res2: Long = 19

	scala>

从上面的测试代码，至少说明环境搭建成功了，后续可以尽情的玩了。同时，对于示例代码，可以根据函数名以及变量名知道大概完成了什么功能。详细的说明，后续慢慢说明。

## 六、参考文献

> [Spark](https://spark.apache.org/docs/latest/)

> [Java](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

> [Git](https://git-scm.com/)

> [Scala](http://www.scala-lang.org/)

> [sbt](http://www.scala-sbt.org/)
