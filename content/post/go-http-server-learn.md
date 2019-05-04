---
title: Go 语言 HTTP Server 源码学习
categories: [
  "Go"
]
tags: [
  "Go"
]
date: 2017-05-23
image: "fast-lane.jpg"
---

### 1. HTTP Server 实现

在 Go 语言中， HTTP Server 是指支持 http 协议的服务器，HTTP 是一个简单的请求-响应协议，通常运行在 TCP 之上，通过客户端发送请求给服务器得到对应的响应。

在 Go 中一个简单 HTTP 服务实现如下：

    package main

    import (
        "fmt"
        "net/http"
    )

    // step3. 处理请求并返回结果
    func Hello(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello world!")
    }

    func HelloUser(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello thinkerou!")
    }

    func main() {
        // step1. 注册路由
        http.HandleFunc("/", Hello)
        http.HandleFunc("/user/", HelloUser)

        // step2. 监听服务
        http.ListenAndServe(":8080", nil)
    }

这就是一个完整的简单的 Go HTTP Server 程序，运行该程序后，在浏览器输入 `http://127.0.0.1:8080/` 将会输出 `Hello world!`，以及输入 `http://127.0.0.1:8080/user/` 将会输出 `Hello thinkerou` 到浏览器窗口。

### 2. 代码分析

从前述示例代码可知，一个完整简单的 Go HTTP Server 程序包含三部分：

- 注册路由
- 监听服务
- 处理请求

故后续代码分析就从这三方面来说明。

#### 2.1 注册路由

包 `net/http` 中的 `HandleFunc` 方法用来注册路由，方法原型为：

    // HandleFunc registers the handler function for the given pattern
    // in the DefaultServeMux.
    // The documentation for ServeMux explains how patterns are matched.
    func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
        DefaultServeMux.HandleFunc(pattern, handler)
    }

该方法里涉及到如下几个问题：

- `DefaultServeMux` 是什么？DefaultServeMux 是 ServeMux 的一个实例。
- `ServeMux` 是什么？

ServeMux 的代码及注释说明如下：

    // ServeMux is an HTTP request multiplexer.
    // It matches the URL of each incoming request against a list of registered
    // patterns and calls the handler for the pattern that
    // most closely matches the URL.
    //
    // Patterns name fixed, rooted paths, like "/favicon.ico",
    // or rooted subtrees, like "/images/" (note the trailing slash).
    // Longer patterns take precedence over shorter ones, so that
    // if there are handlers registered for both "/images/"
    // and "/images/thumbnails/", the latter handler will be
    // called for paths beginning "/images/thumbnails/" and the
    // former will receive requests for any other paths in the
    // "/images/" subtree.
    //
    // Note that since a pattern ending in a slash names a rooted subtree,
    // the pattern "/" matches all paths not matched by other registered
    // patterns, not just the URL with Path == "/".
    //
    // If a subtree has been registered and a request is received naming the
    // subtree root without its trailing slash, ServeMux redirects that
    // request to the subtree root (adding the trailing slash). This behavior can
    // be overridden with a separate registration for the path without
    // the trailing slash. For example, registering "/images/" causes ServeMux
    // to redirect a request for "/images" to "/images/", unless "/images" has
    // been registered separately.
    //
    // Patterns may optionally begin with a host name, restricting matches to
    // URLs on that host only. Host-specific patterns take precedence over
    // general patterns, so that a handler might register for the two patterns
    // "/codesearch" and "codesearch.google.com/" without also taking over
    // requests for "http://www.google.com/".
    //
    // ServeMux also takes care of sanitizing the URL request path,
    // redirecting any request containing . or .. elements or repeated slashes
    // to an equivalent, cleaner URL.
    type ServeMux struct {
        mu    sync.RWMutex
        m     map[string]muxEntry
        hosts bool // whether any patterns contain hostnames
    }

    type muxEntry struct {
        explicit bool
        h        Handler
        pattern  string
    }

    // NewServeMux allocates and returns a new ServeMux.
    func NewServeMux() *ServeMux { return new(ServeMux) }

    // DefaultServeMux is the default ServeMux used by Serve.
    var DefaultServeMux = &defaultServeMux

    var defaultServeMux ServeMux

ServeMux 是通过 `map[string]muxEntry` 来存储具体的 URL 模式和 handler（handler是实现Handler接口的类型）；通过实现 Handler 的 ServeHTTP 方法来匹配路由。

接口 Handler 的原型及注释说明为：

    // A Handler responds to an HTTP request.
    //
    // ServeHTTP should write reply headers and data to the ResponseWriter
    // and then return. Returning signals that the request is finished; it
    // is not valid to use the ResponseWriter or read from the
    // Request.Body after or concurrently with the completion of the
    // ServeHTTP call.
    //
    // Depending on the HTTP client software, HTTP protocol version, and
    // any intermediaries between the client and the Go server, it may not
    // be possible to read from the Request.Body after writing to the
    // ResponseWriter. Cautious handlers should read the Request.Body
    // first, and then reply.
    //
    // Except for reading the body, handlers should not modify the
    // provided Request.
    //
    // If ServeHTTP panics, the server (the caller of ServeHTTP) assumes
    // that the effect of the panic was isolated to the active request.
    // It recovers the panic, logs a stack trace to the server error log,
    // and hangs up the connection. To abort a handler so the client sees
    // an interrupted response but the server doesn't log an error, panic
    // with the value ErrAbortHandler.
    type Handler interface {
        ServeHTTP(ResponseWriter, *Request)
    }

注意：该接口是整个 HTTP Server 的枢纽，从源码来看一切：

    // HandleFunc registers the handler function for the given pattern.
    func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
        mux.Handle(pattern, HandlerFunc(handler))
    }

    // The HandlerFunc type is an adapter to allow the use of
    // ordinary functions as HTTP handlers. If f is a function
    // with the appropriate signature, HandlerFunc(f) is a
    // Handler that calls f.
    type HandlerFunc func(ResponseWriter, *Request)

    // ServeHTTP calls f(w, r).
    func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
        f(w, r)
    }

- HandlerFunc 是一个函数类型，并实现了 Handler 接口（因为它实现了 Handler 接口的所有方法，即 ServeHTTP 方法），通过调用 HandleFunc() 把 Hello 转换为 HandlerFunc 类型时，就表明 Hello 函数也实现了 ServeHTTP 方法，即实现了 Hadnler 接口。

类型 ServeMux 的 Handle 实现逻辑为：

    // Handle registers the handler for the given pattern.
    // If a handler already exists for pattern, Handle panics.
    func (mux *ServeMux) Handle(pattern string, handler Handler) {
        mux.mu.Lock()
        defer mux.mu.Unlock()

        if pattern == "" {
            panic("http: invalid pattern " + pattern)
        }
        if handler == nil {
            panic("http: nil handler")
        }
        if mux.m[pattern].explicit {
            panic("http: multiple registrations for " + pattern)
        }

        if mux.m == nil {
            mux.m = make(map[string]muxEntry)
        }
        mux.m[pattern] = muxEntry{explicit: true, h: handler, pattern: pattern}

        if pattern[0] != '/' {
            mux.hosts = true
        }

        // Helpful behavior:
        // If pattern is /tree/, insert an implicit permanent redirect for /tree.
        // It can be overridden by an explicit registration.
        n := len(pattern)
        if n > 0 && pattern[n-1] == '/' && !mux.m[pattern[0:n-1]].explicit {
            // If pattern contains a host name, strip it and use remaining
            // path for redirect.
            path := pattern
            if pattern[0] != '/' {
                // In pattern, at least the last character is a '/', so
                // strings.Index can't be -1.
                path = pattern[strings.Index(pattern, "/"):]
            }
            url := &url.URL{Path: path}
            mux.m[pattern[0:n-1]] = muxEntry{h: RedirectHandler(url.String(), StatusMovedPermanently), pattern: pattern}
        }
    }

这样就完成了整个路由注册过程。

#### 2.2 监听服务

包 `net/http` 中的 `ListenAndServe` 方法用来监听服务（HTTP服务，如果是HTTPS服务的话则使用 `ListenAndServeTLS` 方法），方法原型及注释说明为：

    // ListenAndServe listens on the TCP network address addr
    // and then calls Serve with handler to handle requests
    // on incoming connections.
    // Accepted connections are configured to enable TCP keep-alives.
    // Handler is typically nil, in which case the DefaultServeMux is
    // used.
    //
    // A trivial example server is:
    //
    //  package main
    //
    //  import (
    //      "io"
    //      "net/http"
    //      "log"
    //  )
    //
    //  // hello world, the web server
    //  func HelloServer(w http.ResponseWriter, req *http.Request) {
    //      io.WriteString(w, "hello, world!\n")
    //  }
    //
    //  func main() {
    //      http.HandleFunc("/hello", HelloServer)
    //      log.Fatal(http.ListenAndServe(":12345", nil))
    //  }
    //
    // ListenAndServe always returns a non-nil error.
    func ListenAndServe(addr string, handler Handler) error {
        server := &Server{Addr: addr, Handler: handler}
        return server.ListenAndServe()
    }

其中 Server 类型的声明为：

    // A Server defines parameters for running an HTTP server.
    // The zero value for Server is a valid configuration.
    type Server struct {
        Addr      string      // TCP address to listen on, ":http" if empty
        Handler   Handler     // handler to invoke, http.DefaultServeMux if nil
        TLSConfig *tls.Config // optional TLS config, used by ListenAndServeTLS

        // ReadTimeout is the maximum duration for reading the entire
        // request, including the body.
        //
        // Because ReadTimeout does not let Handlers make per-request
        // decisions on each request body's acceptable deadline or
        // upload rate, most users will prefer to use
        // ReadHeaderTimeout. It is valid to use them both.
        ReadTimeout time.Duration

        // ReadHeaderTimeout is the amount of time allowed to read
        // request headers. The connection's read deadline is reset
        // after reading the headers and the Handler can decide what
        // is considered too slow for the body.
        ReadHeaderTimeout time.Duration

        // WriteTimeout is the maximum duration before timing out
        // writes of the response. It is reset whenever a new
        // request's header is read. Like ReadTimeout, it does not
        // let Handlers make decisions on a per-request basis.
        WriteTimeout time.Duration

        // IdleTimeout is the maximum amount of time to wait for the
        // next request when keep-alives are enabled. If IdleTimeout
        // is zero, the value of ReadTimeout is used. If both are
        // zero, there is no timeout.
        IdleTimeout time.Duration

        // MaxHeaderBytes controls the maximum number of bytes the
        // server will read parsing the request header's keys and
        // values, including the request line. It does not limit the
        // size of the request body.
        // If zero, DefaultMaxHeaderBytes is used.
        MaxHeaderBytes int

        // TLSNextProto optionally specifies a function to take over
        // ownership of the provided TLS connection when an NPN/ALPN
        // protocol upgrade has occurred. The map key is the protocol
        // name negotiated. The Handler argument should be used to
        // handle HTTP requests and will initialize the Request's TLS
        // and RemoteAddr if not already set. The connection is
        // automatically closed when the function returns.
        // If TLSNextProto is not nil, HTTP/2 support is not enabled
        // automatically.
        TLSNextProto map[string]func(*Server, *tls.Conn, Handler)

        // ConnState specifies an optional callback function that is
        // called when a client connection changes state. See the
        // ConnState type and associated constants for details.
        ConnState func(net.Conn, ConnState)

        // ErrorLog specifies an optional logger for errors accepting
        // connections and unexpected behavior from handlers.
        // If nil, logging goes to os.Stderr via the log package's
        // standard logger.
        ErrorLog *log.Logger

        disableKeepAlives int32     // accessed atomically.
        inShutdown        int32     // accessed atomically (non-zero means we're in Shutdown)
        nextProtoOnce     sync.Once // guards setupHTTP2_* init
        nextProtoErr      error     // result of http2.ConfigureServer if used

        mu         sync.Mutex
        listeners  map[net.Listener]struct{}
        activeConn map[*conn]struct{}
        doneChan   chan struct{}
    }

从前面的 `ListenAndServe` 方法可知，核心逻辑都封装在 Server 的 ListenAndServe 里面了，那么它的逻辑是如何的呢？代码如下：

    // ListenAndServe listens on the TCP network address srv.Addr and then
    // calls Serve to handle requests on incoming connections.
    // Accepted connections are configured to enable TCP keep-alives.
    // If srv.Addr is blank, ":http" is used.
    // ListenAndServe always returns a non-nil error.
    func (srv *Server) ListenAndServe() error {
        addr := srv.Addr
        if addr == "" {
            addr = ":http"
        }
        ln, err := net.Listen("tcp", addr)
        if err != nil {
            return err
        }
        return srv.Serve(tcpKeepAliveListener{ln.(*net.TCPListener)})
    }

代码说明：

- 初始化监听地址 addr
- 调用 `net` 包的 `Listen` 方法设置监听
- 将监听的 TCP 对象传人 Serve 方法

Server 类型的 Serve(l net.Listener) 为每个请求开启 goroutine 来保证高并发，方法实现为：

    // Serve accepts incoming connections on the Listener l, creating a
    // new service goroutine for each. The service goroutines read requests and
    // then call srv.Handler to reply to them.
    //
    // For HTTP/2 support, srv.TLSConfig should be initialized to the
    // provided listener's TLS Config before calling Serve. If
    // srv.TLSConfig is non-nil and doesn't include the string "h2" in
    // Config.NextProtos, HTTP/2 support is not enabled.
    //
    // Serve always returns a non-nil error. After Shutdown or Close, the
    // returned error is ErrServerClosed.
    func (srv *Server) Serve(l net.Listener) error {
        defer l.Close()
        if fn := testHookServerServe; fn != nil {
            fn(srv, l)
        }
        var tempDelay time.Duration // how long to sleep on accept failure

        if err := srv.setupHTTP2_Serve(); err != nil {
            return err
        }

        srv.trackListener(l, true)
        defer srv.trackListener(l, false)

        baseCtx := context.Background() // base is always background, per Issue 16220
        ctx := context.WithValue(baseCtx, ServerContextKey, srv)
        ctx = context.WithValue(ctx, LocalAddrContextKey, l.Addr())
        for {
            rw, e := l.Accept()
            if e != nil {
                select {
                case <-srv.getDoneChan():
                    return ErrServerClosed
                default:
                }
                if ne, ok := e.(net.Error); ok && ne.Temporary() {
                    if tempDelay == 0 {
                        tempDelay = 5 * time.Millisecond
                    } else {
                        tempDelay *= 2
                    }
                    if max := 1 * time.Second; tempDelay > max {
                        tempDelay = max
                    }
                    srv.logf("http: Accept error: %v; retrying in %v", e, tempDelay)
                    time.Sleep(tempDelay)
                    continue
                }
                return e
            }
            tempDelay = 0
            c := srv.newConn(rw)
            c.setState(c.rwc, StateNew) // before Serve can return
            go c.serve(ctx)
        }
    }

从上面代码 `go c.serve(ctx)` 可知，私有类型 `conn` 的 `serve` 方法是整个服务监听的核心，它读取对应的连接数据进行分配，代码实现为：

    // Serve a new connection.
    func (c *conn) serve(ctx context.Context) {
        c.remoteAddr = c.rwc.RemoteAddr().String()
        defer func() {
            if err := recover(); err != nil && err != ErrAbortHandler {
                const size = 64 << 10
                buf := make([]byte, size)
                buf = buf[:runtime.Stack(buf, false)]
                c.server.logf("http: panic serving %v: %v\n%s", c.remoteAddr, err, buf)
            }
            if !c.hijacked() {
                c.close()
                c.setState(c.rwc, StateClosed)
            }
        }()

        if tlsConn, ok := c.rwc.(*tls.Conn); ok {
            if d := c.server.ReadTimeout; d != 0 {
                c.rwc.SetReadDeadline(time.Now().Add(d))
            }
            if d := c.server.WriteTimeout; d != 0 {
                c.rwc.SetWriteDeadline(time.Now().Add(d))
            }
            if err := tlsConn.Handshake(); err != nil {
                c.server.logf("http: TLS handshake error from %s: %v", c.rwc.RemoteAddr(), err)
                return
            }
            c.tlsState = new(tls.ConnectionState)
            *c.tlsState = tlsConn.ConnectionState()
            if proto := c.tlsState.NegotiatedProtocol; validNPN(proto) {
                if fn := c.server.TLSNextProto[proto]; fn != nil {
                    h := initNPNRequest{tlsConn, serverHandler{c.server}}
                    fn(c.server, tlsConn, h)
                }
                return
            }
        }

        // HTTP/1.x from here on.

        ctx, cancelCtx := context.WithCancel(ctx)
        c.cancelCtx = cancelCtx
        defer cancelCtx()

        c.r = &connReader{conn: c}
        c.bufr = newBufioReader(c.r)
        c.bufw = newBufioWriterSize(checkConnErrorWriter{c}, 4<<10)

        for {
            w, err := c.readRequest(ctx)
            if c.r.remain != c.server.initialReadLimitSize() {
                // If we read any bytes off the wire, we're active.
                c.setState(c.rwc, StateActive)
            }
            if err != nil {
                const errorHeaders = "\r\nContent-Type: text/plain; charset=utf-8\r\nConnection: close\r\n\r\n"

                if err == errTooLarge {
                    // Their HTTP client may or may not be
                    // able to read this if we're
                    // responding to them and hanging up
                    // while they're still writing their
                    // request. Undefined behavior.
                    const publicErr = "431 Request Header Fields Too Large"
                    fmt.Fprintf(c.rwc, "HTTP/1.1 "+publicErr+errorHeaders+publicErr)
                    c.closeWriteAndWait()
                    return
                }
                if isCommonNetReadError(err) {
                    return // don't reply
                }

                publicErr := "400 Bad Request"
                if v, ok := err.(badRequestError); ok {
                    publicErr = publicErr + ": " + string(v)
                }

                fmt.Fprintf(c.rwc, "HTTP/1.1 "+publicErr+errorHeaders+publicErr)
                return
            }

            // Expect 100 Continue support
            req := w.req
            if req.expectsContinue() {
                if req.ProtoAtLeast(1, 1) && req.ContentLength != 0 {
                    // Wrap the Body reader with one that replies on the connection
                    req.Body = &expectContinueReader{readCloser: req.Body, resp: w}
                }
            } else if req.Header.get("Expect") != "" {
                w.sendExpectationFailed()
                return
            }

            c.curReq.Store(w)

            if requestBodyRemains(req.Body) {
                registerOnHitEOF(req.Body, w.conn.r.startBackgroundRead)
            } else {
                if w.conn.bufr.Buffered() > 0 {
                    w.conn.r.closeNotifyFromPipelinedRequest()
                }
                w.conn.r.startBackgroundRead()
            }

            // HTTP cannot have multiple simultaneous active requests.[*]
            // Until the server replies to this request, it can't read another,
            // so we might as well run the handler in this goroutine.
            // [*] Not strictly true: HTTP pipelining. We could let them all process
            // in parallel even if their responses need to be serialized.
            // But we're not going to implement HTTP pipelining because it
            // was never deployed in the wild and the answer is HTTP/2.
            serverHandler{c.server}.ServeHTTP(w, w.req)
            w.cancelCtx()
            if c.hijacked() {
                return
            }
            w.finishRequest()
            if !w.shouldReuseConnection() {
                if w.requestBodyLimitHit || w.closedRequestBodyEarly() {
                    c.closeWriteAndWait()
                }
                return
            }
            c.setState(c.rwc, StateIdle)
            c.curReq.Store((*response)(nil))

            if !w.conn.server.doKeepAlives() {
                // We're in shutdown mode. We might've replied
                // to the user without "Connection: close" and
                // they might think they can send another
                // request, but such is life with HTTP/1.1.
                return
            }

            if d := c.server.idleTimeout(); d != 0 {
                c.rwc.SetReadDeadline(time.Now().Add(d))
                if _, err := c.bufr.Peek(4); err != nil {
                    return
                }
            }
            c.rwc.SetReadDeadline(time.Time{})
        }
    }

其中会调用 `serverhandler{c.server}.ServeHTTP(w, w.req)` 方法来处理请求

#### 2.3 处理请求

serverHandler 初始化路由多路复用器，如果 server 对象没有指定 Handler 则使用默认的 DefaultServeMux 作为路由多路复用器，并调用初始化 Handler 的 ServeHTTP 方法，代码逻辑为：

    // serverHandler delegates to either the server's Handler or
    // DefaultServeMux and also handles "OPTIONS *" requests.
    type serverHandler struct {
        srv *Server
    }

    func (sh serverHandler) ServeHTTP(rw ResponseWriter, req *Request) {
        handler := sh.srv.Handler
        if handler == nil {
            handler = DefaultServeMux
        }
        if req.RequestURI == "*" && req.Method == "OPTIONS" {
            handler = globalOptionsHandler{}
        }
        handler.ServeHTTP(rw, req)
    }

最后会走到匹配路由的代码逻辑里：

    // ServeHTTP dispatches the request to the handler whose
    // pattern most closely matches the request URL.
    func (mux *ServeMux) ServeHTTP(w ResponseWriter, r *Request) {
        if r.RequestURI == "*" {
            if r.ProtoAtLeast(1, 1) {
                w.Header().Set("Connection", "close")
            }
            w.WriteHeader(StatusBadRequest)
            return
        }
        h, _ := mux.Handler(r)
        h.ServeHTTP(w, r)
    }

代码说明：

- 匹配注册到路由上的 handler 函数
- 调用 handler 函数的 ServeHTTP 方法，即 Hello 函数，然后把数据写到 http.ResponseWriter 对象中返回给客户端

会继续走到 ServeMux 的 Hanlder 方法里：

    // Find a handler on a handler map given a path string
    // Most-specific (longest) pattern wins
    func (mux *ServeMux) match(path string) (h Handler, pattern string) {
        var n = 0
        for k, v := range mux.m {
            if !pathMatch(k, path) {
                continue
            }
            if h == nil || len(k) > n {
                n = len(k)
                h = v.h
                pattern = v.pattern
            }
        }
        return
    }

    // Handler returns the handler to use for the given request,
    // consulting r.Method, r.Host, and r.URL.Path. It always returns
    // a non-nil handler. If the path is not in its canonical form, the
    // handler will be an internally-generated handler that redirects
    // to the canonical path.
    //
    // Handler also returns the registered pattern that matches the
    // request or, in the case of internally-generated redirects,
    // the pattern that will match after following the redirect.
    //
    // If there is no registered handler that applies to the request,
    // Handler returns a ``page not found'' handler and an empty pattern.
    func (mux *ServeMux) Handler(r *Request) (h Handler, pattern string) {
        if r.Method != "CONNECT" {
            if p := cleanPath(r.URL.Path); p != r.URL.Path {
                _, pattern = mux.handler(r.Host, p)
                url := *r.URL
                url.Path = p
                return RedirectHandler(url.String(), StatusMovedPermanently), pattern
            }
        }

        return mux.handler(r.Host, r.URL.Path)
    }

    // handler is the main implementation of Handler.
    // The path is known to be in canonical form, except for CONNECT methods.
    func (mux *ServeMux) handler(host, path string) (h Handler, pattern string) {
        mux.mu.RLock()
        defer mux.mu.RUnlock()

        // Host-specific pattern takes precedence over generic ones
        if mux.hosts {
            h, pattern = mux.match(host + path)
        }
        if h == nil {
            h, pattern = mux.match(path)
        }
        if h == nil {
            h, pattern = NotFoundHandler(), ""
        }
        return
    }

最后的最后，会走到这里将数据写给客户端：

    // checkConnErrorWriter writes to c.rwc and records any write errors to c.werr.
    // It only contains one field (and a pointer field at that), so it
    // fits in an interface value without an extra allocation.
    type checkConnErrorWriter struct {
        c *conn
    }

    func (w checkConnErrorWriter) Write(p []byte) (n int, err error) {
        n, err = w.c.rwc.Write(p)
        if err != nil && w.c.werr == nil {
            w.c.werr = err
            w.c.cancelCtx()
        }
        return
    }

当请求结束后，就开始执行连接断开的相关逻辑流程。
