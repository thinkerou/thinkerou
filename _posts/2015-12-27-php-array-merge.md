---
layout: post
title: 那些踩过的 PHP 坑之 array_merge 函数
categories: PHP
tags: PHP
---

## 一、函数 array_merge 坑在哪里

最近在使用函数 `array_merge` 合并两个数组时，得到的结果总是不确定，代码如这样：

    $arrResult = array_merge($arrInput1, $arrInput2);
    
如果已踩过这个坑，肯定能一眼看出代码的潜在问题，以及如何避免，但是问题究竟是什么呢？变量 `$arrResult` 的值会根据函数 `array_merge` 的两个参数的类型及值而变化，如：**键为数字的字典**、**null** 等，详细问题解释说明请继续往下看！

<!--more-->

## 二、函数 array_merge 说明

**来自 PHP 官方网站的`array_merge`函数说明**

> 函数功能：合并一个或多个数组

> 函数原型：
    
    array array_merge(array $array1[, array $...])

函数 `array_merge` 将一个或多个数组的单元合并，后一个数组中的值追加到前一个数组的后面，并作为函数结果返回。

> 示例场景1：如果输入数组中有相同的**字符串键名**，则该键名后面的值将覆盖前一个值，如：

	<?php
	// PHP 5.6.15
	$a = array('hello' => 1, 'world' => 2);
	$b = array('hi' => 1, 'world' => 3);
	
	$c = array_merge($a, $b);
	var_dump($c);
	
	$d = array_merge($b, $a);
	var_dump($d);

执行脚本后的结果为：

	array(3) {
	  ["hello"]=>
	  int(1)
	  ["world"]=>
	  int(3)
	  ["hi"]=>
	  int(1)
	}
	array(3) {
	  ["hi"]=>
	  int(1)
	  ["world"]=>
	  int(2)
	  ["hello"]=>
	  int(1)
	}

> 示例场景2：如果输入数组只有一个且为数字索引，即其中一个数组为 `array()`，则键名会**以连续方式重新索引**，如：

	php > $a = array(3 => 3, 2=>2, 5=>5);
	php > $b = array_merge($a);
	php > var_dump($b);
	array(3) {
	  [0]=>
	  int(3)
	  [1]=>
	  int(2)
	  [2]=>
	  int(5)
	}
	php > $c = array_merge($a, array());
	php > var_dump($c);
	array(3) {
	  [0]=>
	  int(3)
	  [1]=>
	  int(2)
	  [2]=>
	  int(5)
	}
	php > $d = array_merge(array(), $a);
	php > var_dump($d);
	array(3) {
	  [0]=>
	  int(3)
	  [1]=>
	  int(2)
	  [2]=>
	  int(5)
	}

> 示例场景3：如果输入数组为标准的数组，即索引为默认的数字索引，则后面的值不会覆盖原来的值，而是追加到后面，如：

	<?php
	// PHP 5.6.15
	$a = array('hello', 20, 'world');
	$b = array(5, 'hello', 20);
	
	$c = array_merge($a, $b);
	var_dump($c);
	
	$d = array_merge($b, $a);
	var_dump($d);
	
执行脚本后的输出为：

	array(6) {
	  [0]=>
	  string(5) "hello"
	  [1]=>
	  int(20)
	  [2]=>
	  string(5) "world"
	  [3]=>
	  int(5)
	  [4]=>
	  string(5) "hello"
	  [5]=>
	  int(20)
	}
	array(6) {
	  [0]=>
	  int(5)
	  [1]=>
	  string(5) "hello"
	  [2]=>
	  int(20)
	  [3]=>
	  string(5) "hello"
	  [4]=>
	  int(20)
	  [5]=>
	  string(5) "world"
	}

又如：

	<?php
    // PHP 5.6.15
	$a = array(10 => 1, 'world' => 2);
	$b = array('hi' => 1, 10 => 3);
	
	$c = array_merge($a, $b);
	var_dump($c);
	
	$d = array_merge($b, $a);
	var_dump($d);

执行脚本后的结果为：

	array(4) {
	  [0]=>
	  int(1)
	  ["world"]=>
	  int(2)
	  ["hi"]=>
	  int(1)
	  [1]=>
	  int(3)
	}
	array(4) {
	  ["hi"]=>
	  int(1)
	  [0]=>
	  int(3)
	  [1]=>
	  int(1)
	  ["world"]=>
	  int(2)
	}

对于包含有数字索引的数组的合并结果是不是和预想的有些不一样呢？对于我这样的初学者来说，接下来会犯这样的错误的：

> 合并完两个 array 后，会使用以前的 key 去进行操作

**坑一**

> 当合并数组中有**数字键名**时，其会被**重新编号**！

但是，如果想完全保留原有数组并只想新的数组附加到后面，则需要使用 `+` 运算符，关于此请继续阅读。

从前面的函数原型格式可以知道，函数 array_merge 只能接受 array 参数，但如果参数是 `null` 呢？会有什么结果输出？

**坑二**

> 当合并数组中

## 三、使用 + 合并数组


## 四、参考资料

> [PHP Manual: Array Functions](http://php.net/manual/en/function.array-merge.php)

> [StackOverflow: merge_array returns null if one or more of arrays is empty?](http://stackoverflow.com/questions/19711491/merge-array-returns-null-if-one-or-more-of-arrays-is-empty/19712372#19712372)

> [StackOverflow: php array_merge associative arrays](http://stackoverflow.com/questions/5233721/php-array-merge-associative-arrays)

> [StackOverflow: PHP array_merge with numerical keys](http://stackoverflow.com/questions/5929642/php-array-merge-with-numerical-keys/5929690#5929690)

> [StackOverflow: PHP default array values if key doesn't exist?](http://stackoverflow.com/questions/9555758/php-default-array-values-if-key-doesnt-exist/17443217#17443217)

> [StackOverflow: array_merge() without losing null values](http://stackoverflow.com/questions/24868372/array-merge-without-losing-null-values)
