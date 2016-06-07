---
layout: post
title: 【面试题】判断字符串列表是否能构造成首尾相连的循环列表
categories: 面试
tags: 面试
---

## 一、问题描述

给定一系列单词，如：

> grep, pip, echo, open, net, tag, pre

然后判断这些单词是否能构造成这样的循环列表：

> grep -> pip -> pre -> echo -> open -> net -> tag -> grep

即**前一个单词的尾字符是后一个单词的首字符**。

问题就是：给定单词列表，判断是否能够构成这样的列表。


## 二、解决问题

### 思路1：根据深度遍历或广度遍历判断

    1. 从某个单词开始
    2. 然后在剩下的单词中寻找以该单词尾字符开始的单词
       2.1 如果没找到而列表又没有遍历完，那就不能构造成循环列表了
       2.2 如果找到一个，则重复步骤2
       2.3 如果找到多个，则随机选择一个，重复步骤2
           2.3.1 如果某个能走通整个流程，则能构成循环列表
           2.3.1 如果某个不能走通，则返回步骤2.3使用剩下的单词的某一个，重复步骤2

整个思路就是**深度遍历**或**广度遍历**。

<!--more-->

### 思路2：根据首字符和尾字符个数判断

看到这个问题时，我最新想到的就是这个方法，然后我想了下说：`思路是这样的，根据首尾字符个数来判断，如果个数不相等一定不能构造成循环列表`。但是这时面试官问了这样个问题：

> 如果字符列表是 `ab` 和 `ab` 呢？

其实他已经误解了我的**首尾字符个数相等**的思路，但是当时我也蒙逼了，所以我就继续想，然后试探性的问了下面试官，`我的整个解题思路是没有问题的吧？！`，你猜他怎么说？**思路偏差太远了！！！**那么我就只能想其他方法了，也就是**思路1**的笨方法。（或许他的题集里该题的标准答案应该就是思路1吧）

然后我回来后，继续想我的**首尾字符个数相等**的思路，同时在谷歌百度里搜索这道题的解题思路，居然没有这道题，好吧，那我还是自己好好想想这个思路。

整理后，思路是这样的：

    1. 构建两个map，分别为first记录首字符出现的次数，last记录尾字符出现的次数
    2. 遍历first，然后在last里找该字符为key的元素
        2.1 如果没找到，则不能构造循环列表
        2.2 如果找到，但是它的次数和first对应字符的次数不一样，则不能构造循环列表
    3. 循环，直到结束，则说明可以构造循环列表

核心代码如下：

    bool is_circle_string(vector<string> input)
    {
        map<char, int> first;
        map<char, int> last;
    
        // 构建first 和 last 字典
        // 时间复杂度 O(N)
        vector<string>::iterator it = input.begin();
        for(; it != input.end(); ++it)
        {
            char f = (*it)[0];
            char l = *((*it).rbegin());
            if(first.find(f) != first.end())
            {
                first[f]++;
            }
            else
            {
                first.insert(pair<char, int>(f, 1));
            }

            if(last.find(l) != last.end())
            {
                last[l]++;
            }
            else
            {
                last.insert(pair<char, int>(l, 1));
            }
        }

        // 判断是否能构造成环
        // 时间复杂度 O(logN)
        map<char, int>::iterator i = first.begin();
        for(; i != first.end(); ++i)
        {
            map<char, int>::iterator j = last.find(i->first);
            if(j == last.end() || i->second != j->second)
            {
                return false;
            }
        }
    
        return true;
    }

关于这个思路是否正确，我暂时没有找到能够失败的case，该思路的数学证明等有空研究下。

如果有其他思路或者该思路有任何错误的地方，欢迎指正！

## 三、参考资料

> [详细代码实现](https://github.com/thinkerou/Interview-Questions-And-Solutions/blob/master/src/is_circle_string.cc)











