---
layout: post
title: Python 装饰器
categories: Python
tags: 装饰器
---

## 一、介绍

## 二、其他

先贴一段代码，后续再补充装饰器相关的知识点：

    def parameter(lst, round):
        def wrapper(func):
            def action(self):
                for i in xrange(round):
                    for l in lst:
                        func(self, l, i)
                return
            return action
        return wrapper


    class Test(unittest.TestCase):

        testlist = ['tian', 'zhang', 'li']
        testround = 2

        @classmethod
        def setUpClass(cls):
            pass

        def setUp(self):
            pass

        @parameter(lst=testlist, round=testround)
        def testAction(self, e, i):

            print e, i


        def tearDown(self):
            pass

        @classmethod
        def tearDownClass(cls):
            pass


    if __name__ == '__main__':
        unittest.main()

将参数封装后做装饰器用。

<!--more-->

## 三、参考文档

> [Stackoverflow: How can I make a chain of function decorators in Python?](http://stackoverflow.com/questions/739654/how-can-i-make-a-chain-of-function-decorators-in-python/1594484#1594484)

> [Decorators and Functional Python](http://www.brianholdefehr.com/decorators-and-functional-python)

> [Understanding Python Decorators in 12 Easy Steps!](https://dzone.com/articles/understanding-python)