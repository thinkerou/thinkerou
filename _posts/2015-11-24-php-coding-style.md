---
layout: post
title: PHP 代码规范摘记
categories: PHP
tags: 规范
---

## 一、概览

- PHP 代码文件**必须**以 `<?php` 或 `<?=` 标签开始；

- PHP 代码文件**必须**以 `不带BOM的 UTF-8` 编码；

- PHP 代码中**应该**只定义类、函数、常量等声明，或其他会产生 `从属效应` 的操作（如：生成文件输出以及修改ini配置文件等），二者只能选其一；

- 类的命名**必须**遵循 `StudlyCaps` 大写开头的驼峰命名规范；

- 类中的常量所有字母都**必须**大写，单词间用下划线分隔；

- 方法名称**必须**符合 `camelCase` 式的小写开头驼峰命名规范；

- 代码**必须**使用4个空格符而不是 tab键 进行缩进；

- 每个 `namespace` 命名空间声明语句和 `use` 声明语句块后面，**必须**插入一个空白行；

- 类的开始花括号(`{`)**必须**写在函数声明后自成一行，结束花括号(`}`)也**必须**写在函数主体后自成一行；

- 方法的开始花括号(`{`)**必须**写在函数声明后自成一行，结束花括号(`}`)也**必须**写在函数主体后自成一行；

- 类的属性和方法**必须**添加访问修饰符（`private`、`protected` 以及 `public`）， `abstract` 以及 `final` **必须**声明在访问修饰符之前，而 `static` **必须**声明在访问修饰符之后；
  
- 控制结构的关键字后**必须**要有一个空格符，而调用方法或函数时则**一定不能**有空格符；

- 控制结构的开始花括号(`{`)**必须**写在声明的同一行，而结束花括号(`}`)**必须**写在主体后自成一行；

- 控制结构的开始左括号后和结束右括号前，都**一定不能**有空格符。

> 以下例子程序简单展示了以上大部分规范：

	<?php
	namespace Vendor\Package;
	
	use FooInterface;
	use BarClass as Bar;
	use OtherVendor\OtherPackage\BazClass;
	
	class Foo extends Bar implements FooInterface
	{
	    public function sampleFunction($a, $b = null)
	    {
	        if ($a === $b) {
	            bar();
	        } elseif ($a > $b) {
	            $foo->bar($arg1);
	        } else {
	            BazClass::bar($arg2, $arg3);
	        }
	    }
	
	    final public static function bar()
	    {
	        // method body
	    }
	}

## 二、通用规则

#### 1. 文件

所有 PHP 文件**必须**以一个空白行作为结束；

<!--more-->

纯 PHP 代码文件**必须**`省略`最后的 `?>` 结束标签。

#### 2. 缩进

代码**必须**使用4个空格符的缩进，**一定不能**用 tab键 。

> 备注：
> 使用空格而不是 tab 键缩进的好处在于避免在比较代码差异、打补丁、重阅代码以及注释时产生混淆。

#### 3. 关键字及 True/False/Null

PHP 所有[关键字](http://php.net/manual/en/reserved.keywords.php)**必须**全部`小写`；

常量 `true` 、`false` 和 `null` 也**必须**全部`小写`。

## 三、namespace 及 use 声明

`namespace` 声明后**必须**插入一个空白行；

所有 `use` **必须**在 `namespace` 后声明；

每条 `use` 声明语句**必须**只有一个 `use` 关键词；

`use` 声明语句块后**必须**要有一个空白行。

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	use FooClass;
	use BarClass as Bar;
	use OtherVendor\OtherPackage\BazClass;
	
	// ... additional PHP code ...


## 四、 类、属性和方法

> 注：这里的“类”泛指所有的 class 类、接口和 traits 可复用代码块。

#### 1. 扩展与继承

关键词 `extends` 和 `implements`**必须**写在类名称的同一行；

类的开始花括号**必须**独占一行，结束花括号也**必须**在类主体后独占一行。

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	use FooClass;
	use BarClass as Bar;
	use OtherVendor\OtherPackage\BazClass;
	
	class ClassName extends ParentClass implements \ArrayAccess, \Countable
	{
	    // constants, properties, methods
	}

#### 2. 属性

每个属性都**必须**添加访问修饰符；

**一定不可**使用关键字 `var` 声明一个属性；

每条语句**一定不可**定义超过一个属性；

**不要**使用下划线作为前缀，来区分属性是 protected 或 private。

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	class ClassName
	{
	    public $foo = null;
	}

#### 3. 方法

所有方法都**必须**添加访问修饰符；

**不要**使用下划线作为前缀，来区分方法是 protected 或 private；

方法名称后**一定不能**有空格符，其开始花括号**必须**独占一行，结束花括号也**必须**在方法主体后单独成一行。参数左括号后和右括号前**一定不能**有空格；

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	class ClassName
	{
	    public function fooBarBaz($arg1, &$arg2, $arg3 = [])
	    {
	        // method body
	    }
	}   

#### 4. 方法参数

参数列表中，每个逗号后面**必须**要有一个空格，而逗号前面**一定不能**有空格；

有默认值的参数，**必须**放到参数列表的末尾。

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	class ClassName
	{
	    public function foo($arg1, &$arg2, $arg3 = [])
	    {
	        // method body
	    }
	}

#### 5. `abstract` 、 `final` 以及 `static`

需要添加 `abstract` 或 `final` 声明时， **必须**写在访问修饰符前，而 `static` 则**必须**写在其后。

> 示例代码如下：

	<?php
	namespace Vendor\Package;
	
	abstract class ClassName
	{
	    protected static $foo;
	
	    abstract protected function zim();
	
	    final public static function bar()
	    {
	        // method body
	    }
	}

#### 6. 方法及函数调用

方法及函数调用时，方法名或函数名与参数左括号之间**一定不能**有空格，参数右括号前也**一定不能**有空格，每个参数前**一定不能**有空格，但其后**必须**有一个空格。

> 示例代码如下：

	<?php
	bar();
	$foo->bar($arg1);
	Foo::bar($arg2, $arg3);

## 五、控制结构

控制结构的基本规范如下：

- 控制结构关键词后**必须**有一个空格；
- 左括号 `(` 后**一定不能**有空格；
- 右括号 `)` 前也**一定不**能有空格；
- 右括号 `)` 与开始花括号 `{` 间**一定**有一个空格；
- 结构体主体**一定**要有一次缩进；
- 结束花括号 `}` **一定**在结构体主体后单独成行。

每个结构体的主体都**必须**被包含在成对的花括号之中，这能让结构体更加结构化，以及减少加入新行时出错的可能性。


#### 1. `if`、 `elseif` 和 `else`

> 示例代码如下：

	<?php
	if ($expr1) {
	    // if body
	} elseif ($expr2) {
	    // elseif body
	} else {
	    // else body;
	}

**应该**使用关键词 `elseif` 代替所有 `else if` ，以使得所有的控制关键字都像是单独的一个词。 


#### 2. `switch` 和 `case`

> 示例代码如下：

	<?php
	switch ($expr) {
	    case 0:
	        echo 'First case, with a break';
	        break;
	    case 1:
	        echo 'Second case, which falls through';
	        // no break
	    case 2:
	    case 3:
	    case 4:
	        echo 'Third case, return instead of break';
	        return;
	    default:
	        echo 'Default case';
	        break;
	}

> 如果存在非空的 `case` 直穿语句，主体里必须有类似 `// no break` 的注释。


#### 3. `while` 和 `do while`

> 示例代码如下：

	<?php
	while ($expr) {
	    // structure body
	}
	
	do {
	    // structure body;
	} while ($expr);


#### 4. `for`

> 示例代码如下：

	<?php
	for ($i = 0; $i < 10; $i++) {
	    // for body
	}

#### 5. `foreach`

> 示例代码如下：

	<?php
	foreach ($iterable as $key => $value) {
	    // foreach body
	}

#### 6. `try`, `catch`

> 示例代码如下：

	<?php
	try {
	    // try body
	} catch (FirstExceptionType $e) {
	    // catch body
	} catch (OtherExceptionType $e) {
	    // catch body
	}

## 六、闭包

声明闭包时关键词 `function` 后及关键词 `use` 的前后都**必须**要有一个空格；

开始花括号**必须**写在声明的同一行，结束花括号**必须**紧跟主体结束的下一行；

参数列表和变量列表的左括号后以及右括号前**必须不能**有空格；

参数和变量列表中，逗号前**必须不能**有空格，而逗号后**必须**要有空格；

闭包中有默认值的参数**必须**放到列表的后面。

> 示例代码如下：

	<?php
	$closureWithArgs = function ($arg1, $arg2) {
	    // body
	};
	
	$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
	    // body
	};

## 七、参考资料

> [PHP-FIG](http://www.php-fig.org/)

> [Github PSR 中文版](https://github.com/PizzaLiu/PHP-FIG)
