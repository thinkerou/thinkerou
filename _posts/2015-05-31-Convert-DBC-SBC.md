---
layout: post
title: 全角半角转换（Python 接口）
categories: Python
tags: 全角 半角 扩展
---

## 一、背景介绍

>+ **解决什么问题**：快速方便的对文本进行全角半角自动转换

>+ **适用什么场景**：自动化测试过程中使用 Python 获取网页源码时，获取到的是全角字符，等等


## 二、全角半角原理

>+ 全角即：**D**ouble **B**yte **C**haracter，简称**DBC**

>+ 半角即：**S**ingle **B**yte **C**haracter，简称**SBC**

>+ 在 windows 中，中文和全角字符都占两个字节，并且使用了 ascii　chart 2 (codes 128–255)；

>+ 全角字符的第一个字节总是被置为 163，而第二个字节则是相同半角字符码加上128（不包括空格，全角空格和半角空格也要考虑进去）；

>+ 对于中文来说，它的第一个字节被置为大于163，如'阿'为:176 162，检测到中文时不进行转换。

>+ 例如：半角 a 为 65，则全角 a 是 163（第一个字节）、193（第二个字节，128+65）。 

全角半角示例：（文本 test.txt 包含全角和半角字符）

<!--more-->

    F:\test>type test.txt
    123456
    １２３４５６
    abcdefg
    ａｂｃｄｅｆｇ
    中国你好

## 三、使用 Python 实现全角半角转换

根据全角半角的原理，使用 Python 很容易实现一个全角半角转换的函数，如全角转半角可以写为：

    #coding=utf-8
    def toSBC(ustring):
      rstring = ""
      for uchar in ustring:
        inside_code = ord(uchar)
        if inside_code >= 0x0021 and inside_code <= 0x7e:
          rstring += uchar
        else:
          if inside_code == 0x3000:
            inside_code = 0x0020
          else:
            inside_code -= 0xfee0
          rstring += chr(inside_code)
      return rstring
    a = toSBC("ｍｎ123abc".decode('utf-8'))
    print a # 'mn123abc'
    b = toSBC("mn123abc".decode('utf-8'))
    print b # 'mn123abc'

根据上面的代码，很容易写出半角转全角的代码，此处不细说。

从上面的示例使用可以看出，必须进行编码转换才能得到预期结果，然而 Python 编码问题是一个非常棘手的问题，即使对于一个熟练使用 Python 的程序员来说也是如此。

那么有没有比较好的解决方案呢？我能想到的有三种方案：

>+ 封装比较全面、易用的函数

>+ 使用 Python3 替代 Python2

>+ 使用 C 扩展 Python 接口

对于第一种方法而言，短期内使用应该没问题，函数接口封装的足够健全，还是可行的；

第二种方法，由于涉及的东西会很多，比如你或许要去修改更多代码来适应 Python3，成本太大；

如果在学会了使用 C 扩展 Python的情况（学起来也很容易），第三种方法我还是建议使用，也是本文推荐使用的方法。

## 四、使用 C 实现全角半角转换

和前述一样，根据全角半角转换原理，使用 C 也很容易实现其转换函数，如全角转半角为：

    std::string toSBC(std::string str)
    {
	  std::string result = "";
	  unsigned char cPre;
	  unsigned char cNext;
	  for (unsigned int i = 0; i < str.length(); ++i)
	  {
		cPre = str[i];
		cNext = str[i + 1];
		if (cPre == 163)
		{
		  // 第一个字节等于163，意味着是全角字符
		  result += (unsigned char)str[i + 1] - 128;
		  i++;
		  continue;
		}
		else if (cPre > 163)
		{
		  // 第一个字节大于163，意味着是汉字
		  result += str.substr(i, 2);
		  i++;
		  continue;
		}
		else if (cPre == 161 && cNext == 161)
		{
		  // 全角空格
		  result += "";
		  i++;
		}
		else
		{
		  // 半角字符
		  result += str.substr(i, 1);
		}
	  }
	  return result;
    }

如何调用这个 C 函数，此处就不细说，有了这个接口后，用其扩展为一个 Python 接口就很容易了。

### 五、使用 C 扩展全角半角转换函数为 Python 接口

> **接口预期**：以如下方式使用和显示帮助信息

    >>> import convert
    >>> help(convert.toDBC)
	Help on built-in function toDBC in module convert:
	toDBC(...)
	    toDBC(str): single to double byte character
	>>>
	>>> help(convert.toSBC)
    Help on built-in function toSBC in module convert:
    toSBC(...)
        toSBC(str): double to single byte character
    >>>
	>>> print convert.toSBC('hello')
	hello
	>>> print convert.toDBC('hello')
	ｈｅｌｌｏ
	>>> print convert.toSBC('ｈｅｌｌｏ')
	hello
	>>> print convert.toDBC('ｈｅｌｌｏ')
	ｈｅｌｌｏ
	>>>

先根据代码来说明 convert 模块的实现过程：

    static PyObject* toSBC(PyObject* self, PyObject* args)
	{
	  char* s;
	  if (!PyArg_ParseTuple(args, "s", &s))
	  {
	    return NULL;
	  }
	  std::string sRes = toSBC(s); // 全转半
	  return Py_BuildValue("s", sRes.c_str());
	}

	static PyObject* toDBC(PyObject* self, PyObject* args)
	{
	  char* s;
	  if (!PyArg_ParseTuple(args, "s", &s))
	  {
	    return NULL;
	  }
	  std::string sRes = toDBC(s); // 半转全
	  return Py_BuildValue("s", sRes.c_str());
	}

有了前面的 C 实现后，使用 C 扩展为 Python 接口是不是很简单呢？！

使用 C 扩展 Python 接口的详细说明，请阅读 [《使用 C/C++ 扩展 Python》](http://thinkerou.com/2015-04/Using-CandCPP-Extension-Python)。

## 六、遇到的问题

>+ `static PyObject* toSBC(PyObject* self, PyObject* args)` 函数中使用 std::string 声明变量时，在使用 Python 接口时无法识别字符串，如何解决？

>+ **解决方案**：static 函数中字符串必须是 char* 而不能使用 std::string。

>+ 基于 Python 32bit 写的 *.pyd 不能在基于 Python 64bit 的环境使用，如何解决？

>+ **解决方案**：
  1. 基于不同的 Python(32bit/64bit) 编写不同的 *.pyd(32bit/64bit)，即使用各自的(32bit/64bit) include 和 libs 文件； 
  2. 使用 Visual Studio 编写基于 Python 64bit 的 *.pyd 时，需要将工程属性设置为 **x64** 而不是默认的 Win32；
  3. 设置方法：右键工程 —— Properties —— Configuration Manager，在 Platform 列点 New，然后在 New platform 选择 x64，保存即可。 


## 七、参考资料

> [使用 C/C++ 扩展 Python](http://thinkerou.com/2015-04/Using-CandCPP-Extension-Python)

> [示例源码](https://github.com/thinkerou/CPythonExample/blob/master/extPyUsingC/DBC_SBC.cpp)