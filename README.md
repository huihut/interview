
## 目录

* [C/C++](#cc)
* [STL](#stl)
* [数据结构](#%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)
* [算法](#%E7%AE%97%E6%B3%95)
* [Problems](#problems)
* [操作系统](#%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)
* [计算机网络](#%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C)
* [数据库](#%E6%95%B0%E6%8D%AE%E5%BA%93)
* [设计模式](#%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)
* [网络编程](#%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B)
* [链接装载库](#%E9%93%BE%E6%8E%A5%E8%A3%85%E8%BD%BD%E5%BA%93)
* [海量数据处理](#%E6%B5%B7%E9%87%8F%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86)
* [其他](#%E5%85%B6%E4%BB%96)
* [书籍](#%E4%B9%A6%E7%B1%8D)
* [复习刷题网站](#%E5%A4%8D%E4%B9%A0%E5%88%B7%E9%A2%98%E7%BD%91%E7%AB%99)
* [面试题目经验](#%E9%9D%A2%E8%AF%95%E9%A2%98%E7%9B%AE%E7%BB%8F%E9%AA%8C)

----

## C/C++

* 封装
* 继承
* 多态
* 虚函数
* 内存分配和管理
* extern"C"
* const作用
* 什么是面向对象（OOP）
* new、malloc、alloca的区别
* 运行时类型识别（RTTI）
* 友元类和友元函数
* struct和class的区别

## STL

## 数据结构

## 算法

### 排序

* [冒泡排序](Algorithm/BubbleSort.h)
* [冒泡排序（改进版）](Algorithm/BubbleSort_orderly.h)
* [选择排序](Algorithm/SelectionSort.h)
* [快速排序](Algorithm/QuickSort.h)
* [文件排序](Algorithm/FileSort)

### 查找

* [顺序查找](Algorithm/SequentialSearch.h)
* [蛮力字符串匹配](Algorithm/BruteForceStringMatch.h)
* [文件查找](Algorithm/FileSearch)

## Problems

### Single Problem

* [Chessboard Coverage Problem (棋盘覆盖问题)](Problems/ChessboardCoverageProblem)

* [Knapsack Problem (背包问题)](Problems/KnapsackProblem)

* [Neumann Neighbor Problem (冯诺依曼邻居问题)](Problems/NeumannNeighborProblem)

* [Round Robin Problem (循环赛日程安排问题)](Problems/RoundRobinProblem)

* [Tubing Problem (输油管道问题)](Problems/TubingProblem)

### Leetcode Problems

#### Array

* [1. Two Sum](Problems/LeetcodeProblems/1-two-sum.h)
* [4. Median of Two Sorted Arrays](Problems/LeetcodeProblems/4-median-of-two-sorted-arrays.h)
* [11. Container With Most Water](Problems/LeetcodeProblems/11-container-with-most-water.h)
* [26. Remove Duplicates from Sorted Array](Problems/LeetcodeProblems/26-remove-duplicates-from-sorted-array.h)
* [53. Maximum Subarray](Problems/LeetcodeProblems/53-maximum-subarray.h)
* [66. Plus One](Problems/LeetcodeProblems/66-plus-one.h)
* [88. Merge Sorted Array](Problems/LeetcodeProblems/88-merge-sorted-array.h)
* [121. Best Time to Buy and Sell Stock](Problems/LeetcodeProblems/121-best-time-to-buy-and-sell-stock.h)
* [169. Majority Element](Problems/LeetcodeProblems/169-majority-element.h)
* [283. Move Zeroes](Problems/LeetcodeProblems/283-move-zeroes.h)


## 操作系统

* 进程间的通信方式（管道、有名管道、信号、共享内存、消息队列、信号量、套接字、文件）

## 计算机网络

* TCP/IP
* TCP协议
* TCP三次握手
* TCP和UDP的区别
* socket套接字
* HTTP返回码

### HTTP

[runoob . HTTP教程](http://www.runoob.com/http/http-tutorial.html)

#### HTTP 请求方法
* GET：请求指定的页面信息，并返回实体主体
* HEAD：类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
* POST：向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
* PUT：从客户端向服务器传送的数据取代指定的文档的内容。
* DELETE：请求服务器删除指定的页面
* CONNECT：HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器
* OPTIONS：允许客户端查看服务器的性能
* TRACE：回显服务器收到的请求，主要用于测试或诊断

#### HTTP 状态码
* 200 OK: 请求成功
* 301 Moved Permanently: 永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新的URI代替
* 400 Bad Request: 客户端请求的语法错误，服务器无法理解
* 401 Unauthorized: 	请求要求用户的身份认证
* 403 Forbidden: 服务器理解请求客户端的请求，但是拒绝执行此请求
* 404 Not Found: 服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面
* 408 Request Timeout: 服务器等待客户端发送的请求时间过长，超时
* 500 Internal Server Error: 服务器内部错误，无法完成请求
* 503 Service Unavailable: 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中
* 504 Gateway Timeout: 充当网关或代理的服务器，未及时从远端服务器获取请求

## 数据库

* 数据库事务四大特性：原子性、一致性、分离性、持久性
* 数据库索引：顺序索引 B+树索引 hash索引
[MySQL索引背后的数据结构及算法原理](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)

## 设计模式

## 网络编程

## 链接装载库

### 内存、栈、堆

一般应用程序内存空间有如下区域：

* 栈：用于维护函数调用的上下文
* 堆：用来容纳应用程序动态分配的内存区域
* 可执行文件映像：存储着可执行文件在内存中的映像，由装载器装载是将可执行文件的内存读取或映射到这里
* 保留区：保留区并不是一个单一的内存区域，而是对内存中受到保护而禁止访问的内存区域的总称，如通常C语言讲无效指针赋值为0（NULL），因此0地址正常情况下不可能有效的访问数据

#### 栈

栈保存了一个函数调用所需要的维护信息，常被称为堆栈帧（Stack Frame）或活动记录（Activate Record），一般包含以下几方面：

* 函数的返回地址和参数
* 临时变量：包括函数的非静态局部变量以及编译器自动生成的其他临时变量
* 保存上下文：包括函数调用前后需要保持不变的寄存器

#### 堆

堆分配算法：

* 空闲链表（Free List）
* 位图（Bitmap）
* 对象池

#### “段错误（segment fault）” 或 “非法操作，该内存地址不能read/write”

典型的非法指针解引用造成的错误。当指针指向一个不允许读写的内存地址，而程序却试图利用指针来读或写该地址时，会出现这个错误。

普遍原因：

* 将指针初始化位NULL，之后没有给它一个合理的值就开始使用指针
* 没用初始化栈中的指针，指针的值一般会是随机数，之后就直接开始使用指针

### 编译链接

#### 编译链接过程

1. 预编译（预编译器处理如`#include`、`#define`等预编译指令，生成`.i`或`.ii`文件）
2. 编译（编译器进行词法分析、语法分析、语义分析、中间代码生成、目标代码生成、优化，生成`.s`文件）
3. 汇编（汇编器把汇编码翻译成机器码，生成`.o`文件）
4. 链接（连接器进行地址和空间分配、符号决议、重定位，生成`.out`文件）

> 现在版本GCC把预编译和编译合成一步，预编译编译程序cc1、汇编器as、连接器ld

> MSVC编译环境，编译器cl、连接器link、可执行文件查看器dumpbin

#### 目标文件

编译器编译源代码后生成的文件叫做目标文件。目标文件从结构上讲，它是已经编译后的可执行文件格式，只是还没有经过链接的过程，其中可能有些符号或有些地址还没有被调整。

> 可执行文件（Windows的`.exe`和Linux的`ELF`）、动态链接库（Windows的`.dll`和Linux的`.so`）、静态链接库（Windows的`.lib`和Linux的`.a`）都是按照可执行文件格式存储（Windows按照PE-COFF，Linux按照ELF）

##### 目标文件格式

* Windows的PE（Portable Executable），或称为PE-COFF，`.obj`格式
* Linux的ELF（Executable Linkable Format），`.o`格式
* Intel/Microsoft的OMF（Object Module Format）
* Unix的`a.out`格式
* MS-DOS的`.COM`格式

> PE和ELF都是COFF（Common File Format）的变种

##### 目标文件存储结构

段 | 功能
--- | ---
File Header | 文件头，描述整个文件的文件属性（包括文件是否可执行、是静态链接或动态连接及入口地址、目标硬件、目标操作系统等）
.text section | 代码段，执行语句编译成的机器代码 
.data section | 数据段，已初始化的全局变量和局部静态变量
.bss section | BBS段（Block Started by Symbol），未初始化的全局变量和局部静态变量（因为默认值为0，所以只是在此预留位置，不占空间）
.rodate section | 只读数据段，存放只读数据，一般是程序里面的只读变量（如const修饰的变量）和字符串常量
.comment section | 注释信息段，存放编译器版本信息
.note.GNU-stack section | 堆栈提示段 

> 其他段略

#### 链接的接口————符号

在链接中，目标文件之间相互拼合实际上是目标文件之间对地址的引用，即对函数和变量的地址的引用。我们将函数和变量统称为符号（Symbol），函数名或变量名就是符号名（Symbol Name）。

如下符号表（Symbol Table）：

Symbol（符号名） | Symbol Value （地址）
--- | ---
main| 0x100
Add | 0x123
... | ...

#### extern "C"

extern "C" 的作用是让C++编译器将 `extern "C"` 声明的代码当作C语言代码处理，可以避免C++因符号修饰导致代码不能和C语言库中的符号进行链接的问题。

```
#ifdef __cplusplus
extern "C" {
#endif

void *memset(void *, int, size_t);

#ifdef __cplusplus
}
#endif
```

### Linux的共享库（Shared Library）

Linux下的共享库就是普通的ELF共享对象。

共享库版本更新应该保证二进制接口ABI（Application Binary Interface）的兼容

#### 命名

`libname.so.x.y.z`

* x：主版本号，不同主版本号的库之间不兼容，需要重新编译
* y：次版本号，高版本号向后兼容低版本号
* z：发布版本号，不对接口进行更改，完全兼容

#### 路径

大部分包括Linux在内的开源系统遵循FHS（File Hierarchy Standard）的标准，这标准规定了系统文件如何存放，包括各个目录结构、组织和作用。

* /lib：存放系统最关键和最基础的共享库，如动态链接器、C语言运行库、数学库等
* /usr/lib：存放非系统运行时所需要的关键性的库，主要是开发库
* /usr/local/lib：存放跟操作系统本身并不十分相关的库，主要是一些第三方应用程序的库

> 动态链接器会在`/lib`、`/usr/lib`和由`/etc/ld.so.conf`配置文件指定的，目录中查找共享库

#### 环境变量

* LD_LIBRARY_PATH：临时改变某个应用程序的共享库查找路径，而不会影响其他应用程序
* LD_PRELOAD：指定预先装载的一些共享库甚至是目标文件
* LD_DEBUG：打开动态链接器的调试功能

### Windows的动态链接库（Dynamic-Link Library）

DLL头文件
```
#ifdef __cplusplus
extern "C" {
#endif

#ifdef _WIN32
#  ifdef MODULE_API_EXPORTS
#    define MODULE_API __declspec(dllexport)
#  else
#    define MODULE_API __declspec(dllimport)
#  endif
#else
#  define MODULE_API
#endif

MODULE_API int module_init();

#ifdef __cplusplus
}
#endif
```

DLL源文件
```
#define MODULE_API_EXPORTS
#include "module.h"

MODULE_API int module_init()
{
    /* do something useful */
    return 0;
}
```

### 运行库（Runtime Library）

#### 典型程序运行步骤

1. 操作系统创建进程，把控制权交给程序的入口（往往是运行库中的某个入口函数）
2. 入口函数对运行库和程序运行环境进行初始化（包括堆、I/O、线程、全局变量构造等等）。
3. 入口函数初始化后，调用main函数，正式开始执行程序主体部分。
4. main函数执行完毕后，返回到入口函数进行清理工作（包括全局变量析构、堆销毁、关闭I/O等），然后进行系统调用结束进程。

> 一个程序的I/O指代程序与外界的交互，包括文件、管程、网络、命令行、信号等。更广义地讲，I/O指代操作系统理解为“文件”的事物。

#### glibc 入口

`_start -> __libc_start_main -> exit -> _exit`

其中`main(argc, argv, __environ)`函数在`__libc_start_main`里执行。

#### MSVC CRT 入口

`int mainCRTStartup(void)`

执行如下操作：

1. 初始化和OS版本有关的全局变量。
2. 初始化堆。
3. 初始化I/O。
4. 获取命令行参数和环境变量。
5. 初始化C库的一些数据。
6. 调用main并记录返回值。
7. 检查错误并将main的返回值返回。

#### C语言运行库（CRT）

大致包含如下功能：

* 启动与退出：包括入口函数及入口函数所依赖的其他函数等。
* 标准函数：有C语言标准规定的C语言标准库所拥有的函数实现。
* I/O：I/O功能的封装和实现。
* 堆：堆的封装和实现。
* 语言实现：语言中一些特殊功能的实现。
* 调试：实现调试功能的代码。

#### C语言标准库（ANSI C）

包含：

* 标准输入输出（stdio.h）
* 文件操作（stdio.h）
* 字符操作（ctype.h）
* 字符串操作（string.h）
* 数学函数（math.h）
* 资源管理（stdlib.h）
* 格式转换（stdlib.h）
* 时间/日期（time.h）
* 断言（assert.h）
* 各种类型上的常数（limits.h & float.h）
* 变长参数（stdarg.h）
* 非局部跳转（setjmp.h）

## 海量数据处理

* [ 海量数据处理面试题集锦](http://blog.csdn.net/v_july_v/article/details/6685962)
* [十道海量数据处理面试题与十个方法大总结](http://blog.csdn.net/v_JULY_v/article/details/6279498)

## 其他

## 书籍

* 《剑指Offer》
* 《编程珠玑》
* 《深度探索C++对象模型》
* 《Effective C++》
* 《More Effective C++》
* 《深入理解C++11》
* 《STL源码剖析》
* 《深入理解计算机系统》
* 《TCP/IP网络编程》
* 《程序员的自我修养》

## 复习刷题网站

* [leetcode](https://leetcode.com/)
* [牛客网](https://www.nowcoder.net/)
* [慕课网](https://www.imooc.com/)
* [菜鸟教程](http://www.runoob.com/)

## 面试题目经验

* [知乎 . 互联网公司最常见的面试算法题有哪些？](https://www.zhihu.com/question/24964987)
* [知乎 . 面试 C++ 程序员，什么样的问题是好问题？](https://www.zhihu.com/question/20184857)
* [cnblogs . C++面试集锦( 面试被问到的问题 )](https://www.cnblogs.com/Y1Focus/p/6707121.html)
* [cnblogs . C/C++ 笔试、面试题目大汇总](https://www.cnblogs.com/fangyukuan/archive/2010/09/18/1829871.html)
* [cnblogs . 常见C++面试题及基本知识点总结（一）](https://www.cnblogs.com/LUO77/p/5771237.html)
* [CSDN . 全面整理的C++面试题](http://blog.csdn.net/ljzcome/article/details/574158)
* [CSDN . 百度研发类面试题（C++方向）](http://blog.csdn.net/Xiongchao99/article/details/74524807?locationNum=6&fps=1)
* [CSDN . c++常见面试题30道](http://blog.csdn.net/fakine/article/details/51321544)
* [CSDN . 腾讯2016实习生面试经验（已经拿到offer)](http://blog.csdn.net/onever_say_love/article/details/51223886)
* [segmentfault . C++常见面试问题总结](https://segmentfault.com/a/1190000003745529)