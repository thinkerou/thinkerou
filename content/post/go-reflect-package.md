---
title: Go 语言 reflect 包使用记录
categories: [
  "Go"
]
tags: [
  "Go"
]
date: 2017-02-18
image: "frustrated.jpg"
---

在 Go 语言中 `reflect` 包有两个数据类型是必须要知道的：

- Type：定义的类型的数据类型
- Value：定义的类型的值的类型

更多更全的信息和使用说明请见[官网文档](https://golang.org/pkg/reflect/#pkg-examples)

先看一段示例代码：

    package main
    
    import (
        "fmt"
        "reflect"
    )
    
    type MyStruct struct {
        name string
    }
    
    func (my *MyStruct) GetName() string {
        return my.name
    }

    func main() {
        s := "Hello world!"
        fmt.Println(reflect.TypeOf(s))
        fmt.Println(reflect.ValueOf(s))
        
        m := new(MyStruct)
        m.name = "thinkerou"
        fmt.Println(reflect.TypeOf(m))
        fmt.Println(reflect.ValueOf(m))
        fmt.Println(reflect.TypeOf(m).NumMethod())
        
        t := reflect.ValueOf(m).MethodByName("GetName").Call([]reflect.Value{})
        fmt.Println(t[0])
    }
    
运行程序后的输出结果为：

	string
	Hello world!
	*main.MyStruct
	&{thinkerou}
	1
	thinkerou

程序说明：

- `TypeOf` 和 `ValueOf` 分别是获取 `Type` 和 `Value` 的方法
- `Call` 方法实现了类似于 php 中的根据字符串到方法的调用
- 如果需要输出 `main.MyStruct` 应该怎么做呢？
    - 使用 `reflect.TypeOf(m).Elem()` 即可 
