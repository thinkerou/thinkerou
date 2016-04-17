---
layout: post
title: 使用 C/C++ 扩展 Python
categories: Python
tags: Python
---

## 一、需求背景

> Python 几乎能解决你所遇到的所有问题，但是 Python 常被人提及的问题就是速度问题，这时如果你想提升 Python 的速度，基本都会使用 C/C++ 来扩展 Python 接口，这种方法仅仅是提升 Python 速度的诸多方法中的一种而已。

> 同时，对于一些使用 Python 来解决的问题比较棘手时，也可以考虑使用 C/C++ 来扩展 Python 接口，这样再调用的时候，就会减少一些 Python 带来的麻烦。

> 基于不同的平台，使用 C/C++ 扩展 Python 接口时，产生的文件也不一样（`*.so` 或 `*.dll`），然后将其改为合适的后缀（windows须将 `*.dll` 改为 `*.pyd`），本文使用 Win7 和 VS2013 来编写 Python 扩展。

## 二、准备工作

使用 VS2013 新建一个工程，并做如下操作：

>+ 设置 Configuration Type 属性为 Dynamic Library(.dll)

>+ 选择 Release 模式(因为没有 `python27_d.lib` 文件)

>+ 添加 python 头文件路径(默认为 `C:\Python27\include\`)

>+ 添加 python 库文件路径(默认为 `C:\Python27\libs\`)

>+ 可以将 include 和 libs 拷贝放到一个文件夹下，然后放在工程目录


## 三、Python 对象

Python 对象在 Python 解析器中都为 `PyObject`。

而在 C/C++ 中只能声明为 `PyObject*` 类型的 Python 对象，然后使用该对象对应的初始化函数进行初始化。

如：`PyTuple_New`, `PyList_New`, `PyDict_New`, `Py_BuildValue` 等。
  	
如何构建一个 `{'key1': {'key2': ['valuex', 'valuey']}}` 对象？

<!--more-->

	PyObject* pObj1 = PyDict_New();
	PyObject* pObj2 = PyDict_New();
	PyObject* pObj3 = PyList_New(2);
	PyList_SetItem(pObj3, 0, Py_BuildValue("s", "valuex"));
	PyList_SetItem(pObj3, 1, Py_BuildValue("s", "valuey"));
	PyDict_SetItem(pObj2, "key2", pObj3);
	PyDict_SetItem(pObj1, "key1", pObj2);

## 四、Python 内存管理

Python 对象管理使用引用计数技术，从而实现自动垃圾回收机制。

提供两个宏 `Py_INCREF` 和 `Py_DECREF` 来管理引用计数。

前文中申请的 pObj1/pObj2/pObj3 对象如果需要释放，应该如何处理？

不能直接使用 `free/delete` 释放，必须使用 `Py_DECREF(pObj1)`，然后 `pObj1 = NULL` 即可。

## 五、编写 Python 扩展

> #### 编写 Python 扩展主要包括三步：
> * 实现接口函数 
> * 定义方法列表
> * 实现初始化函数

> #### 示例功能

> 实现一个 `add` 函数，接受三个整形参数，求其和并返回。


### 1. 实现接口函数

先看代码，然后进行说明。

	static PyObject* add(PyObject* self, PyObject* args)
	{
		int x = 0;
		int y = 0;
		int z = 0;
		int i = 0;
		if (!PyArg_ParseTuple(args, "iii", &x, &y, &z))
		{
			return NULL;
		}
	
		i = x + y + z;
		return Py_BuildValue("i", i);
	}

接口函数必须是 `static` 函数，同时必须返会 `PyObject*` 类型。

接口函数的第一个参数是 `PyObject* self`，该参数是 Python 内部使用的，暂时不深究。

接口函数的第二个参数是 `PyObject* args`，该参数是一个参数列表，把所有参数都整合为一个 `string`，因此需要从这个 `string` 参数里解析参数，函数 `PyArg_ParseTuple` 就是来完成这项任务的。

> 函数 `PyArg_ParseTuple` 说明：

> 第一个参数 `agrs` 就是需要转换的参数；

> 第二个参数 `iii` 是格式符号；

> 第三个参数及后面的参数就是提取出来的参数存放的真正位置，这些参数必须传递其地址。

> 对于 `add` 函数，会提取三个参数，分别是 `x`,`y`,`z`。其中，格式串 `"iii"` 代表三个 `int`， 类型为 `string` 则是 `"s"`，如果有三个 `string` 则格式符号为 `"ss"`。

接口函数必须返回结果，其类型可以是 C/C++ 类型或自定义类型，但是最后都必须将其转换成 `PyObject*`， 让 Python 认识这个对象，这个类型转换使用函数 `Py_BuildValue` 来完成，该函数是函数 `PyArg_ParseTuple` 的逆过程。

> 函数 `Py_BuildValue` 说明：

> 第一个参数和 `PyArg_ParseTuple` 的第二个参数一样，都是格式化符号；

> 第二个参数是需要转换的参数，函数 `Py_BuildValue` 会把所有的返回只组装成一个 tuple 给 Python 所用。

### 2. 定义方法列表

同样，还是先看示例代码，再进行解释说明。

	static PyMethodDef addMethods[] =
	{
		{"add", (PyCFunction)add, METH_VARARGS, "add(int1, int2, int3)"},
		{NULL, NULL, 0, NULL}
	};

`PyMethodDef` 是一个 C 结构体，用来完成一个映射，需要把扩展的函数都映射到这个表里。

表的第一个字段是 Python 真正认识的，也就是 Python 里的可以使用的方法名字。

第二个字段是 Python 里的这个方法名字的具体的 C/C++ 实现的函数名。 在 Python 里调用 `add`， 真正执行的是用 C/C++ 实现的 `add` 函数。

第三个字段是 `METH_VARARGS`，它告诉 Python 函数 `add` 是调用 C/C++ 函数来实现的。

第四个字段是这个函数的说明信息。如果在 Python 里 `help` 这个函数，将会显示这个说明信息，也即是在 Python 里的函数的文档说明。

需要注意的是：这个列表必须以 `{NULL, NULL, 0, NULL}` 形式结束。

### 3. 实现初始化函数

这步是编写扩展实现的最后一步，也还是先看看代码。

	PyMODINIT_FUNC initadd()
	{
		Py_InitModule("add", addMethods);
	}

需要特别注意的是，这个函数的名字不能改动，必须是 **init + 模块名字**。 这里的模块名为 `add`，所以这个函数就是 `initadd()`。这样 Python 在导入 `add` 模块时，才能找到这个函数，并调用。

该函数调用 `Py_InitModule` 函数来将模块名字和映射表结合在一起。它表示 `add` 这个模块使用`addMethods` 这个映射表，告诉 Python 应该这样导入该模块。

## 六、产生包文件

在 Windows 操作系统下，扩展的 Python 接口文件以 `pyd` 的形式存在，其产生 `pyd` 文件的方式有两种。

> + 直接编译成 DLL 文件

> + 使用 distutils 模块

### 1. 直接编译成 DLL 文件

这种方法也是最简单的方法。

>
1. 将编写好的接口文件（cpp，位于DLL工程中）进行编译，会得到一个 DLL 文件，本例为 `add.dll`。
2. 将 `add.dll` 改名为 `add.pyd`。
3. 将 `add.pyd` 拷贝到 Python 安装目录的 DLLs 目录下（默认为 `C:\Python27\DLLs\`）。
4. 现在可以使用 `add` 函数了（后文演示）。

### 2. 使用 distutils 模块

Python 提供了扩展接口的打包接口，先看代码（其他扩展接口的使用大同小异）。

	#coding=utf-8
	#setup.py
	from distutils.core import setup, Extension
	addmodule = Extension("add", sources = ["add.cpp"])
	setup(name = "add",
	      version = "1.0",
          description = "Test Demo",
          author = "thinkerou",
          ext_modules = [addmodule])

然后使用命令

> `python setup.py build --compiler=msvc`

如果一切顺利，将会在 setup.py 同级目录下产生一个 `build` 目录，其有两个文件夹 `lib.win32-2.7` 和 `temp.win32-2.7`，在前一个文件夹下产生了一个文件 `add.pyd`，这也正是第一种方法中产生的 DLL 改名后的名字。

### 3. 提示 error: Unable to find vcvarsall.bat 错误 

在使用 distutils 模块进行打包时，在调用 Python 命令进行 build 的过程中，如果出现如下错误信息：

> error: Unable to find vcvarsall.bat

错误的原因是因为 Python 扩展编译工具在注册表中找不到 VS2010 的注册信息所致。

可以使用如下方法来进行解决：

在 Python 安装目录下，找到 `Lib\distutils\msvc9compiler.py`，默认路径为 `C:\Python27\Lib\distutils\msvc9compiler.py`，然后在该文件中找到 `toolskey = “VS%0.f0COMNTOOLS” % version` 一行将其注释掉，然后增加一行 `toolskey = "VS100COMNTOOLS"`，如此便能解决这个错误。

而对于 `"VS100COMNTOOLS"` 所代表的意义，可以查看注册表中对应的信息知道，注册表中位置为：

> HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment

在 Environment 下会有 `VS100COMNTOOLS`，`VS110COMNTOOLS`，`VS120COMNTOOLS`，这三项不是一定有，需要根据机器安装 Visual Studio 的版本而定，各自代表什么意思，可以根据对应项后面的路径值知道。


## 七、使用扩展接口

如前所述，将 `add.pyd` 文件拷贝到 Python 安装目录下的 DLLs 目录下后，就可以使用 `add` 函数了。使用 `import` 导入 `add` 包，如下：

>
	>>> import add
	>>> add.add(1, 2, 3)
	6


## 八、参考资料

> [编写 Python 扩展官方文档](https://docs.python.org/2/c-api/index.html)

> [示例源码](https://github.com/thinkerou/CPythonExample/blob/master/extPyUsingC/DBC_SBC.cpp)