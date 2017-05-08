---
layout: post
title: 小心使用 STL 的 erase 函数
categories: C++
tags: STL
---

### 1. 基础概念

在 STL 中，容器按照存储方式分为两大类：

- 以数组形式存储的序列容器，如vector、deque等；
- 以非连续的节点形式存储的关联容器，如list、set、map等

对于不同类型的容器，在使用 `erase` 方法来进行元素删除时，需要格外小心，针对 map 的使用注意，请见[map 迭代器实效问题](http://thinkerou.com/2016-01/stl-map-iterator/)

<!--more-->
    
### 2. 序列容器之vector/deque

对于序列型容器，erase 迭代器不仅使所有指向被删除元素的迭代器失效，还使被删除元素之后的所有迭代器失效。

所以正确的代码书写是：

    std::vector<int> vec;
    std::vector<int>::iterator it;
    for(it =vec.begin(); it != vec.end();)
    {
        if(doDelete(*it)
        {
            it = vec.erase(it);
        }
        else
        {
            it++;
        }
    }

通过 erase 方法的返回值来获取下一个元素的位置。

### 3. 关联容器之list/set/map

而关联容器的 erase 迭代器只是被删除元素的迭代器失效，但返回值是 void，因此不能使用序列容器的书写方式，而是使用这样的书写方式：

    std::map<std::string, int> m;
    std::map<std::string, int>::iterator it;
    for(it = m.begin(); it != m.end();)
    {
        if(canDelete)
        {
            m.erase(it++);
        }
    }

在调用 erase 方法前先使用后置自加来获取下一个元素的位置。

需要注意的是，`list` 是可以使用以上两种方式的任何一种的。
最后的规则就是：尽量不要使用容器的插入、删除操作之前的迭代器。

### 4. 总结

因为不同容器类型的实现数据结构不尽相同，所以不同的容器的迭代器的失效情况就会有所区别。

针对 erase 容器中的元素，《Effective STL》条款9给出了相应的原则：

- 对于关联容器（如map、set等）删除当前的 iterator，仅会使当前的 iterator 失效，只要在 erase 时递增当前 iterator 即可。这是因为 map、set 这样的关联容器是使用红黑树实现的，插入、删除一个节点并不会对其他节点造成影响；
- 对于序列容器（如vector、deque等）删除当前的 iterator 会使后面所有元素的 iterator 都失效。这是因为 vector 这样的序列容器使用连续分配的内存实现的，删除一个元素导致后面所有的元素会向前移动一个位置，但 erase 方法可以返回下一个有效的 iterator 又带来了很大的方便；
- 对于 list 来说，它使用了不连续分配的内存，但它的 erase 方法也会返回下一个有效的 iterator，所以它可以使用如上两种方法。





