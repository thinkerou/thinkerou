---
layout: post
title: C++ Lambda 介绍
categories: C++
tags: C++ lambda
---

## 一、C++ lambda 表达式格式

C++ lambda 表达式规范有如下几种形式：

| 编号 | 表达式 | 
| --- | ---------- |
| (1) | [capture] (params) mutable exception attribute -> return {body} | 
| (2) | [capture] (params) -> return {body}	|	 
| (3) | [capture] (params) {body} |	 
| (4) | [capture] {body} |


**表达式形式说明**：

  * (1)： 完整的 lambda 表达式形式；
  * (2)： const 类型的 lambda 表达式形式，该类型表达式**不能更改 capture 列表中的变量的值**；
  * (3)： 没有返回值类型的 lambda 表达式，但是返回值类型可以推导出来，使用如下规则：
    * 如果 body 包含 return 语句，则 lambda 表达式返回类型由 return 语句的返回类型确定；
    * 如果没有 return 语句，则函数类似于 void func(params) 函数。
  * (4)： 没有参数列表的 lambda 表达式，类似于无参函数 func()。

**mutable**： 说明 lambda 表达式的 body 可以修改 capture 列表中的变量的值，并且可以访问被捕获对象的 non-const 方法；

<!--more-->

**exception**： 说明 lambda 表达式是否抛出异常，以及抛出什么异常，类似于 void func() throw(A, B)；

**attribute**： 用来声明属性。

**params**： 用来指定 lambda 表达式的参数。

**return**： 用来指定 lambda 表达式的返回类型。

**capture**： 指定了在可见域范围内 lambda 表达式的代码内可见的外部变量的列表，具体格式说明如下：

  * [a, &b]： 变量 a 以值的方式被捕获， 变量 b 以引用的方式被捕获；
  * [this]： 以值的方式捕获 this 指针；
  * [&]： 以引用的方式捕获所有的外部自动变量；
  * [=]： 以值的方式捕获所有的外部自动变量；
  * []： 不捕获外部的任何变量。

## 二、lambda 表达式实例

[示例代码](https://github.com/thinkerou/Interview-Questions-And-Solutions/blob/master/src/lambda.cpp)

	class CLambdaTest
	{
	public:
		CLambdaTest() : m_iData(10) {}
		~CLambdaTest() {}
	
		void TestLambda()
		{
			std::vector<int> vecTemp;
			vecTemp.push_back(1);
			vecTemp.push_back(2);
	
			// 无函数对象参数，输出：1 2
			{
				for_each(vecTemp.begin(), vecTemp.end(), [](int v){
					std::cout << v << std::endl; 
				});
			}
	
			// 以值方式传递作用域内所有可见的局部变量（包括this），输出：11 12
			{
				int a = 10;
				for_each(vecTemp.begin(), vecTemp.end(), [=](int v){ 
					std::cout << v + a << std::endl;
				});
			}
	
			// 以引用方式传递作用域内所有可见的局部变量（包括this），输出：11 13 12
			{
				int a = 10;
				for_each(vecTemp.begin(), vecTemp.end(), [&](int v)mutable{
					std::cout << v + a << std::endl; ++a;
				});
				std::cout << a << std::endl;
			}
	
			// 以值方式传递局部变量a，输出：11 13 10
			{
				int a = 10;
				for_each(vecTemp.begin(), vecTemp.end(), [a](int v)mutable{
					std::cout << v + a << std::endl; ++a;
				});
				std::cout << a << std::endl;
			}
	
			// 以引用方式传递局部变量a，输出：11 13 12
			{
				int a = 10;
				for_each(vecTemp.begin(), vecTemp.end(), [&a](int v){
					std::cout << v + a << std::endl; ++a;
				});
				std::cout << a << std::endl;
			}
	
			// 传递this，输出：11 12
			{
				for_each(vecTemp.begin(), vecTemp.end(), [this](int v){
					std::cout << v + m_iData << std::endl;
				});
			}
	
			// 除b按引用传递外，其他均按值传递，输出：11 12 17
			{
				int a = 10;
				int b = 15;
				for_each(vecTemp.begin(), vecTemp.end(), [=, &b](int v){
					std::cout << v + a << std::endl; ++b;
				});
				std::cout << b << std::endl;
			}
	
	
			// 操作符重载函数参数按引用传递，输出：2 3
			{
				for_each(vecTemp.begin(), vecTemp.end(), [](int &v){
					v++;
				});
				for_each(vecTemp.begin(), vecTemp.end(), [](int v){
					std::cout << v << std::endl;
				});
			}
	
			// 空的Lambda表达式
			{
				[](){}();
				[]{}();
			}
		}
	
	private:
		int m_iData;
	};


## 三、参考资料

> [Lambda Functions in C++11 - the Definitive Guide](http://www.cprogramming.com/c++11/c++11-lambda-closures.html)
