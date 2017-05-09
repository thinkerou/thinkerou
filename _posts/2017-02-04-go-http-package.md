---
layout: post
title: Go 语言 http 包使用记录
categories: Go
tags: Go
---

### 1. 基础概念

在 Go 语言中，编写一个 http web 服务器有两种方法：

- 使用 net 包的 `net.Listen` 来对端口进行监听；
- 使用 net/http 包的 `ListenAndServve` 来对端口进行监听，事实上，该包是基于 net 包进行封装的，即底层仍是 net 包相关的知识。

所以，使用 `net/http` 会更方便快捷，减少了很多不必要的封装和处理。

<!--more-->
    
### 2. http 客户端

基于 net/http 包实现 http 客户端通常的代码书写是：

    package main
    
    import (
        "fmt"
        "net/http"
        "io/ioutil"
    )

    func main() {
        response, err := http.Get("http://www.baidu.com")
        if err != nil {
            // handle error
        }
        defer response.Body.Close()
        body, err := ioutil.ReadAll(response.Body)
        if err != nil {
            // handle error
        }
        fmt.Println(string(body))
    }
    
类似 Get 的方法还有 Post、PostForm等，更多详细说明和示例请见[这里](https://golang.org/pkg/net/http/)。

除了可以使用 Get、Post、PostForm 来建立客户端外，还可以使用 `http.Client` 和 `http.NewRequest` 来建立客户端，代码书写为：

    package main
    
    import (
        "net/http"
        "io/ioutil"
        "fmt"
    )

    func main() {
        client := &http.Client()
        request, err := http.NewRequest("GET", "http://www.baidu.com", nil)
        if err != nil {
            // handle error
        }
        
        request.Header.Set("Cache-Control", "max-age=0")
        request.Header.Set("Connection", "keep-alive")
        // ...
        
        response, err := client.Do(request)
        if err != nil {
            // handle error
        }
        if response.StatusCode == 200 {
            body, err := ioutil.ReadAll(response.Body)
            if err != nil {
                // handle error
            }
            fmt.Println(string(body)
        }
    }

### 3. http 服务端

针对 http 服务端，`net/http` 包封装后，使用起来非常简单，仅仅需要两行代码即可实现：

    package main
    
    import (
        "net/http"
    )
    
    func SayHello(w http.ResponseWriter, req *http.Request) {
        w.Write([]byte("Hello"))
    }
    
    func main() {
        http.HandleFunc("/hello", SayHello)
        http.ListenAndServe(":8081", nil)
    }
    
代码简要说明：

- 端口监听：`http.ListenAndServe`
- 注册路由处理函数：`http.HandleFunc`
- 具体处理函数：`SayHello`
