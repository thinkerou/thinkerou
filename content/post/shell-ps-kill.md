---
title: 命令行艺术之 ps 与 kill
categories: [
  "Shell"
]
tags: [
  "Shell"
]
date: 2015-10-11
image: "frustrated.jpg"
---

## 概览

命令 `ps` 是 **Process Status** 的缩写，它是用来列出系统中当前运行的进程，列出的是它们的快照，也即是执行 ps 命令的那一刻的那些进程，如果需要动态的列出进程信息，则需要使用 `top` 命令。

使用 ps 命令可以确定哪些进程正在运行及运行状态：是否结束、是否僵死、占用多少资源等。

> Program 与 Process 区别与联系：

> Program（程序）：通常为 binary program，放在存储介质中（硬盘等），以实体文档存在；

> Process（进程）：程序被触发后，执行者的权限、属性、程序代码及所需资料都会被载入内存，作业系统会给这个内存内的单元一个唯一标识（PID），也即是进程就是一个正在运行中的程序。

> 更多、详细信息请阅读[《鸟哥的 Linux 私房菜》](http://linux.vbird.org/linux_basic/0440processcontrol.php#ps)。

命令 ps 主要用于查看进程当前信息，而命令 kill 主要用于管理进程（杀死哪些进程）。

在 Linux 系统中，进程有 5 种状态：

> 运行：正在运行或在运行队列中等待

> 中断：休眠中，受阻，在等待某个条件的形成或接收到信号

> 不可中断：收到信号不唤醒和不可运行，必须等待直到中断发生

> 僵死：进程已经终止，但进程描述符还在，直到父进程调用wait4后才释放

> 停止：收到信号后停止运行

对应的进程状态在 ps 命令中则使用如下标识来标记：

> R ：运行，Running or runnable (on run queue)

> S ：中断，Interruptible sleep (waiting for an event to complete)

> D ：不可中断，Uninterruptible sleep (usually IO)

> Z ：僵死，Defunct("zombie") process, terminated but not reaped by its parent

> T ：停止，Stopped, either by a job control signal or because it is being traced

## top 命令

> **说明**

> 在学习、使用 linux 命令过程中要善用 `help` 和 `man` 来查看命令参数，单纯的记忆是不可靠的，多查多用，熟能生巧。

#### 1. 命令参数

使用 `ps --help` （命令 `man ps` 会得到更多更全的信息）会得到如下信息：

	[thinkerou ~]$ ps --help
	********* simple selection *********  ********* selection by list *********
	-A all processes                      -C by command name
	-N negate selection                   -G by real group ID (supports names)
	-a all w/ tty except session leaders  -U by real user ID (supports names)
	-d all except session leaders         -g by session OR by effective group name
	-e all processes                      -p by process ID
	T  all processes on this terminal     -s processes in the sessions given
	a  all w/ tty, including other users  -t by tty
	g  OBSOLETE -- DO NOT USE             -u by effective user ID (supports names)
	r  only running processes             U  processes for specified users
	x  processes w/o controlling ttys     t  by tty
	*********** output format **********  *********** long options ***********
	-o,o user-defined  -f full            --Group --User --pid --cols --ppid
	-j,j job control   s  signal          --group --user --sid --rows --info
	-O,O preloaded -o  v  virtual memory  --cumulative --format --deselect
	-l,l long          u  user-oriented   --sort --tty --forest --version
	-F   extra full    X  registers       --heading --no-heading --context
	                    ********* misc options *********
	-V,V  show version      L  list format codes  f  ASCII art forest
	-m,m,-L,-T,H  threads   S  children in sum    -y change -l format
	-M,Z  security data     c  true command name  -c scheduling class
	-w,w  wide output       n  numeric WCHAN,UID  -H process hierarchy

> 常用参数说明：

> **特别强调：** `ps aux` 与 `ps -aux` 是不一样的，例如：`-u` 与 `u` 的区别。

> a, -A, -e 显示所有进程

> -a 显示同一终端下的所有进程

> c 显示进程真实名称

> e 显示环境变量

> f 显示程序间的关系

> -H 显示树状结构

> r 显示当前终端的进程

> T 显示当前终端的所有程序

> u 指定用户的所有进程

> -au 显示较详细的信息

> -aux 显示所有包含其它使用者的进程

示例程序如下：

	[thinkerou:~ ]$ ps aux
	USER              PID  %CPU %MEM      VSZ    RSS   TTY STAT STARTED      TIME COMMAND
	thinkerou         672   4.6  0.9  2750472  79572   ??  S     3:56下午   1:12.25 /

> 各列信息说明：

> USER : the owner of the process

> PID : a unique process identification number

> %CPU : CPU utilization of the process

> %MEM : ratio of the process's resident set size to the physical memory on the machine, expressed as a percentage

> VSZ : virtual memory size of the process in KiB

> RSS : the non-swqpped physical memory that a task has used in KiB

> TTY : controlling terminal

> STAT : multi-character process state.

> STARTED : starting time or date of the process

> TIME : cumulative CPU time

> COMMAND : the executed command with all its arguments as a string

#### 2. 使用示例

**显示所有进程**

> ps ax

> ps -ef

> ps aux #增加 u 显示进程的更详细信息

> ps -ef -f #增加 -f 显示进程的更详细信息

**显示给定用户的进程**

> ps -f -u thinkerou

**显示给定进程名或进程id的进程**

> ps -C nginx #必须提供完整的进程名

> ps -f -p 1234

> ps -ef | grep nginx #查找不记得完整名字的进程，得到完整进程名用于-C

**根据CPU或MEM使用率给进程排序**

> ps aux --sort=-pcpu,+pmem

> ps aux --sort=-pcpu | head -5

**以树型结构显示进程继承关系**

> ps -f --forest -C nginx

** 显示一个父进程的子进程**

> ps -o pid,uname,comm -C nginx

> ps --ppid 1234

**显示一个进程的线程**

> ps -p 1234 -L

**指定显示列**

> ps -e -o pid,uname,pcpu,pmem,comm

**显示进程运行时长**

> ps -e -o pid,comm,etime

**改变 ps 为一个实时进程查看器**

> watch -n 1 'ps -e -o pid,uname,cmd,pmem,pcpu --sort=-pmem,-pcpu | head -15'
  
## kill 命令

在使用 `kill` 命令来终止某个进程前，需要先使用 `ps`、`pstree`、`top`等命令获取进程ID（PID）。

命令 kill 终止进程是通过向进程发送特定信号来完成的。

> 常见信号有：

> SIGHUP，代号为 1 ：重新启动

> SIGINT，代号为 2 ：等同于使用 ctrl+c 来中断进程的运行

> SIGKILL，代号为 9 ：强制中断

> SIGTERM，代号为 15 ：正常结束，如果进程已经发生问题，则无效

> SIGSTOP，代号为 19 ：等同于使用 ctrl+z 来暂停进程的运行

#### 1. 命令参数

命令 kill 的参数有：

> -l : 信号，若不加信号代号，则显示所有信号名

> -a : 不限制命令名和进程号的对应关系

> -p : 只打印相关进程号，而不发送任何信号

> -s : 指定发送信号

> -u : 指定用户

#### 2. 使用示例

**杀掉指定进程**

> ps -ef | grep nginx #获取到nginx进程的PID为1234

> kill 1234 

**彻底结束一个进程**

> kill -9 1234

**杀掉指定用户所有进程**

> kill -9 $(ps -ef | grep nginx)

> kill -u nginx

**说明：**init 进程是不可杀的。

## 参考资料

- [How to use ps, kill and nice to manage processes in linux](https://kyup.com/tutorials/use-ps-kill-nice-manage-processes-linux/)

- [鸟哥的 Linux 私房菜：第十六章、程序管理与 SELinux 初探](http://linux.vbird.org/linux_basic/0440processcontrol.php#process_1)

- [10 basic examples of Linux ps command](http://www.binarytides.com/linux-ps-command/)

- [Linux Programmer's Manual](http://linux.vbird.org/linux_basic/0440processcontrol.php#ps)

-  [每天一个linux命令：ps 命令](http://www.cnblogs.com/peida/archive/2012/12/19/2824418.html)
