---
layout: post
title: 如何对模板类进行单元测试
categories: 测试
tags: gtest
---

## 一、背景介绍

> 在对 C++ 项目进行单元测试时，基本都在使用 gtest 进行。无论是单元测试，还是接口测试。

> 具体来说，就是对函数进行单元测试或接口测试，对模块进行集成测试。但是，对于模板类并没有进行测试，而是对其上层调用进行测试。

> 现在的问题是，对于模板类需不需要进行单元测试或接口测试？被写成模板类，说明这个类是比较通用且很多地方都在使用它，所以我认为还是有必要进行测试的。

## 二、如何测试单参数模板类

现有如下一个模板类：

    // 不用纠结于细节，只为说明。
    template <typename E>
    class Queue
    {
    public:
        Queue()
        {
        }

        void Enqueue(const E& element)
        {
        }

        E* Dequeue()
        {
        }

        size_t size() const 
        {
            return (size_t)123;
        }
    };

那么使用 gtest 该如何对该类进行测试呢？

<!--more-->

### 第一步：需要构建工厂类，用于创建被测试类：

    // 主模板类
    template <class T>
    Queue<T>* CreateQueue();
    
    // 全特化版本1
    template <>
    Queue<int>* CreateQueue<int>()
    {
        return new Queue < int > ;
    }

    // 全特化版本2
    template <>
    Queue<char>* CreateQueue<char>()
    {
        return new Queue < char > ;
    }

### 第二步，编写测试类：

    template <class T>
    class QueueTest : public testing::Test
    {
    protected:
        QueueTest() : queue(CreateQueue<T>())
        {
        }

        virtual ~QueueTest()
        {
            delete queue;
        }

        Queue<T>* const queue;
    };

### 第三步，定义需要测试的类型列表：

    typedef ::testing::Types<int, char> Implementations;

### 第四步，编写测试用例：

    TYPED_TEST_CASE(QueueTest, Implementations);
    TYPED_TEST(QueueTest, DefaultConstructor)
    {
        EXPECT_EQ(123, this->queue->size());
    }

### 第五步，运行用例，查看结果。

**特别说明**

如果使用 `--gtest_filter` 进行过滤，则不能写为这样的形式：

	--gtest_filter=QueueTest.DefaultConstructor
	--gtest_filter=QueueTest.*

**原因：**因为后面带了 `/n`，n表示数字。

而应该使用如下形式：

	--gtest_filter=QueueTest*

**在前面的例子中，被测试模板类只有一个类型参数，如果是多个类型参数呢，那该如何测试？**

    // 现在有两个类型参数
    template <class E, class F>
    class QueueNew
    {
    public:
        QueueNew() {}
        void Enqueue(const E& element) {}
        E* Dequeue() {}
        F size() const 
        {
            return (F)123;
        }
    };
    
> 可以静静的想几分钟，看看能不能有思路。

## 三、如何测试多参数模板类

当被测试模板类有两个甚至多个类型参数时，再按前面例子的办法来进行就行不通了，因为 gtest 模板类测试宏仅接收一个模板参数，那该如何处理这个问题呢？

我的做法是**将多个参数放在一个结构体里，做成一个模板类**，像这样写：

	template <class A, class B>
	struct Params
	{
		typedef typename A TypeA;
		typedef typename B TypeB;
	};

那么，工厂类应该做出改变，写为如下：

	template <class I, class V>
	QueueNew<I, V>* CreateQueueNew();

	template <>
	QueueNew<int, int>* CreateQueueNew<int, int>()
	{
		return new QueueNew<int, int>;
	}
	template <>
	QueueNew<char, char>* CreateQueueNew<char, char>()
	{
		return new QueueNew<char, char>;
	}

然后，测试框架随之改变为如下：

	template <class T>
	class QueueNewUnitTest : public testing::Test
	{
	protected:
		QueueNewUnitTest() : m_queue(CreateQueueNew<typename T::TypeA, typename T::TypeB>())
		{
		}
	
		virtual ~QueueNewUnitTest()
		{
			delete m_queue;
		}

		void Setup()
		{
		}

		void TearDown()
		{
		}

		QueueNew<typename T::TypeA, typename T::TypeB>* const m_queue;
	};        

其中，`QueueNew` 是被测试模板类。

同时需要改变需要测试的类型列表写法：

	typedef ::testing::Types<Params<int, int>, Params<char, char> > Implementations;

这样一来就可以开始写测试用例，和前面的大同小异：
	
	TYPED_TEST_CASE(QueueNewUnitTest, Implementations);

	TYPED_TEST(QueueNewUnitTest, DefaultConstructor)
	{
		// 如果需要使用类型，就需要写如下代码
		typename TypeParam::TypeA someA;
		typename TypeParam::TypeB someB;

		ASSERT_EQ(0, this->m_queue->length());
		
		// 假设有push_back 和 push_front函数
		ASSERT_TRUE(this->m_queue->push_back(someA, someB));
        ASSERT_TRUE(this->m_queue->push_front(someA, someB));
		this->m_queue->clear();
	}

运行结果依然如预期。

## 四、参考文献

> * [示例源码](https://github.com/thinkerou)