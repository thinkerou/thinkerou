---
layout: post
title: 在 PHP 类中 self 、this 和 static 的区别 
categories: PHP
tags: self static
---

## 一、问题缘由

最近刚开始学习 PHP 语言，快速阅读完语言手册后，为了快速上手就开始看看 [Slim](http://www.slimframework.com/) 源码并开始写一个小的 Demo 以理解从前端到后端的数据流向。

但是在 Slim 源码文件 Slim.php 里 Slim 类的实现里有如下代码：

	class Slim
	{
	    /**
	     * @const string
	     */
	    const VERSION = '2.6.3';
	
	    /**
	     * @var \Slim\Helper\Set
	     */
	    public $container;
	
	    /**
	     * @var array[\Slim]
	     */
	    protected static $apps = array();
	
	    /**
	     * @var string
	     */
	    protected $name;
	
	    // ...
	    
	    /**
        * Get application instance by name
        * @param  string    $name The name of the Slim application
        * @return \Slim\Slim|null
        */
        public static function getInstance($name = 'default')
        {
            return isset(static::$apps[$name]) ? static::$apps[$name] : null;
        }
        
        // ...
        
    }
    
那么，代码段 **static::$apps[$name])** 是什么意思呢？为什么是关键字 **static** 而不是 **self** 呢？甚至是 **$this->apps[$name]** 呢？接下来就讲讲在 PHP 的类里 **this**、**self** 和 **static** 的区别。

<!--more-->
    
## 二、

## 三、参考资料

> [PHP Manual](http://php.net/manual/en/index.php) -> [Language Reference](http://php.net/manual/en/langref.php) -> [Class and Objects](http://php.net/manual/en/language.oop5.php) -> [Late Static Bingings](http://php.net/manual/en/language.oop5.late-static-bindings.php)

> StackOverflow: [New self vs. new static](http://stackoverflow.com/questions/5197300/new-self-vs-new-static)

> StackOverflow: [When to use self vs $this?](http://stackoverflow.com/questions/151969/when-to-use-self-vs-this)