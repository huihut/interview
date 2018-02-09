
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
* new和malloc的区别
* 运行时类型识别（RTTI）
* 友元类和友元函数
* struct和class的区别

## STL

## 数据结构

## 算法

### 排序

* [冒泡排序](Algorithm/BubbleSort.h)
* [冒泡排序（跳过有序的改进版）](Algorithm/BubbleSort_orderly.h)

## Problems

### Leetcode Problems

#### Array

* [1. Two Sum](Problems/LeetcodeProblems/1-two-sum.h)
* [4. Median of Two Sorted Arrays](Problems/LeetcodeProblems/4-median-of-two-sorted-arrays.h)
* [11. Container With Most Water](Problems/LeetcodeProblems/11-container-with-most-water.h)
* [53. Maximum Subarray](Problems/LeetcodeProblems/53-maximum-subarray.h)
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

## 海量数据处理

* [ 海量数据处理面试题集锦](http://blog.csdn.net/v_july_v/article/details/6685962)
* [十道海量数据处理面试题与十个方法大总结](http://blog.csdn.net/v_JULY_v/article/details/6279498)

## 其他

----

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