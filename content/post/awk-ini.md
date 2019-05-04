---
title: 一句 awk 获取 ini 文件的值
categories: [
  "Shell"
]
tags: [
  "Shell"
]
date: 2016-01-10
image: "artist.jpg"
---

## 问题背景

使用脚本语言操作 `ini` 文件已经有很多现有的方案了，比如 `python` 的 `ConfigParser` 模块等。现在有一些 shell 脚本用于执行自动化工作，但是每个模块都有自己的配置文件，修改起来很不方便，能不能收敛到一个配置文件？同时不使用 python 脚本，直接使用 `awk` 和 `sed` 这样的 shell 脚本来搞定呢？

## 解决方案

假设 ini 文件 test.ini 为如下：

    [section1]
    ip=10.11.12.13
    port=1234
    
    [section2]
    ip=10.21.22.23
    port=5678
    
为了能够获取 section2 下 ip 的值，需要如下几个步骤：

> 1. 以 `=` 分隔每行
> 2. 找到 `[section2]`
> 3. 满足 1 以后，从此开始找到第一个 ip 
> 4. 打印 ip 对应的值，停止，退出

### 1. 分隔每行

在 awk 里可以使用 `-F` 来指定每行的分隔符号，如下：

    awk -F '=' '{print $1}' test.ini
    # 打印结果
    ip
    port
    
    [section2]
    ip
    port
    
### 2. 找到 `[section2]`

为了找到对应的 `[section2]` 和 `ip` 的值，使用 awk 的正则表达式，关于此可阅读参考资料。

在 awk 里正则表达式的基本语法为：

    awk -F '=' '/'section2'/{print $1}' test.ini
    # 打印结果
    [section2]

即使用 `/正则式/{表达式}` 这种形式来书写，使用 `//` 将正则式包装起来，只有当正则式匹配时才会执行后面的表达式。

为了找到 `[section2]` 行，所以需要书写这样的语句：

    awk -F '=' '/\['section2'\]/{print $1}' test.ini
    # 打印结果
    [section2]
    
由于 `[]` 已经在正则表达式里被使用了，所以这里需要使用 `\` 对其进行转义。
    
### 3. 找到 ip 对应的值

同理，要找到 ip 对应的值就很容易了：

    awk -F '=' '$1~/'ip'/{print $2}' test.ini
    # 打印结果
    10.11.12.13
    10.21.22.23
    
这句话的意思是，被 `=` 分隔后的，第一个串如果与 `ip` 匹配，则打印该行的第二个串，也就是 ip 对应的值，在 awk 的正则表达式里，使用 `~` 来表示匹配。

### 4. 完美解决

两个独立的语句书写起来是没有什么难度的，那么要把它们组合起来完成需求该如何做呢？

    awk -F '=' '/\['section2'\]/{t=1}t==1&&$1~/'ip'/{print $2;exit}' test.ini
    # 打印结果
    10.21.22.23
    
结果如预期，完美解决！

但是这是为什么呢？

语句执行后，首先找到匹配 `[section2]` 的行，这时设置一个变量 `t` 并给其赋值，当 t 被赋值后，就会判断是否相等，相等后就会执行 `&&` 后面的语句，即找到第一个与 `ip` 匹配的行，输出对应的值，并结束整个语句的执行。

## 参考资料

- [AWK 简明教程](http://coolshell.cn/articles/9070.html)

- [The GNU Awk User’s Guide](http://www.gnu.org/software/gawk/manual/gawk.html#Regexp)

