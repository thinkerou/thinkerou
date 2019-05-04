---
title: 网络IPC（套接字）学习笔记
categories: [
  "IPC"
]
tags: [
  "IPC"
]
date: 2017-04-23
image: "read.jpg"
---

### 1. socket 描述符

socket 主要用于运行在不同服务器上的进程之间通信，也可以用于在同一服务器上的进程之间通信。

socket 描述符则是 socket 的唯一标识，其本质是一种特殊的**文件描述符**。

创建 socket 描述符的函数原型为：

    int socket(int domain, int type, int protocol);
    
参数说明：

- domain 参数决定了通信的性质，即地址格式等
  - AF_INET: IPv4因特网域
  - AF_INET6: IPv6因特网域
  - AF_UNIX: UNIX域
  - AF_UNSPEC: 未指定，可以表达任何域的通配符

- type 参数指定类型
  - SOCK_DGRAM: 固定长度，无连接，不可靠的消息
  - SOCK_RAW: IP协议的数据报接口
  - SOCK_SEQPACKET: 固定长度，顺序式，面向连接的，可靠的消息
  - SOCK_STREAM：顺序式，面向连接的，双向的，可靠的字节流

- protocol 参数代表协议号
  - 0: 使用对于给定 domain 和 type 下的默认协议，在 AF_INET 通信域下， SOCK_STREAM 类型的默认协议是 **TCP协议**，而对于 SOCK_DGRAM 类型的默认协议则是 **UDP协议**。

### 2. 网络地址

不同的网络域有不同的地址格式，sockaddr 是地址的通用结构体，如：

    struct sockaddr {
        sa_family_t sa_family; /* address family */
        char        sa_data[]; /* variable-length address */
        /* other infomation */
    };
    
其中，sa_family 即是前面提到的网络域。

对于 AF_INET 的地址格式由 sockaddr_in 结构体表示：

    struct sockaddr_in {  
        sa_family_t     sin_family; /* address family */  
        in_port_t       sin_port; /* port number */  
        struct in_addr  sin_addr; /* IPv4 address */  
    };  
  
    struct in_addr {  
        in_addr_t   s_addr; /* IPv4 address */  
    };

对于 AF_INET6 的地址格式由 sockaddr_in6 结构体表示：

    struct sockaddr_in6 {  
        sa_family_t     sin6_family; /*address family */  
        in_port_t       sin6_port; /*port number */  
        uint32_t        sin6_flowinfo; /*traffic class and flow info */  
        struct in6_addr     sin6_addr; /*IPv6 address */  
        uint32_t        sin6_scope_id; /*IPv6 address */  
    };  
  
    struct in6_addr {  
        uint8_t s6_addr[16]; /* IPv6 address */  
    };

需要注意的是，对于 domain 参数，只有 AF_INET 和 AF_INET6 是支持的。

### 3. 建立连接

在成功获取 socket 描述符后，对于服务端，首先需要和具体的网络地址进行绑定，函数原型为：

    int bind(int sockfd, const struct sockaddr *addr, socklen_t len);
    
参数说明：

- sockaddr 是一个通用的地址结构，因此，任意的网络地址结构都可以作为参数在这里传输
- len 是传递的结构体的长度

如果处理的是**面向连接**的服务（SOCK_STREAM/SOCK_SEQPACKET），则在交换数据前，客户端必须先和服务端建立连接，函数原型为：

    int connect(int sockfd, const struct sockaddr *addr, socklen_t len);
    
它会将 sockfd 与 addr 所代表的网络地址建立连接。

在客户端建立连接时，如果服务端没有对该地址进行**监听**，则连接失败，服务端的监听函数原型为：

    int listen(int sockfd, int backlog);
    
参数说明：

- backlog 表示能够排队最大连接请求数量，它只是为系统提供一个建议值而已。

服务端使用 accept 函数用于接受一个请求，众所周知，建立 TCP 连接是需要进行三次握手的，当客户端调用 connect 函数后，实际上只是发送了一个 SYN 而已，只有当服务端 accept 了这个请求后，才真正完成三次握手，accetp 函数原型为：

    int accept(int sockfd, struct sockaddr *restrict addr, socklen_t *restrict len);
    
该函数返回一个 socket 描述符，该描述符与客户端的 socket 描述符建立了一个 TCP 连接，而原先的描述符则仍然可用于接收连接请求。

在调用该函数时，如果还没有等待响应的连接请求，则进程将默认阻塞，直到有请求到达。

### 4. 数据传输

如前所述，socket 描述符是一种文件描述符，所以针对文件描述符的操作也可以直接应用到 socket 描述符上，如 read 和 write 函数等，可以使用它们来收发数据。

也有专门针对 socket 描述符的数据传输操作，最基本的就是 send 和 recv 函数，原型为：

    ssize_t send(int sockfd, const void *buf, size_t nbytes, int flags);
    ssize_t recv(int sockfd, void *buf, size_t nbytes, int flags);
    
而针对在无连接的 socket 数据传输中，有 sendto 和 recvfrom 两个函数，函数原型为：

    ssize_t sendto(int sockfd, const void *buf, size_t nbytes, int flags,  
        const struct sockaddr *destaddr, socklen_t destlen);  
    ssize_t recvfrom(int sockfd, void *restrict buf, size_t len, int flags,  
        struct sockaddr *restrict addr, socklen_t *restrict addrlen);

与 send 和 recv 相比只是多了两个参数，在 sendto 中多的两个参数用来指定发送的目的地址；而 recvfrom 则用来在接收数据时获取发送方的地址。

### 5. 连接关闭

连接方式可以使用普通文件描述符的关闭方式：close 方式，但是这种关闭方式的问题是：只有当最后一个该描述符的活动引用（使用 dup 函数可增加引用）被关闭后，才会真正关闭连接，因此可以考虑使用 shutdown 函数来关闭连接，函数原型为：

    int shutdown(int sockfd, int how);
    
参数说明：

- how 指定关闭方式
  - SHUT_RD: 关闭读
  - SHUT_WR: 关闭写
  - SHUT_RDWR:  关闭读写
