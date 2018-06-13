[STL 详细文档](https://github.com/huihut/interview/blob/master/STL/STL.md)

# 容器（containers）

## array

array 是固定大小的顺序容器，它们保存了一个以严格的线性顺序排列的特定数量的元素。

方法|含义
---|---
begin|返回指向数组容器中第一个元素的迭代器
end|返回指向数组容器中最后一个元素之后的理论元素的迭代器
rbegin|返回指向数组容器中最后一个元素的反向迭代器
rend|返回一个反向迭代器，指向数组中第一个元素之前的理论元素
cbegin|返回指向数组容器中第一个元素的常量迭代器（const_iterator）
cend|返回指向数组容器中最后一个元素之后的理论元素的常量迭代器（const_iterator）
crbegin|返回指向数组容器中最后一个元素的常量反向迭代器（const_reverse_iterator）
crend|返回指向数组中第一个元素之前的理论元素的常量反向迭代器（const_reverse_iterator）
size|返回数组容器中元素的数量
max_size|返回数组容器可容纳的最大元素数
empty|返回一个布尔值，指示数组容器是否为空
operator[]|返回容器中第 n 个位置的元素的引用
at|返回容器中第 n 个位置的元素的引用
front|返回对容器中第一个元素的引用
back|返回对容器中最后一个元素的引用
data|返回指向容器中第一个元素的指针
fill|用 val（参数）填充数组所有元素
swap|通过 x（参数）的内容交换数组的内容
get（array）|形如 `std::get<0>(myarray)`；传入一个数组容器，返回指定位置元素的引用
relational operators (array)|形如 `arrayA > arrayB`；依此比较数组每个元素的大小关系

## vector

vector 是表示可以改变大小的数组的序列容器。

方法|含义
---|---
vector|构造函数
~vector|析构函数，销毁容器对象
operator=|将新内容分配给容器，替换其当前内容，并相应地修改其大小
begin|返回指向容器中第一个元素的迭代器
end|返回指向容器中最后一个元素之后的理论元素的迭代器
rbegin|返回指向容器中最后一个元素的反向迭代器
rend|返回一个反向迭代器，指向中第一个元素之前的理论元素
cbegin|返回指向容器中第一个元素的常量迭代器（const_iterator）
cend|返回指向容器中最后一个元素之后的理论元素的常量迭代器（const_iterator）
crbegin|返回指向容器中最后一个元素的常量反向迭代器（const_reverse_iterator）
crend|返回指向容器中第一个元素之前的理论元素的常量反向迭代器（const_reverse_iterator）
size|返回容器中元素的数量
max_size|返回容器可容纳的最大元素数
resize|调整容器的大小，使其包含 n（参数）个元素
capacity|返回当前为 vector 分配的存储空间（容量）的大小
empty|返回 vector 是否为空
reserve|请求 vector 容量至少足以包含 n 个元素
shrink_to_fit|要求容器减小其 capacity（容量）以适应其 size（元素数量）
operator[]|返回容器中第 n 个位置的元素的引用
at|返回中第 n 个位置的元素的引用
front|返回对容器中第一个元素的引用
back|返回对容器中最后一个元素的引用
data|返回指向容器中第一个元素的指针
assign|将新内容分配给 vector，替换其当前内容，并相应地修改其 size
push_back|在容器的最后一个元素之后添加一个新元素
pop_back|删除容器中的最后一个元素，有效地将容器 size 减少一个
insert|通过在指定位置的元素之前插入新元素来扩展该容器，通过插入元素的数量有效地增加容器大小
erase|从 vector 中删除单个元素（`position`）或一系列元素（`[first，last)`），这有效地减少了被去除的元素的数量，从而破坏了容器的大小
swap|通过 x（参数）的内容交换容器的内容，x 是另一个类型相同、size 可能不同的 vector 对象
clear|从 vector 中删除所有的元素（被销毁），留下 size 为 0 的容器
emplace|通过在 position（参数）位置处插入新元素 args（参数）来扩展容器
emplace_back|在 vector 的末尾插入一个新的元素，紧跟在当前的最后一个元素之后
get_allocator|返回与vector关联的构造器对象的副本
swap(vector)|容器 x（参数）的内容与容器 y（参数）的内容交换。两个容器对象都必须是相同的类型（相同的模板参数），尽管大小可能不同
relational operators (vector)|形如 `vectorA > vectorB`；依此比较每个元素的大小关系

## deque

deque（['dek]）（双端队列）是double-ended queue 的一个不规则缩写。deque是具有动态大小的序列容器，可以在两端（前端或后端）扩展或收缩。

方法|含义
---|---
deque|构造函数
push_back|在当前的最后一个元素之后 ，在 deque 容器的末尾添加一个新元素
push_front|在 deque 容器的开始位置插入一个新的元素，位于当前的第一个元素之前
pop_back|删除 deque 容器中的最后一个元素，有效地将容器大小减少一个
pop_front|删除 deque 容器中的第一个元素，有效地减小其大小
emplace_front|在 deque 的开头插入一个新的元素，就在其当前的第一个元素之前
emplace_back|在 deque 的末尾插入一个新的元素，紧跟在当前的最后一个元素之后

## forward\_list

forward_list（单向链表）是序列容器，允许在序列中的任何地方进行恒定的时间插入和擦除操作。

方法|含义
---|---
forward\_list|返回指向容器中第一个元素之前的位置的迭代器
cbefore\_begin|返回指向容器中第一个元素之前的位置的 const_iterator

## list

list，双向链表，是序列容器，允许在序列中的任何地方进行常数时间插入和擦除操作，并在两个方向上进行迭代。

## stack

stack 是一种容器适配器，用于在LIFO（后进先出）的操作，其中元素仅从容器的一端插入和提取。

## queue

queue 是一种容器适配器，用于在FIFO（先入先出）的操作，其中元素插入到容器的一端并从另一端提取。

## priority_queue

## set

set 是按照特定顺序存储唯一元素的容器。

## multiset

## map

map 是关联容器，按照特定顺序存储由 key value (键值) 和 mapped value (映射值) 组合形成的元素。

方法|含义
---|---
map|构造函数
begin|返回引用容器中第一个元素的迭代器
key_comp|返回容器用于比较键的比较对象的副本
value_comp|返回可用于比较两个元素的比较对象，以获取第一个元素的键是否在第二个元素之前
find|在容器中搜索具有等于 k（参数）的键的元素，如果找到则返回一个迭代器，否则返回 map::end 的迭代器
count|在容器中搜索具有等于 k（参数）的键的元素，并返回匹配的数量
lower_bound|返回一个非递减序列 `[first, last)`（参数）中的第一个大于等于值 val（参数）的位置的迭代器
upper_bound|返回一个非递减序列 `[first, last)`（参数）中第一个大于 val（参数）的位置的迭代器
equal_range|获取相同元素的范围，返回包含容器中所有具有与 k（参数）等价的键的元素的范围边界（`pair< map<char,int>::iterator, map<char,int>::iterator >`）

## multimap

## unordered\_set

## unordered\_multiset

## unordered\_map

## unordered\_multimap

## tuple

元组是一个能够容纳元素集合的对象。每个元素可以是不同的类型。

## pair

这个类把一对值（values）结合在一起，这些值可能是不同的类型（T1 和 T2）。每个值可以被公有的成员变量first、second访问。

# 算法（algorithms）

方法|含义
---|---
all_of|返回容器范围 `[first,last)`（参数，迭代器（下同））内的所有元素是否都满足 pred（参数，如 `[](int i){return i%2;}`（下同））条件的布尔值
any_of|返回容器范围 `[first,last)`（参数）内的任何元素是否存在满足 pred（参数）条件的布尔值
none_of|返回容器范围 `[first,last)`（参数）内的所以元素是否都不满足 pred（参数）条件的布尔值
for_each|对于容器范围 `[first,last)`（参数）内的所以元素都调用 fn（参数，一元函数的指针或函数对象）
find|返回容器范围 `[first,last)`（参数）第一个等于 val（参数）的迭代器。如果没有找到这样的元素则返回 last（参数）
find_if|返回容器范围 `[first,last)`（参数）内的第一个 pred（参数，一元布尔函数指针）为 true 的迭代器
find_if_not|返回容器范围 `[first,last)`（参数）内的第一个 pred（参数，一元布尔函数指针）为 false 的迭代器
find_end|返回容器范围 `[first1,last1)`（参数）内的最后一个完全匹配 `[first2,last2)`（参数）的 `first2`（参数）的迭代器，无法找到则返回 `last1`（参数）
count|返回容器范围 `[first1,last1)`（参数）内等于 val（参数）的元素个数
equal|返回容器范围 `[first1,last1)`（参数）与 `first2`开始的容器是否全部元素相等的布尔值
search|返回容器范围 `[first1,last1)`（参数）内的第一个完全匹配 `[first2,last2)`（参数）的 `first2`（参数）的迭代器，无法找到则返回 `last1`（参数）
copy|将范围 `[first1,last1)`（参数）内的元素复制到从 `result`（参数）迭代器开始的容器，返回 `result`（参数）指向的容器的范围 `[first1,last1)`（参数）的末尾
move|将范围 `[first1,last1)`（参数）内的元素移动到从 `result`（参数）迭代器开始的容器，返回 `result`（参数）指向的容器的范围 `[first1,last1)`（参数）的末尾
swap|交换 `a`、`b`（参数）两个对象的值