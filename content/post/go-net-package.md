---
title: Go 语言 net 包使用记录
categories: [
  "Go"
]
tags: [
  "Go"
]
date: 2017-05-07
image: "posts/tixall-gateway-4167373_1280.jpg"
---

### 1. 基础概念

关于网络IPC（套接字）相关的知识点，可以参考相关[《学习笔记》](http://thinkerou.com/2017-04/ipc/)。

在 Go 语言中，包 `net` 封装了关于网络套接字的所有接口。

对于服务端，使用 `Listen` 进行监听，使用 `Accept` 响应连接请求；

对于客户端，使用 `Dial` 进行服务连接请求，使用包 `fmt` 里的函数 `Fprint` 可以进行数据发送。

### 2. 使用示例

服务端程序 tcp-server.go 为：

    package main

	import (
		"bufio"
		"fmt"
		"log"
		"net"
		"strings"
	)
	
	func main() {
		fmt.Println("Launching server ...")
	
		// listen on all interfaces
		ln, err := net.Listen("tcp", ":8081")
		if err != nil {
			log.Fatal("listen tcp error")
		}
	
		// run loop forever or until ctrl-c
		for {
			// accept connection on port
			conn, err := ln.Accept()
			if err != nil {
				log.Fatal("accept tcp error")
			}
	
			// will listen for message to process ending in newline (\n)
			message, _ := bufio.NewReader(conn).ReadString('\n')
	
			// output message received
			fmt.Println("Message Received: ", string(message))
	
			// sample process for string received
			newmessage := strings.ToUpper(message)
	
			// sample process for string back to client
			conn.Write([]byte(newmessage + "\n"))
		}
	}
    


客户端程序 tcp-client.go 为：

	package main
	
	import (
		"bufio"
		"fmt"
		"log"
		"net"
		"os"
	)
	
	func main() {
		// connect to this socket
		conn, err := net.Dial("tcp", "127.0.0.1:8081")
		if err != nil {
			log.Fatal("dial tcp error")
		}
	
		for {
			// read in input from stdin
			reader := bufio.NewReader(os.Stdin)
			fmt.Print("Text to send: ")
			text, err := reader.ReadString('\n')
			if err != nil {
				log.Fatal("read string error")
			}
	
			// send to socket
			fmt.Fprint(conn, text+"\n")
	
			// listen for replay
			message, err := bufio.NewReader(conn).ReadString('\n')
			if err != nil {
				log.Fatal("read string error")
			}
	
			fmt.Print("Message from server: " + message)
		}
	}

首先运行 tcp-server 程序，再运行 tcp-client 程序。

