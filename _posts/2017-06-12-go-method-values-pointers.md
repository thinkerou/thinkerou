---
layout: post
title: Go 语言 struct 方法该使用 pointer 还是 value 传值？
categories: Go
tags: Go
---

在 Go 语言中 struct 方法可以使用 `pointer` 或 `value` 两种形式进行传值：

    func (s *MyStruct) pointerMethod() {} // method on pointer
    func (s MyStruct) valueMethod() {} // method on value
    
但是，这两种方式都在什么场景下使用呢？

<!--more-->

先看一段示例代码：

    package main
    
    import "fmt"
    
    type Person struct {
        Name string
        Age  uint
    }
    
    func (c Person) GetAge() {
        fmt.Println("age: ", c.Age)
    }
    
    func main() {
        c := &Person{"thinkerou", 30}
        c.GetAge()
    }
 
 执行代码后的结果也很直接：
 
    age: 30
     
 如果需要动态更新 Age 值，则可以新增 UpdateAge 方法：
 
    package main
    
    import "fmt"
    
    type Person struct {
        Name string
        Age  uint
    }
    
    func (c Person) GetAge() {
        fmt.Println("age: ", c.Age)
    }
    
    func (c Person) UpdateAge(age uint) {
        c.Age = age
    }
    
    func main() {
        c := &Person{"thinkerou", 30}
        c.GetAge()
        c.UpdateAge(20)
        c.GetAge()
    }
    
执行后的输出为：
    
    age:  30
    age:  30
    
从结果可以看出，并不是如预想那样输出结果，这是因为：

> 用 value 方式传值是无法改变 struct 内的成员值

可以通过**将 struct 回传来实现获取修改的值**：

    package main
    
    import "fmt"
    
    type Person struct {
        Name string
        Age  uint
    }
    
    func (c Person) GetAge() {
        fmt.Println("age: ", c.Age)
    }
    
    func (c Person) UpdateAge(age uint) *Person {
        c.Age = age
        return &c
    }
    
    func main() {
        c := &Person{"thinkerou", 30}
        c.GetAge()
        c = c.UpdateAge(20)
        c.GetAge()
    }
    
执行后的输出为：
    
    age:  30
    age:  20
    
该方法能够实现想要的结果，但不是想要的解法。

如果使用 `pointer` 方式呢？

    package main
    
    import "fmt"
    
    type Person struct {
        Name string
        Age  uint
    }
    
    func (c Person) GetAge() {
        fmt.Println("age: ", c.Age)
    }
    
    func (c Person) UpdateAge(age uint) {
        c.Age = age
    }
    
    func (c *Person) UpdateAgeByPtr(age uint) {
        c.Age = age
    }
    
    func main() {
        c := &Person{"thinkerou", 30}
        c.GetAge()
        c.UpdateAge(20)
        c.GetAge()
        c.UpdateAgeByPtr(20)
    }
    
执行后的输出为：
    
    age:  30
    age:  30
    age:  20
    
只要使用 pointer 方式传值就可以正确讲需要改变的值写入。

最终的结论是：

- 如果只要**读值**，则可以使用 value 或 pointer 方式；
- 如果要**写入**，则只能使用 pointer 方式；
- 团队内为了代码一致性，建议全部使用 pointer 方式。