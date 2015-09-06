---
layout: post
title: Flask 介绍
categories: Python
tags: flask
---

## 一、Flask 入门

Flask 是一个微型 web 开发框架，微型（"mirco"）的意思保持内核的简洁但是易于扩展。

使用 pip 命令安装 Flask：

	pip install Flask

创建一个 hello.py 文件，内容如下：

	from flask import Flask
	app = Flask(__name__)

	@app.route('/')
	def hello():
		return 'Hello world.'

	if __name__ == '__main__':
		app.run()

现在运行 hello.py 文件：
	
	python hello.py
	 * Running on http://127.0.0.1:5000/
	127.0.0.1 - - [05/Sep/2015 17:19:02] "GET / HTTP/1.1" 200 -

同时在浏览器中打开 http://127.0.0.1:5000，会看到页面输出了 Hello world. 即函数 hello() 返回的内容。端口号 5000 是 Flask 默认端口号。

编写一个 Flask 就是这么简单，接下来介绍更多 Flask 相关的知识。

## 二、Jinja2 模板引擎

TODO：（找时间补上）

## 三、参考文献

[Flask 英文介绍](http://flask.pocoo.org/)

[Flask 中文介绍](https://dormousehole.readthedocs.org/en/latest/)

[Flask 示例：flask-website](https://github.com/mitsuhiko/flask-website)

[Flask 示例：minitwit](https://github.com/mitsuhiko/flask/tree/master/examples/minitwit/)

[Flask 入门介绍](https://pythonspot.com/python-flask-tutorials/)
