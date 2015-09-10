---
layout: post
title: 使用 Python 编写 Windows 服务程序
categories: Python
tags: Service
---

## 一、前言

为了简化文章内容，至于什么是 Windows 服务程序以及如何使用 C/C++ 编写一个服务程序等相关内容，后续专门针对这个主题写篇博客。而本文的主旨是使用 Python 语言来编写 Windows 服务程序，只需要知道在 Windows 上服务在哪里，如何开启、暂停、关闭，以及服务程序的好处即可。

#### 1. 服务程序在哪里？

这个或许大部分人都知道，就不上图了，用文字描述：

> 右键我的电脑（计算机） ——> 管理 ——> 服务和应用程序 ——> 服务

点击`服务`会展开很多服务列表，比如 Apache 等。

#### 2. 如何开启、暂停、关闭服务？

在上一步中，已经打开服务列表了，只要右键点击服务列表中某一项，就能通过右键菜单选择开启、暂停和关闭服务，由于每个服务程序编写的不一样，执行这些操作也会有不同的响应信息。

#### 3. 服务有些什么好处？

先不展开说服务程序有些具体的好处，更详细的信息在后续的文章里来说明，本文只说具体案例使用 Windows 服务的好处。

> 问题：执行一个自动化测试，需要重启电脑后继续执行动作（无界面）。

> 可行的解决方案：写个可执行文件（比如 `bat`, `exe`），设置开机自启动项（添加注册表项）。

但是不想做那么多事，有没有直接点的解决方案？这就是服务的好处：

<!--more-->

> 开机自启动（安装服务的时候通过参数指定）

## 二、使用 Python 编写 Windows 服务

#### 1. 前提

使用 Python 编写 Windows 服务程序，需要安装 `pythonwin32` 类库，下载地址见参考文档。

#### 2. 编写程序

先直接贴上代码(`service_test.py`)，然后再根据代码来进行说明：

    import servicemanager
    import win32event
    import win32service
    import win32serviceutil

    class ServerManager(win32serviceutil.ServiceFramework):
        _svc_name_ = 'service name'
        _svc_display_name_ = 'service display name'
        _svc_description_ = 'service description'

        def __init__(self, args):
            win32serviceutil.ServiceFramework.__init__(self, args)
            self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

        def SvcDoRun(self):
            servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                                  servicemanager.PYS_SERVICE_STARTED,
                                  (self._svc_name_, ''))

            while 1:
                rc = win32event.WaitForSingleObject(self.hWaitStop, win32event.INFINITE)
                if rc == win32event.WAIT_OBJECT_0:
                    break
                else:
					# todo: your code
					pass

        def SvcStop(self):
            self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
            win32event.SetEvent(self.hWaitStop)


    if __name__ == '__main__':
        win32serviceutil.HandleCommandLine(ServerManager)

整个代码结构还是很清晰的：

> 1. 自定义类需要继承自`win32serviceutil.ServiceFramework`；

> 2. 变量 `_svc_name_`、`_svc_name_` 和 `_svc_name_` 根据其名字即可知道它们的意思，也即是在前言中提到的在`服务程序管理器`里显示的各种名字；

> 3. 函数 `__init__` 初始化父类以及创建事件用于监听服务的开启、暂停和关闭；

> 4. 函数 `SvcDoRun` 是服务程序的核心，服务所干的活都在这里定义；

> 5. 函数 `SvcStop` 是服务停止时使用的；

> 6. 函数 `win32serviceutil.HandleCommandLine(ServerManager)` 是整个服务程序的入口。

更详细的服务程序代码及示例请阅读参考文档。

#### 3. 操作服务程序

代码写好后，就是如何操作服务代码的问题了，这需要使用命令行来完成：

  * 安装服务　　　　python service_test.py install 

  * **自动启动**　　　　python service_test.py --startup auto install 

  * 启动服务　　　　python service_test.py start 

  * 重启服务　　　　python service_test.py restart

  * 停止服务　　　　python service_test.py stop

  * 删除\卸载服务　  python service_test.py remove

如果需要设置开机自启动，则须要使用命令 `python service_test.py --startup auto install`，切记需要使用该命令才能设置开机自启动。

#### 4. 踩过的坑

> 问题描述也可以阅读参考文档

**坑的简要描述**：

  * a. 在 E:\src 目录下有文件： config.py、config.ini、service.py 文件；
  
  * b. 在 service.py 服务程序里会使用 config.py 来操作 config.ini 文件； 
  
  * c. 当运行这个服务程序时，会提示：`找不到 config.ini 文件`。

可是明明 config.ini 文件就在这里啊，为什么找不到呢？

于是，我将 `src` 文件夹复制到 pywin32 安装目录下，即目录 `C:\Python27\Lib\site-packages\win32\src` 下，同时将 `service.py` 里操作 `config.ini` 的地方从 `config.ini` 改为 `src\config.ini`，再次运行这个服务，成功了。

定位出问题了：**执行路径**。

**解决方案**：

> 1. 在执行程序的时候，将相应的代码复制到 pywin32 安装目录下；

> 2. 设置路径，也即是每次读取绝对路径来解决。

设置路径的代码(感谢[@hiro-protagonist](http://stackoverflow.com/users/4954037/hiro-protagonist))如下:

	import os
	HERE = os.path.abspath(os.path.dirname(__file__))
	RESTORE_INI = os.path.join(HERE, 'restore.ini')

然后在使用 `restore.ini` 的地方更改为 `RESTORE_INI` 即可。

可以看出，方案1是下策，方案2才是上策！

**`总之`**:

> 只要在服务程序里涉及到跟`路径`相关的操作，都需要格外小心处理！

## 三、参考文档

> [pywin32](http://sourceforge.net/projects/pywin32/)

> [示例代码](https://github.com/thinkerou/util-script/blob/master/src/winservice.py)

> [踩过的坑](http://stackoverflow.com/questions/32478540/how-do-i-write-code-to-avoid-error-when-windows-service-read-config-file/32479520#32479520)



