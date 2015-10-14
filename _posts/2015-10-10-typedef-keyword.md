---
layout: post
title: 关键字 typedef 深入了解
categories: C
tags: typedef
---

## 一、引子：几行代码

为了不浪费时间，先来看看如下三行代码：

    typedef int arr[10];
    typedef void (*pf)();
	typedef int* (*pf)(int* (p*)(int*, int*), int*);

如果能准确知道上面三行代码的意义，我想就没有必要继续往下看了，当然，为了温习也可以快速阅读。

## 二、定义 struct 时 typeder 的含义

#### 1. 在 C 中定义一个结构体类型需要用 typedef 关键字:
    typedef struct TestS
    {
        int a;
    }Test;

于是在声明变量时就可以这样：**Test test;** 如果没有 typedef 就必须用 **struct TestS test;** 来声明，这里的 Test 实际上就是 struct TestS 的别名，即 Test == struct TestS。

另外，这里也可以不写 TestS，也就不能 struct TestS test; 了，必须是 Test test;，如下：

    typedef struct
    {
        int a;
    }Test;

#### 2. 在 C++ 中定义一个结构体类型不再需要用 typedef 关键字:

在 C++ 里定义一个结构体类型就很简单直接了：

    struct TestS
    {
        int a;
    };
　　　　
这样就定义了结构体类型 TestS ，声明变量时直接 **TestS test；** 即可。

<!--more-->

但是，在 C++ 中定义结构体时如果使用 typedef 的话又会造成区别：

    struct   TestS   
    {   
        int a;   
    }test; // test是一个变量  
　　　　
    typedef   struct   TestS2   
    {   
        int a;   
    }test2; // test2是一个结构体类型 == struct TestS2 
　
使用时可以直接访问 **test.a**，但是 test2 则必须先声明 **test2 s2;**，然后才可操作，如  **s2.a=10;** 。

## 三、使用 typedef 声明别名

关键字 typedef 的一个常见用法是用来声明一个别名，如本文开头的三行代码，形如：

    typedef int INT;

这种形式几乎跟 **#define int INT** 一样。但是并不完全一样！

如果用 #define 的思维来看待 typedef：把 int 与 INT 分开来看，int 是一部分，INT 是另一部分，那么就错了！

实际上根本就不是这么一回事： int 与 INT 是一个整体！就像 int i; 声明一样是一个整体声明，只不过int i 定义了一个变量，而 typedef 定义了一个**别名**。

如果用这种错误的观念来看待 typedef，就会无法理解如下声明：

    typedef int a[10];
    typedef void (*pf)(void);

会以为 a[10] 是 int 的别名，(*pf)(void) 是 void 的别名，但这样的别名看起来又似乎不是合法的名字，于是陷入困惑之中。

而实际上，上面的语句把 a 声明为具有 10 个 int 元素的数组的类型别名，pf 是一种函数指针的类型别名。虽然在功能上，typedef 可以看作一个跟 int INT 分离的动作，但语法上 typedef 属于存储类声明说明符，因此严格来说，typedef int INT 是一个完整的声明。

**如何定义一个函数指针类型？**

如原函数是：

    void f(int);

那么定义的函数指针类型就是：

    typedef void (*pf)(int);

然后用此类型生成一个指向函数的指针：

    pf func;

当 func 获取函数地址之后，就可以像调用原函数那样来使用这个函数指针：**func(int);** 。

## 四、深入理解 typedef

#### 1. 确定被声明的类型

在遇到 typedef 时，**从左到右进行扫描**，找到**第一个**“陌生”的标识符，这个标识符就应该是语句所声明的类型名称。例如：

    typedef int* (*pt)(int* (*pn)(int* p1, int*p2), int* p3);
          
如果 pt 是“陌生”标识符（既不是保留字，也不是声明过的类型），那么它就是要声明的类型。其它的名字都是为了阅读方便的占位符，可有可无。也就是说，上面的语句等价为：

    typedef int* (*pt)(int* (*)(int*, int*), int*);

#### 2. 如何使用 typedef

以后一旦遇到该类型声明的变量，则在该类型的 typedef 式中用变量代替类型，去掉typedef关键字，所得到的声明式等价于原来的声明，例如：

    pt p；
         
该声明式经过两步变化为等价的声明式：

首先，回到 pt 的 typedef 式：

    typedef int* (*pt)(int* (*)(int*, int*), int*);
             
然后，用 p 代替 pt：
           
    typedef int* (*p)(int* (*)(int*, int*), int*);
    
最后，把 typedef 去掉，得到：
      
    int* (*p)(int* (*)(int*, int*), int*);

这个语句与 pt p; 意义相同。
             
这是个函数指针的声明，所指向的函数有两个 int\* 参数，返回一个 int\* 值，第二个参数是 int\*， 整个函数返回一个 int\*。

## 五、typedef 和 #define 的区别

前面已经简单介绍了 typedef 和 #define，二者都可以用来给对象取一个别名，但是两者却有着很大不同。

#### 1. 执行时间不同

关键字 typedef 是在**编译阶段**有效，因此 typedef 有类型检查的功能。

而 #define 则是宏定义，发生在**预处理阶段**，也就是编译阶段之前，它只进行简单而机械的字符串替换，而不进行任何检查。

#### 2. 功能不同

关键字 typedef 用来定义类型的别名，这些类型不只包含内部类型（int，char 等），还包括自定义类型（如 struct/class 定义的类型），可以起到使类型易于记忆的功能。如：
    
    typedef int (*pf) (const char*, const char*);
          
定义一个指向函数的指针的数据类型 pf，其中函数返回值为 int，两个参数都为 const char* 。
          
typedef 还有另一个重要用途：定义机器无关的类型，如可以定义一个叫 REAL 的浮点类型，在目标机器上它可以i获得最高的精度：

    typedef long double REAL;

在不支持 long double 的机器上，该 typedef 看起来会是下面这样：
 
    typedef double REAL;
          
甚至在连 double 都不支持的机器上，该 typedef 看起来会是这样：

    typedef float REAL;
          
而 #define 不只是可以为类型取别名，还可以定义常量、变量、编译开关等。

#### 3. 作用域不同

\#define 没有作用域的限制，只要是之前预定义过的宏，在以后的程序中都可以使用。

而 typedef 有自己的作用域，如：

    void f()   
    {   
        #define  A  int   
    }    

    void g()   
    {   
        // 在这里也可以使用 A，因为宏替换没有作用域，   
        // 但如果上面用的是 typedef，那这里就不能用 A ，不过一般不在函数内使用 typedef
    }

#### 4. 对指针的操作

二者在修饰指针类型时，作用不同。

    typedef int *pint；
    #define PINT int *
    const pint p；// p不可更改，p指向的内容可以更改，相当于int * const p;
    const PINT p；// p可以更改，p指向的内容不能更改，相当于 const int *p；或 int const *p；
    pint s1, s2;  // s1和s2都是int型指针
    PINT s3, s4;  // 相当于int * s3，s4；只有一个是指针

