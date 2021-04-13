<div align="center">
📖 Github
&emsp;&emsp; | &emsp;&emsp;
<a href="https://interview.huihut.com">📚 Docsify</a>
</div> 
<br>

<div align="center">
<a href="https://github.com/huihut/interview/">简体中文</a>
&emsp;&emsp; | &emsp;&emsp;
English
</div> 
<br>
	
<b><details><summary>💡 ON</summary></b>	


📚 This repository is a summary of the basic knowledge of recruiting job seekers and beginners in the direction of C / C ++ technology, including language, program library, data structure, algorithm, system, network, link loading library and other knowledge and interview experience, recruitment, internal push, etc. information.


💡 Side directory support methods:[📚 Docsify Doc](https://interview.huihut.com)、[Github + TOC navigation](https://github.com/jawil/GayHub)（[TOC preview.png](https://raw.githubusercontent.com/huihut/interview/master/images/TOC预览.png)）

📄 Save as PDF: Use the Chrome browser to open the <a href="https://interview.huihut.com"> 📚 Docsify document </a> page, shrink the left directory-right click-print-select the target printer is Save as PDF-Save ( [Print Preview.png](https://raw.githubusercontent.com/huihut/interview/master/images/PrintPreview.png) )

🙏 If there are any errors or improvements in the contents of the warehouse, issues or pr are welcome. Suggestions or discussions can be submitted at [# 12](https://github.com/huihut/interview/issues/12). Due to my limited level, the knowledge points in the warehouse are from my original, reading notes, books, blog posts, etc. Non-original has been marked with the source, if there is any omission, please issue an issue. This warehouse follows the [CC BY-NC-SA 4.0](https://github.com/huihut/interview/blob/master/LICENSE) agreement, please indicate the source for the reprint, and may not be used for commercial purposes.

</details>


## 📑 Table of contents


* [➕ C/C++](#cc)
* [⭐️ Effective](#effective)
* [📦 STL](#stl)
* [〽️ Data Structure](#data-structure)
* [⚡️ Algorithm](#algorithm)
* [❓ Problems](#problems)
* [💻 OS](#os)
* [☁️ Computer Network](#computer-network)
* [🌩 Network Programming](#network-programming)
* [💾 Database](#database)
* [📏 Design Pattern](#design-pattern)
* [⚙️ Link Loading Library](#link-loading-library)
* [📚 Books](#books)
* [🔱 C/C++ development direction](#cc-development-direction)
* [💯 Review of Brush Questions Website](#review-of-brush-questions-website)
* [📝 Interview Questions Experience](#interview-questions-experience)
* [📆 Recruitment time post](#recruitment-time-post)
* [👍 Recommend](#recommend)
* [👬 Contributor](#contributor)
* [🍭 Support Sponsor](#support-sponsor)
* [📜 License](#license)


<a id="cc"></a>

## ➕ C/C++

### const

#### Function

1. Modify the variable, indicating that the variable cannot be changed;
2. Modified pointers, divided into pointers to const (pointer to const) and pointers that are constants themselves (const pointer, const pointer);
3. Modified references, references to constants (reference to const), are used for formal parameter types, which avoids copying and function modification of values;
4. Decorate a member function, stating that member variables cannot be modified within the member function.

#### const Pointers and references

* Pointer
     * Pointer to const
     * A pointer to a constant itself (const pointer)
* Reference
     * Reference to const
     * There is no const reference because the reference is an alias of an object, the reference is not an object

> (Think of it for convenience) The value modified by const (after const) cannot be changed, such as `p2`, `p3` in the usage example below


#### use

const use

```cpp
// class
class A
{
private:
    const int a;                // constant object member, can use initialization list or in-class initializer

public:
    // Constructor
    A() : a(0) { };
    A(int x) : a(x) { };        //  initialize list

    //  const can be used to distinguish between overloaded functions
    int getValue();             //  ordinary member function
    int getValue() const;       // constant member function, must not modify the value of any data member in the class
};

void function()
{
    // object
    A b;                        // ordinary object, can call all member functions
    const A a;                  // constant object, can only call constant member functions
    const A *p = &a;            // pointer variable, point to a constant object
    const A &q = a;             // reference to constant object

    // pointer
    char greeting[] = "Hello";
    char* p1 = greeting;                // pointer variable, pointing to a character array variable
    const char* p2 = greeting;          // pointer variable, pointing to a character array constant (char followed by const, indicating that the character pointed to (char) cannot be changed)
    char* const p3 = greeting;          // itself is a constant pointer to a character array variable (const followed by p3, indicating that the p3 pointer itself cannot be changed)
    const char* const p4 = greeting;    // a pointer to a constant itself, pointing to a character array constant
}

// function
void function1(const int Var);           // the passed parameters are immutable within the function
void function2(const char* Var);         // The content pointed to by the parameter pointer is constant
void function3(char* const Var);         // parameter pointer is constant
void function4(const int& Var);          // the reference parameter is constant inside the function

// function return value
const int function5();      // returns a constant
const int* function6();     // returns a pointer variable to a constant, use: const int * p = function6 ();
int* const function7();     // returns a constant pointer to a variable, use: int * const p = function7 ();
```

### static

#### Function

1. Modify ordinary variables, modify the storage area and life cycle of the variables, make the variables stored in the static area, allocate space before the `main` function runs, if there is an initial value, initialize it with the initial value, if there is no initial value, the system uses the default Value to initialize it.
2. Modify ordinary functions to indicate the scope of the function, which can only be used in the file where the function is defined. When developing a project with multiple people, in order to prevent duplicate names from functions in other people's namespaces, you can position functions as static.
3. Decorate member variables. Decorate member variables so that all objects hold only one of the variable, and you can access the member without generating an object.
4. Decorate member functions. Decorate member functions so that they can be accessed without generating objects, but non-static members cannot be accessed within static functions.

### this pointer

1. `this` pointer is a special pointer hidden in every non-static member function. It points to the object that called the member function.
2. When calling a member function on an object, the compiler first assigns the address of the object to the `this` pointer, and then calls the member function. Each time the member function accesses a data member, the `this` pointer is implicitly used.
3. When a member function is called, it is automatically passed an implicit parameter, which is a pointer to the object where the member function is located.
4. The `this` pointer is implicitly declared as: `ClassName * const this`, which means that the `this` pointer cannot be assigned; in the `const` member function of the `ClassName` class, the type of the `this` pointer For: `const ClassName * const`, this means that the object pointed to by the `this` pointer cannot be modified (that is, the data members of such objects cannot be assigned);
5. `this` is not a regular variable, but an rvalue, so you cannot get the address of `this` (you can't `& this`).
6. It is often necessary to explicitly reference the `this` pointer in the following scenarios:
    1. To implement a chained reference to an object;
    2. To avoid performing assignments on the same object;
    3. When implementing some data structures, such as `list`.

### inline function

#### Features

* Equivalent to writing the contents of the inline function at the call of the inline function;
* It is equivalent to directly execute the function body without executing the steps of entering the function;
* Equivalent to a macro, but with more type checking than a macro, it really has function characteristics;
* The compiler generally does not inline inline functions that include complex operations such as loops, recursion, and switch;
* Functions defined in class declarations, other than virtual functions, are automatically implicitly treated as inline functions.

#### use

inline use

```cpp
// Statement 1 (plus inline, recommended)
inline int functionName(int first, int second,...);

// statement 2 (without inline)
int functionName(int first, int second,...);

// definition
inline int functionName(int first, int second,...) {/****/};

// inside class definition, implicitly inline
class A {
    int doA() { return 0; }         // implicit inlining
}

// definition outside the class, need to be explicitly inlined
class A {
    int doA();
}
inline int A::doA() { return 0; }   // requires explicit inlining
```

#### Compiler processing steps for inline functions

1. Copy the inline function body to the `inline` function call point;
2. Allocate memory space for local variables in the used `inline` function;
3. Map the input parameters and return values of the `inline` function to the local variable space of the calling method;
4. If the `inline` function has multiple return points, turn it into a branch at the end of the inline function code block (using `GOTO`).

#### Advantages and disadvantages

Advantages

1. Inline functions, like macro functions, perform code expansion at the callee's place, eliminating the need to push parameters on the stack, open and recover stack frames, and return results, etc., thereby improving program execution speed.
2. Compared to macro functions, inline functions do security checks or automatic type conversions (as with normal functions) when code is expanded, while macro definitions do not.
3. Declaring a member function that is also defined in a class automatically converts it into an inline function, so inline functions can access class member variables, while macro definitions cannot.
4. Inline functions are debuggable at runtime, while macro definitions are not.

Disadvantages

1. Code bloat. Inlining is at the expense of code bloat (copy), eliminating the overhead of function calls. If the time to execute the code in the function body is greater than the cost of the function call, then the efficiency gain will be small. On the other hand, copying the code for each inline function call will increase the total code size of the program and consume more memory space.
2. The inline function cannot be upgraded with the function library upgrade. Changes to the inline function require recompilation, unlike non-inline, which can be linked directly.
3. Whether it is inline or not is beyond the programmer's control. Inline functions are just suggestions to the compiler. The decision whether to inline functions is up to the compiler.

#### Can a virtual function be an inline function?

> [Are "inline virtual" member functions ever actually "inlined"?](Http://www.cs.technion.ac.il/users/yechiel/c++-faq/inline-virtuals.html)

* A virtual function can be an inline function. Inline can modify a virtual function, but it cannot be inlined when the virtual function exhibits polymorphism.
* Inlining is recommended by the compiler, and the polymorphism of virtual functions is at runtime. The compiler cannot know which code is called at runtime, so virtual functions cannot be inlined at runtime (runtime). .
* `inline virtual` The only time it can be inlined is: the compiler knows which class the object is called (such as `Base::who()` ), only if the compiler has an actual object instead of a pointer or reference to the object Will happen.

Virtual function inline use

```cpp
#include <iostream>  
using namespace std;
class Base
{
public:
	inline virtual void who()
	{
		cout << "I am Base\n";
	}
	virtual ~Base() {}
};
class Derived : public Base
{
public:
	inline void who()  // Implicit inlining when not writing inline
	{
		cout << "I am Derived\n";
	}
};

int main()
{
	// The virtual function who () here is called through the concrete object (b) of the class (Base), which can be determined during compilation, so it can be inlined, but whether it is inlined depends on the compilation Device.
	Base b;
	b.who();

	// The virtual function here is called through a pointer, which is polymorphic and needs to be determined during runtime, so it cannot be inlined.
	Base *ptr = new Derived();
	ptr->who();

	// Because Base has a virtual destructor (virtual ~ Base () {}), when deleting, the Derived destructor is called first, and then the Base destructor is called to prevent memory leaks.
	delete ptr;
	ptr = nullptr;

	system("pause");
	return 0;
} 
```

### volatile

```cpp
volatile int i = 10; 
```

* The volatile keyword is a type modifier, and the type variable declared with it indicates that it can be changed by some factors unknown to the compiler (operating system, hardware, other threads, etc.). So using volatile tells the compiler that such objects should not be optimized.
* Variables declared by the volatile keyword must be fetched from memory each time they are accessed (variables that are not modified by volatile may be fetched from CPU registers due to compiler optimizations)
* const can be volatile (such as a read-only status register)
* Pointer can be volatile

### assert()

Assertions are macros, not functions. The prototype of the assert macro is defined in `<assert.h>` (C), `<cassert>` (C ++), and its role is to terminate program execution if its condition returns an error. You can turn off assert by defining `NDEBUG`, but it needs to be at the beginning of the source code, before `include <assert.h>` .

assert () uses

```cpp
#define NDEBUG          // Add this line, assert is not available
#include <assert.h>

assert( p != NULL );    // assert is not available
```

### sizeof()

* sizeof For arrays - get the size of the entire array.
* sizeof For pointers - get the size of the space occupied by the pointer itself.

### #pragma pack(n)

Set structure, union, and class member variables to be n-byte aligned

#pragma pack (n) use

```cpp
#pragma pack(push)  // save alignment state
#pragma pack(4)     // Set to 4 byte alignment

struct test
{
    char m1;
    double m4;
    int m3;
};

#pragma pack(pop)   // Restore alignment
```

### Bit field

```cpp
Bit mode: 2;    // mode is 2 digits
```

A class can define its (non-static) data members as bit-fields, which contain a certain number of binary bits in a bit-field. When a program needs to transfer binary data to other programs or hardware devices, the bit field is usually used.

* The layout of the bit field in memory is machine-dependent
* The type of the bit field must be an integer or enumerated type. The behavior of the bit field in a signed type will depend on the implementation.
* The fetch operator (&) cannot be applied to the bit field, and no pointer can point to the bit field of the class

### extern "C"

* Extern-qualified functions or variables are of type extern
* Variables and functions decorated with `extern" C "` are compiled and linked in C

The function of `extern" C "` is to let the C ++ compiler treat the code declared by `extern" C "` as C language code, which can avoid the problem that the code cannot be linked with the symbols in the C language library due to symbol modification. .

extern "C" demo

```cpp
#ifdef __cplusplus
extern "C" {
#endif

void *memset(void *, int, size_t);

#ifdef __cplusplus
}
#endif
```

### struct with typedef struct

####  In C

```c
// c
typedef struct Student {
    int age; 
} S;
```

Equivalent to

```c
// c
struct Student { 
    int age; 
};

typedef struct Student S;
```

At this time `S` is equivalent to` struct Student`, but the two identifier namespaces are different.

You can also define `void Student(){}` that does not conflict with `struct Student` .

#### In C++

Because the compiler's rules for positioning symbols (search rules) have changed, it is different from the C language.

First, if `struct Student {...};` is defined in the class identifier space, when `Student me;` is used, the compiler will search the global identifier table. If `Student` is not found, it will be in the class identifier. search for.

That means it can use `Student` or `struct Student`, as follows:

```cpp
// cpp
struct Student { 
    int age; 
};

void f( Student me );       // correct, the "struct" keyword can be omitted
```

If a function with the same name as `Student` is defined, `Student` only represents the function, not the structure, as follows:

```cpp
typedef struct Student { 
    int age; 
} S;

void Student() {}           //Correct, "Student" only represents this function after definition

//void S() {}               // Error, symbol "S" has been defined as an alias for "struct Student"

int main() {
    Student(); 
    struct Student me;      // Or "S me";
    return 0;
}
```

### struct and class in C ++

In general, struct is more suitable as an implementation of a data structure, and class is more suitable as an implementation of an object.

#### The difference

* The most essential difference is the default access control
     1. Default inherited access rights. struct is public and class is private.
     2. struct as the data structure implementation body, its default data access control is public, and class as the object implementation body, its default member variable access control is private.

### union union

Union is a special class that saves space. A union can have multiple data members, but only one data member can have a value at any time. When a member is assigned, other members become undefined. Union has the following characteristics:

* The default access control character is public
* May contain constructors and destructors
* Cannot contain members of reference type
* Cannot inherit from other classes and cannot be used as a base class
* Cannot contain virtual functions
* Anonymous union can directly access union members in the scope where it is defined
* Anonymous union cannot contain protected members or private members
* Global anonymous union must be static

union demo

```cpp
#include<iostream>

union UnionTest {
    UnionTest() : i(10) {};
    int i;
    double d;
};

static union {
    int i;
    double d;
};

int main() {
    UnionTest u;

    union {
        int i;
        double d;
    };

    std::cout << u.i << std::endl;  // Output UnionTest union 10

    ::i = 20;
    std::cout << ::i << std::endl;  // Output global static anonymous union 20

    i = 30;
    std::cout << i << std::endl;    // Output of locally anonymous union of 30

    return 0;
}
```

### C implements C ++ classes

C implements object-oriented features of C ++ (encapsulation, inheritance, polymorphism)

* Encapsulation: Use function pointers to encapsulate properties and methods into structures
* Inheritance: structure nesting
* Polymorphism: function pointers of parent and child methods are different

> [Can you write object-oriented code in C? [closed]](https://stackoverflow.com/a/351745)

### explicit (keyword)

* explicit constructor modification prevents implicit conversion and copy initialization
* explicit conversions can prevent implicit conversions, except [conversion by context](https://en.cppreference.com/w/cpp/language/implicit_conversion)

explicit demo
```cpp
struct A
{
	A(int) { }
	operator bool() const { return true; }
};

struct B
{
	explicit B(int) {}
	explicit operator bool() const { return true; }
};

void doA(A a) {}

void doB(B b) {}

int main()
{
	A a1(1);		// OK：direct initialization
	A a2 = 1;		// OK：copy initialization
	A a3{ 1 };		// OK：direct list initialization
	A a4 = { 1 };		// OK：copy list initialization
	A a5 = (A)1;		// OK：Allow explicit conversion of static_cast
	doA(1);			// OK：Allow implicit conversion from int to A
	if (a1);		// OK: implicit conversion from A to bool using conversion function A ::operator bool()
	bool a6(a1);		// OK: implicit conversion from A to bool using conversion function A::operator bool()
	bool a7 = a1;		// OK: implicit conversion from A to bool using conversion function A::operator bool()
	bool a8 = static_cast<bool>(a1);  // OK: static_cast for direct initialization

	B b1(1);		// OK：direct initialization
	B b2 = 1;		// Error: Object modified by explicit constructor cannot be initialized by copying
	B b3{ 1 };		// OK：direct list initialization
	B b4 = { 1 };		// Error: Object modified by explicit constructor cannot copy list initialization
	B b5 = (B)1;		// OK: Allow explicit conversion of static_cast
	doB(1);			// Error: Objects whose constructor is explicitly modified cannot be implicitly converted from int to B
	if (b1);		// OK: objects modified by explicit conversion function B::operator bool() can be converted from B to bool by context
	bool b6(b1);		// OK: Explicitly modified conversion function B::operator The object of bool() can be converted from B to bool by context
	bool b7 = b1;		// Error: Objects modified by explicit conversion function B :: operator bool () cannot be implicitly converted
	bool b8 = static_cast<bool>(b1);  // OK: static_cast performs direct initialization

	return 0;
}
```

### friend - friend class and friend function

* Access to private members
* Destruction of encapsulation
* Friendship is not transitive
* One-way friendship
* There are no restrictions on the form and number of friend declarations

### using

#### using statement

A `using declaration` introduces only one member of a namespace at a time. It allows us to know exactly which name is referenced in the program. Such as:

```cpp
using namespace_name :: name;
```

#### Using declaration of constructor

In C ++ 11, a derived class can reuse the constructor defined by its direct base class.

```cpp
class Derived : Base {
public:
    using Base::Base;
    /* ... */
};
```

As above using statement, for each constructor of the base class, the compiler generates a derived class constructor corresponding to it (the parameter list is exactly the same). Generates the following type constructor:

```cpp
Derived (parms): Base (args) {}
```

#### using instructions

The `using directive` makes all names in a particular namespace visible, so we don't need to add any prefix qualifiers to them. Such as:

```cpp
using namespace_name name;
```

#### Minimize `using directives` to pollute namespaces

> Generally speaking, it is safer to use the using command than the using compile command, because it** imports only the specified name**. If the name conflicts with a local name, the compiler will** issue instructions**. The using compile command imports all names, including names that may not be needed. If there is a conflict with a local name, the local name will override the namespace version, and the compiler will not issue a warning. In addition, the openness of the namespace means that the names of the namespace may be scattered in multiple places, which makes it difficult to know exactly which names have been added.

using demo

Minimize `using directives`

```cpp
using namespace std;
```

You should use `using declarations` more often

```cpp
int x;
std::cin >> x ;
std::cout << x << std::endl;
```

or

```cpp
using std::cin;
using std::cout;
using std::endl;
int x;
cin >> x;
cout << x << endl;
```

### :: scope resolution operator

#### classification

1. Global scope (`:: name`): used before type names (classes, class members, member functions, variables, etc.) to indicate that the scope is a global namespace
2. Class scope character (`class :: name`): used to indicate that the scope of the specified type is specific to a class
3. Namespace scope (`namespace :: name`): used to indicate that the scope of the specified type is specific to a namespace

:: demo

```cpp
int count = 11;         // Global (: :) count

class A {
public:
	static int count;   // Count (A::count) of class A
};
int A::count = 21;

void fun()
{
	int count = 31;     // Initialize the local count to 31
	count = 32;         // Set the local count to 32
}

int main() {
	::count = 12;       // Test 1: Set the global count to 12

	A::count = 22;      // Test 2: Set the count of class A to 22

	fun();		        // Test 3

	return 0;
}
```

### enum - enum type

#### Scoped Enumeration Type

```cpp
enum class open_modes { input, output, append };
```

#### Unscoped enumeration type

```cpp
enum color { red, yellow, green };
enum { floatPrec = 6, doublePrec = 10 };
```

### decltype

decltype keyword is used to check the declared type or expression type and value classification of an entity. grammar:

```cpp
decltype ( expression )
```

decltype demo

```cpp
// Tail return allows us to declare the return type after the parameter list
template <typename It>
auto fcn(It beg, It end) -> decltype(*beg)
{
    / process the sequence
    return *beg;     // return a reference to an element in the sequence
}
// In order to use template parameter members, you must use typename
template <typename It>
auto fcn2(It beg, It end) -> typename remove_reference<decltype(*beg)>::type
{
    // process the sequence
    return * beg; // return a copy of an element in the sequence
}
```

### reference

#### lvalue reference

Regular reference, which generally represents the identity of the object.

#### rvalue reference

An rvalue reference is a reference that must be bound to an rvalue (a temporary object, an object to be destroyed) and generally represents the value of the object.

An rvalue reference implements Move Sementics and Perfect Forwarding. Its main purpose is twofold:

* Eliminate unnecessary copying of objects when two objects interact, saving computing storage resources and improving efficiency.
* Ability to define generic functions more concisely.

#### Reference Collapse

* `X & &`, `X & &&`, `X && &` can be folded into `X &`
* `X && &&` can be folded into `X &&`

### Macro

* A macro definition can implement a function similar to a function, but it is not a function after all, and the "parameters" in the brackets in the macro definition are not real parameters. The "parameters" are replaced one-to-one when the macro is expanded .

### Member initialization list

benefit

* More efficient: There is no need to call the default constructor once.
* In some cases it is necessary to use the initialization list:
   1. Constant members, because constants can only be initialized and cannot be assigned, so they must be placed in the initialization list
   2. Reference types. References must be initialized at the time of definition and cannot be reassigned, so they must also be written in the initialization list.
   3. There is no class type for the default constructor, because the initialization list can be used to initialize without having to call the default constructor.

### initializer_list list initialization

Initialize an object with a curly brace initializer list, where the corresponding constructor accepts a `std :: initializer_list` parameter.

initializer_list uses

```cpp
#include <iostream>
#include <vector>
#include <initializer_list>
 
template <class T>
struct S {
    std::vector<T> v;
    S(std::initializer_list<T> l) : v(l) {
         std::cout << "constructed with a " << l.size() << "-element list\n";
    }
    void append(std::initializer_list<T> l) {
        v.insert(v.end(), l.begin(), l.end());
    }
    std::pair<const T*, std::size_t> c_arr() const {
        return {&v[0], v.size()};  // Copy the list initialization in the return statement
                                   // this does not use std :: initializer_list
    }
};
 
template <typename T>
void templated_fn(T) {}
 
int main()
{
    S<int> s = {1, 2, 3, 4, 5}; // copy initialization
    s.append({6, 7, 8});      // list initialization in function call
 
    std::cout << "The vector size is now " << s.c_arr().second << " ints:\n";
 
    for (auto n : s.v)
        std::cout << n << ' ';
    std::cout << '\n';
 
    std::cout << "Range-for over brace-init-list: \n";
 
    for (int x : {-1, -2, -3}) // auto rules make this band for work
        std::cout << x << ' ';
    std::cout << '\n';
 
    auto al = {10, 11, 12};   // special rules for auto
 
    std::cout << "The list bound to auto has size() = " << al.size() << '\n';
 
//    templated_fn({1, 2, 3}); // Compile error! "{1, 2, 3}" is not an expression,
                              // it has no type, so T cannot infer
    templated_fn<std::initializer_list<int>>({1, 2, 3}); // OK
    templated_fn<std::vector<int>>({1, 2, 3});           // also OK
}
```

### Object-oriented

Object-oriented programming (OOP) is a model of program programming with object concepts, and it is also an abstract approach to program development.

![Object-oriented features](https://raw.githubusercontent.com/huihut/interview/master/images/面向对象基本特征.png)

Three Object-Oriented Features-Encapsulation, Inheritance, and Polymorphism

### Encapsulation

Encapsulate objective things into abstract classes, and classes can only use their own data and methods for trusted classes or objects to operate, and hide untrusted information. Keywords: public, protected, private. Do not write defaults to private.

* `public` members: can be accessed by any entity
* `protected` members: only allowed to be accessed by subclasses and member functions of this class
* `private` members: only accessible by member functions, friend classes, or friend functions of this class

###  Inheritance

*  Base class (parent class) ——&gt; derived class (subclass)

### Polymorphism

* Polymorphism, that is, multiple states (morphology). In simple terms, we can define polymorphism as the ability of a message to be displayed in multiple forms.
* Polymorphism is based on encapsulation and inheritance.
* C polymorphism classification and implementation:
     1. Ad-hoc Polymorphism (compile-time): function overload, operator overload
     2. Subtype Polymorphism (runtime): virtual function
     3. Parametric Polymorphism (compile-time): class template, function template
     4. Coercion Polymorphism (compilation / runtime): basic type conversion, custom type conversion

> [The Four Polymorphisms in C++](https://catonmat.net/cpp-polymorphism)

#### Static polymorphism (compile time / early binding)

Function overloading

```cpp
class A
{
public:
    void do(int a);
    void do(int a, int b);
};
```

#### Dynamic polymorphism (runtime / late binding)

* Virtual functions: decorate member functions with virtual to make them virtual
* Dynamic binding: dynamic binding occurs when a virtual function is called using a reference or pointer to a base class

**note:**

* You can assign an object of a derived class to a pointer or reference of the base class, and not vice versa
* Ordinary functions (non-class member functions) cannot be virtual functions
* Static functions (static) cannot be virtual functions
* The constructor cannot be a virtual function (because when the constructor is called, the virtual table pointer is not in the object's memory space, the virtual table pointer must be formed after the constructor is called)
* An inline function cannot be a virtual function when it shows polymorphism. For an explanation, see: [Can a virtual function be an inline function? ](https://github.com/huihut/interview#%E8%99%9A%E5%87%BD%E6%95%B0virtual%E5%8F%AF%E4%BB%A5%E6%98%AF%E5%86%85%E8%81%94%E5%87%BD%E6%95%B0inline%E5%90%97)

Dynamic polymorphic demo

```cpp
class Shape                     // shape class
{
public:
    virtual double calcArea()
    {
        ...
    }
    virtual ~Shape();
};
class Circle : public Shape     // circle class
{
public:
    virtual double calcArea();
    ...
};
class Rect : public Shape       // rectangle class
{
public:
    virtual double calcArea();
    ...
};
int main()
{
    Shape * shape1 = new Circle(4.0);
    Shape * shape2 = new Rect(5.0, 6.0);
    shape1->calcArea();         // call the method in the circular class
    shape2->calcArea();         // call the method in the rectangle class
    delete shape1;
    shape1 = nullptr;
    delete shape2;
    shape2 = nullptr;
    return 0;
}
```

### Virtual destructor

The virtual destructor is to resolve the pointer of the base class to the derived class object, and delete the derived class object with the pointer of the base class.

Virtual destructor demo

```cpp
class Shape
{
public:
    Shape();                    // Constructor cannot be virtual
    virtual double calcArea();
    virtual ~Shape();           // virtual destructor
};
class Circle : public Shape     // circle class
{
public:
    virtual double calcArea();
    ...
};
int main()
{
    Shape * shape1 = new Circle(4.0);
    shape1->calcArea();    
    delete shape1;  // Because Shape has a virtual destructor, when delete deletes the memory, it first calls the subclass destructor and then the base class destructor to prevent memory leaks.
    shape1 = NULL;
    return 0；
}
```

### Pure virtual functions

A pure virtual function is a special kind of virtual function. You cannot give a meaningful implementation to a virtual function in a base class. Instead, you declare it as a pure virtual function. Its implementation is left to the derived classes of the base class.

```cpp
virtual int A() = 0;
```

### Virtual functions, pure virtual functions

* If a virtual function is declared in the class, this function is implemented, even if it is empty, its role is to allow this function to be overridden in its subclasses, so that the compiler can use Late binding to achieve polymorphism. A pure virtual function is just an interface. It is a function declaration. It must be left in a subclass to implement it.
* Virtual functions can not be overridden in subclasses; but pure virtual functions must be implemented in subclasses to instantiate subclasses.
* The virtual function class is used for "implementation inheritance". Inheriting the interface also inherits the implementation of the parent class. Pure virtual functions focus on the uniformity of the interface, and the implementation is done by subclasses.
* A class with a pure virtual function is called an abstract class. This class cannot directly generate objects. It can only be used after being inherited and rewriting its virtual function. After an abstract class is inherited, subclasses can continue to be abstract or ordinary classes.
* Virtual base class is the base class in virtual inheritance, see below for details.

> [CSDN . C++ And connection of virtual functions and pure virtual functions](https://blog.csdn.net/u012260238/article/details/53610462)

### Virtual function pointer, virtual function table

* Virtual function pointer: In an object containing a virtual function class, it points to a virtual function table, which is determined at runtime.
* Virtual function table: in the program read-only data section (`.rodata section`, see: [object file storage structure](#%E7%9B%AE%E6%A0%87%E6%96%87%E4%BB%B6%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84)），Stores virtual function pointers. If the derived class implements a virtual function of the base class, the virtual function pointer of the original base class is overwritten in the virtual table, and is created according to the class declaration at compile time.

> [C++ Function (table) implementation mechanism and simulation implementation in C language](https://blog.twofei.com/496/)

### Virtual inheritance

Virtual inheritance is used to solve the problem of diamond inheritance under multiple inheritance conditions (wasting storage space and ambiguity).

The underlying implementation principle is related to the compiler. It is generally implemented by ** virtual base class pointer ** and ** virtual base class table **. Each virtual inherited subclass has a virtual base class pointer (occupies the storage space of a pointer) , 4 bytes) and virtual base class table (does not occupy storage space of class objects) (It should be emphasized that the virtual base class will still have a copy in the subclass, but there is only one copy at most, not not in the subclass. Inside); when the subclass of virtual inheritance is inherited as the parent class, the pointer of the virtual base class will also be inherited.

In fact, vbptr refers to a virtual base table pointer. This pointer points to a virtual base table. The virtual table records the offset address of the virtual base class and this class. Offset address, so that the virtual base class members are found, and virtual inheritance does not need to maintain two identical copies of the public base class (virtual base class) like ordinary multiple inheritance, saving storage space.

### Virtual inheritance, virtual functions

* Similarities: Both use virtual pointers (both occupy class storage space) and virtual tables (both do not occupy class storage space)
* the difference:
    * Virtual inheritance
        * The virtual base class still exists in the inherited class and only takes up storage space
        * The virtual base class table stores the offset of the virtual base class relative to the direct inherited class
    * Virtual function
        * Virtual functions do not take up storage space
        * The virtual function table stores the virtual function address

### Template classes, member templates, virtual functions

* Virtual functions can be used in template classes
* The member template of a class (whether it is a normal class or a class template) (it is a member function of the template) cannot be a virtual function

### Abstract class, interface class, aggregate class

* Abstract class: a class containing pure virtual functions
* Interface class: Abstract class containing only pure virtual functions
* Aggregation classes: Users can directly access their members and have a special form of initialization syntax. Meet the following characteristics:
    * All members are public
    * No constructor is defined
    * No in-class initialization
    * No base class, no virtual function

### Memory allocation and management

#### malloc, calloc, realloc, alloca

1. malloc: apply for a specified number of bytes of memory. The initial value in the requested memory is uncertain.
2. calloc: For an object of a specified length, allocate memory that can hold the specified number of objects. Each bit of the requested memory is initialized to 0.
3. realloc: change the previously allocated memory length (increase or decrease). When increasing the length, it may be necessary to move the contents of the previously allocated area to another sufficiently large area, while the initial value in the newly added area is uncertain.
4. alloca: apply for memory on the stack. When the program pops out of the stack, it will automatically release memory. However, it should be noted that alloca is not portable and difficult to implement on machines without traditional stacks. alloca should not be used in programs that must be widely ported. C99 supports variable-length arrays (VLAs) and can be used instead of alloca.

#### malloc, free

Used to allocate and release memory

malloc, free use

Apply for memory and confirm whether the application is successful

```cpp
char *str = (char*) malloc(100);
assert(str != nullptr);
```

Pointer is empty after freeing memory

```cpp
free(p); 
p = nullptr;
```

#### new、delete

1. new / new []: Do two things, first call malloc at the bottom to allocate memory, and then call the constructor (create the object).
2. delete / delete []: also complete two things, first call the destructor (clean up resources), and then call free to free up space at the bottom.
3. new automatically calculates the number of bytes required when applying for memory, and malloc requires us to enter the number of bytes of the requested memory space ourselves.

new, delete demo

Apply for memory and confirm whether the application is successful

```cpp
int main()
{
    T* t = new T();     // memory allocation first, then constructor
    delete t;           // destructor first, then release memory
    return 0;
}
```

#### Positioning new

Positioning new (placement new) allows us to pass additional address parameters to new to create objects in a pre-specified memory area.

```cpp
new (place_address) type
new (place_address) type (initializers)
new (place_address) type [size]
new (place_address) type [size] { braced initializer list }
```

* `place_address` is a pointer
* `initializers` provides a (possibly empty) comma-separated list of initial values

### delete this - Is it legal?

> [Is it legal (and moral) for a member function to say delete this?](https://isocpp.org/wiki/faq/freestore-mgmt#delete-this)

Legal, but:

1. It must be guaranteed that this object is allocated via `new` (not `new[]`, not placement new, not on the stack, not global, not a member of other objects)
2. You must ensure that the member function that calls delete this is the last member function that calls this
3. You must ensure that the member function does not call this after `delete this`
4. Make sure no one uses it after delete this

### How to define a class that can only generate objects on the heap (on the stack)?

> [How to define a class that can only generate objects on the heap (on the stack)?](https://www.nowcoder.com/questionTerminal/0a584aa13f804f3ea72b442a065a7618)

#### Only on the heap

Method: Make the destructor private

Reason: C ++ is a static binding language. The compiler manages the life cycle of objects on the stack. When the compiler allocates stack space for class objects, it first checks the accessibility of the class's destructor. If the destructor is not accessible, the object cannot be created on the stack.

#### Only on the stack

Method: overload new and delete as private

Reason: The object is generated on the heap using the new keyword operation. The process is divided into two stages: the first stage uses new to find available memory on the heap and allocates it to the object; the second stage calls the constructor to generate the object. By setting the new operation to private, the first phase cannot be completed, and objects cannot be generated on the heap.

### Smart pointer

#### In the C ++ Standard Library (STL)

header file：`#include <memory>`

#### C++ 98

```cpp
std::auto_ptr<std::string> ps (new std::string(str))；
```

#### C++ 11

1. shared_ptr
2. unique_ptr
3. weak_ptr
4. auto_ptr (Deprecated by C ++ 11)

* Class shared_ptr implements the concept of shared ownership. Multiple smart pointers point to the same object, and that object and its associated resources are released when the "last reference is destroyed". In order to perform the above work in more complex scenarios, the standard library provides auxiliary classes such as weak_ptr, bad_weak_ptr, and enable_shared_from_this.
* Class unique_ptr implements the concept of exclusive ownership or strict ownership, ensuring that only one smart pointer can point to the object at a time. You can transfer ownership. It is especially useful for avoiding resource leaks, such as forgetting to delete after new.

##### shared_ptr

Multiple smart pointers can share the same object, and the last one of the object has the responsibility to destroy the object and clean up all resources related to the object.

* Support custom deleter, which can prevent Cross-DLL problems (object is created by new in dynamic link library (DLL), but deleted by another DLL), and the mutex is automatically released

##### weak_ptr

weak_ptr allows you to share but does not own an object. Once the last smart pointer that owns the object loses ownership, any weak_ptr will automatically become empty. Therefore, in addition to the default and copy constructors, weak_ptr only provides a "accept a shared_ptr" constructor.

* The problem of cycles of references (two objects that have not been used actually refer to each other, making them appear to be in the "used" state)

##### unique_ptr

unique_ptr is a type that has only been available since C ++ 11, and is a smart pointer that can help avoid resource leaks during exceptions. Using exclusive ownership means that you can ensure that an object and its corresponding resource are owned by only one pointer at a time. Once you own the destroyed or programmed empty, or start owning another object, the previously owned object will be destroyed and any corresponding resources will be released.

* unique_ptr is used instead of auto_ptr

##### auto_ptr

Deprecated by c ++ 11 due to lack of language features such as `std::move` semantics "for construction and assignment", and other flaws.

##### auto_ptr compared to unique_ptr

* auto_ptr can be assigned a copy, and ownership is transferred after copying; unqiue_ptr has no copy assignment semantics, but implements `move` semantics;
* auto_ptr objects cannot manage arrays (destructive call `delete`), unique_ptr can manage arrays (destructive call` delete [] `);

### Casting Operator

> [MSDN. Casting Operator](https://msdn.microsoft.com/zh-CN/library/5f6c9f8h.aspx)

#### static_cast

* For non-polymorphic conversions
* Do not perform runtime type checking (conversion security is not as good as dynamic_cast)
* Usually used to convert numeric data types (such as float-> int)
* You can move the pointer throughout the class hierarchy. It is safe (upward conversion) for a child class to be converted to a parent class, and it is not safe to convert a parent class to a child class (because a child class may have fields or methods that are not in the parent class)

> Upcast is an implicit conversion.

#### dynamic_cast

* For polymorphic type conversions
* Perform line runtime type checking
* Only applicable to pointers or references
* Conversion of ambiguous pointers will fail (return nullptr), but no exception will be thrown
* You can move the pointer throughout the class hierarchy, including up conversion, down conversion

#### const_cast

* Used to remove const, volatile, and __unaligned features (such as converting const int to int)

#### reinterpret_cast

* Simple reinterpretation for bits
* Misuse of the reinterpret_cast operator can be very risky. Unless the required conversion itself is low-level, you should use one of the other cast operators.
* Allows conversion of any pointer to any other pointer type (such as `char *` to `int *` or `One_class *` to `Unrelated_class *`, but it is not itself safe)
* Also allows conversion of any integer type to any pointer type and reverse conversion.
* The reinterpret_cast operator cannot lose const, volatile, or __unaligned attributes.
* A practical use of reinterpret_cast is in a hash function, which is to map values to indexes by making two different values hardly end with the same index.

#### bad_cast

* The dynamic_cast operator throws a bad_cast exception because the cast to a reference type fails.

bad_cast demo

```cpp
try {  
    Circle& ref_circle = dynamic_cast<Circle&>(ref_shape);   
}  
catch (bad_cast b) {  
    cout << "Caught: " << b.what();  
} 
```

### Runtime Type Information (RTTI)

#### dynamic_cast

* For polymorphic type conversions

#### typeid

* The typeid operator allows determining the type of an object at runtime
* type \ _id returns a reference to a type \ _info object
* If you want to get the data type of the derived class through the pointer of the base class, the base class must have a virtual function
* Can only get the actual type of the object

#### type_info

* The type_info class describes the type information generated by the compiler in the program. Objects of this class can effectively store pointers to the names of types. The type_info class can also store encoded values suitable for comparing whether two types are equal or comparing their permutation order. The encoding rules and permutation order for the types are unspecified and may vary from program to program.
* Header file: `typeinfo`

typeid, type_info demo

```cpp
#include <iostream>
using namespace std;

class Flyable                       // can fly
{
public:
    virtual void takeoff() = 0;     // take off
    virtual void land() = 0;        // land
};
class Bird : public Flyable         // bird
{
public:
    void foraging() {...}           // foraging
    virtual void takeoff() {...}
    virtual void land() {...}
    virtual ~Bird(){}
};
class Plane : public Flyable        // airplane
{
public:
    void carry() {...}              // carry
    virtual void takeoff() {...}
    virtual void land() {...}
};

class type_info
{
public:
    const char* name() const;
    bool operator == (const type_info & rhs) const;
    bool operator != (const type_info & rhs) const;
    int before(const type_info & rhs) const;
    virtual ~type_info();
private:
    ...
};

void doSomething(Flyable *obj)                 // do something
{
    obj->takeoff();

    cout << typeid(*obj).name() << endl;        //  output the type of the incoming object（"class Bird" or "class Plane"）

    if(typeid(*obj) == typeid(Bird))            // determine object type
    {
        Bird *bird = dynamic_cast<Bird *>(obj); // object conversion
        bird->foraging();
    }

    obj->land();
}

int main(){
	Bird *b = new Bird();
	doSomething(b);
	delete b;
	b = nullptr;
	return 0;
}
```

<a id="effective"></a>

## ⭐️ Effective

### Effective C++

1. Treat C ++ as a language federation (C, Object-Oriented C ++, Template C ++, STL)
2. It is better to replace the preprocessor with a compiler (try to replace `# define` with `const`, `enum`, `inline`)
3. Use const whenever possible
4. Make sure that the object has been initialized before being used (the copy constructor is more efficient than the default copy assignment after construction)
5. Understand what functions C ++ silently writes and calls (the compiler secretly creates a default constructor, copy constructor, copy assignment operator, destructor for class)
6. If you don't want to use the automatically generated function of the compiler, you should explicitly reject it (declare member functions that you don't want to use as private and do not implement them)
7. Declare a virtual destructor for the polymorphic base class (if the class has any virtual functions, it should have a virtual destructor)
8. Don't let the exception escape the destructor (the destructor should swallow and not propagate the exception, or end the program, instead of spitting out the exception; if you want to handle the exception, you should handle it in a non-destructed ordinary function)
9. Never call virtual functions during construction and destruction (because such calls never descend to the derived class)
10. Let `operator =` return a `reference to * this` (for chained assignment)
11. Handle "self-assignment" in `operator =`
12. When assigning an object, be sure to copy "all member variables within the object" and "all base class components" (call the base class copy constructor)
13. Manage resources by objects (resources are obtained in the constructor and released in the destructor. It is recommended to use smart pointers. The resource acquisition time is the initialization time (Resource Acquisition Is Initialization (RAII)).
14. Be careful with copying behavior in resource management classes (the general RAII class copying behavior is: inhibit copying, reference counting, deep copying, transfer of bottom resource ownership (similar to auto_ptr))
15. Provide access to raw resources in the resource management class (access to raw resources may be explicitly or implicitly converted, in general, display conversion is safer, and implicit conversion is more convenient for customers)
16. Use the same form when using new and delete in pairs (`[]` in `new` then` delete []`, `new` without `[]` and `delete`)
17. Store the newed object in (into) a smart pointer in a separate statement (if you do not do this, it may cause undetectable resource leaks due to compiler optimizations)
18. Make interfaces easy to use correctly and not easy to be misused (Promote normal use: Consistency of interfaces, compatible behavior of built-in types; Prevent misuse: Create new types, Restrict operation on types, Constrain object values Eliminate the client's resource management responsibilities)
19. Designing a class is like designing a type, and you need to consider object creation, destruction, initialization, assignment, value passing, legal values, inheritance relationships, conversion, generalization, and so on.
20. Prefer pass-by-reference-to-const instead of pass-by-value (the former is usually more efficient and avoids slicing problems, but not applicable to built-in types, STL iterators, function objects)
21. When an object must be returned, do not deliberately return its reference (never return pointer or reference to a local stack object, or return reference to a heap-allocated object, or return pointer or reference to a local static object, which may be required at the same time. Multiple such objects.)
22. Declare member variables as private (for encapsulation, consistency, precise control over reads and writes, etc.)
23. Rather replace the member function with non-member and non-friend (which can increase packaging flexibility, packaging flexibility, and functional extensibility)
24. If all parameters (including the metaphoric parameter pointed to by this pointer) require type conversion, please use a non-member function for this
25. Consider writing a swap function that does not throw exceptions
26. Delay the appearance of variable definitions as much as possible (to increase program clarity and improve program efficiency)
27. Do as few transformations as possible (old: `(T) expression`,` T (expression) `; new:` const_cast <T> (expression) `,` dynamic_cast <T> (expression) `,` reinterpret_cast <T > (expression) `,` static_cast <T> (expression) `;; try to avoid transformation, pay attention to efficiency and avoid dynamic_casts, try to design so that no transformation is needed, the transformation can be encapsulated into a function, rather a new type of transformation is preferred)
28. Avoid using handles (including references, pointers, iterators) to point inside the object (to increase encapsulation, make const member functions behave more like const, and reduce "dangling handles" (such as dangling pointers, etc.) possibility)
29. It is worthwhile to work for "exception safety" (Exception-safe functions) will not leak resources or allow any data structure to break even if an exception occurs. There are three possible guarantees: basic, strong Type, do not throw abnormal type)
30. Thorough understanding of inlining inside and outside (inlining is a compile-time behavior in most C ++ programs; whether an inline function is really inline depends on the compiler; most compilers refuse to be too complex (such as with loops or recursion) ) Function inlining, and all calls to virtual functions (unless they are the most bland) will also cause inlining to fail; the code expansion caused by inline may cause a loss of efficiency; inline functions cannot be upgraded with the upgrade of the library)
31. Minimize the compilation dependencies between files (if you can use object references or object pointers to complete the task, do not use objects; if possible, try to replace class definitions with class declarations; provide differences between declarative and definitions Header file)
32. Make sure your public inheritance moulds out an is-a (is a) relationship (applicable to everything in base classes must apply to derived classes, because every derived class object is also a base class object )
33. Avoid obscuring inherited names (you can use using declarative or forwarding functions to make the obscure names goodbye)
34. Distinguish between interface inheritance and implementation inheritance (under public inheritance, derived classes always inherit the interface of the base class; pure virtual functions only specify interface inheritance; non-pure virtual virtual functions specify interface inheritance and default implementation inheritance; non -virtual function specifies interface inheritance and mandatory implementation inheritance)
35. Consider alternatives to virtual functions (such as the non-virtual interface (NVI) approach of the Template Method design pattern, replacing virtual functions with "function pointer member variables" and replacing virtual functions with `tr1 :: function` member variables, Replace the virtual function in the inheritance system with another virtual function in the inheritance system)
36. Never redefine inherited non-virtual functions
37. Never redefine inherited default parameter values, because the default parameter value is statically bound (statically bound), but the virtual function is dynamically bound (dynamically bound)
38. Through compound molding has-a (one) or "implemented according to something" (in the application domain, compound means has-a (there is one); in the implementation domain, compound means (Is-implemented-in-terms-of)
39. Use private inheritance wisely and prudently (private inheritance means is-implemented-in-terms-of (implemented according to something)), use composite whenever possible, when the derived class needs to access the members of the protected base class, or needs to re- Use private inheritance when defining inherited virtual functions, or when empty base optimization is required)
40. Use multiple inheritance wisely and prudently (multiple inheritance is more complex than single inheritance, may lead to new ambiguities, and the need for virtual inheritance, but it does have a legitimate purpose, such as "public inheritance of an interface class" and "private inheritance A class that assists implementation "; virtual inheritance can solve the ambiguity of diamond inheritance under multiple inheritance, but it will increase the size, speed, complexity of initialization and assignment, etc.)
41. Understand implicit interfaces and compile-time polymorphism (both classes and templates support interfaces and polymorphism); class interfaces are explicit with signatures as the center, and polymorphism is through virtual Functions occur at runtime; the interface of a template is implicit based on valid expressions, and polymorphism occurs through comprehension of templates and function overloading resolution at compile time)
42. Understand the double meaning of typename (declared that the template type parameter is that the meaning of the prefix keywords class and typename are exactly the same; use the keyword typename to identify the nested dependent type name, but not in the base class lists or members Use it as a base class modifier in the member initialization list)
43. Learn to deal with the names in templated base classes (you can refer to the member names in base class templates via `this->` in derived class templates, or by a clearly written "base class qualification modifier" )
44. Extract parameter-independent code from templates (code bloat caused by non-type template parameters can often be eliminated by replacing template parameters with function parameters or class member variables; because of type parameters The resulting code bloat can often be achieved by having implementation types with identical binary representations share implementation codes)
45. Use member function templates to accept all compatible types (please use member function templates to generate functions that "accept all compatible types"; declare member templates for "generalized copy construction" or "generalized assignment operation" Also need to declare the normal copy constructor and copy assignment operator)
46. ​​When you need type conversion, please define non-member functions for the template (when we write a class template, and the "relevant to this template" function provided by it supports "implicit type conversion of all parameters", please those functions Defined as "friend function inside class template")
47. Please use traits classes to represent type information (traits classes use templates and "templates specialization" to make "type-related information" available at compile time, and use overloading (overloading) to implement if ... else on types at compile time test)
48. Recognize template metaprogramming (TMP, template metaprogramming)

### More Effective c++

1. Carefully distinguish between pointers and references (when you know that you need to point to something and never change to point to other things, or when you implement an operator whose syntax requirements cannot be met by pointers, you should choose references; At any other time, use pointers)
2. It is best to use C ++ cast operators (`static_cast`, `const_cast`, `dynamic_cast`, `reinterpret_cast`)
3. Never polymorphically treat arrays (polymorphism and pointer arithmetic cannot be mixed; array objects almost always involve pointer arithmetic, so arrays and polymorphism should not be mixed)
4. Don't provide default constructor if necessary (to avoid fields in the object being initialized meaninglessly)
5. Be alert to custom "type conversion functions" (single argument constructors can be avoided by simple methods (explicit keywords) or proxy classes); implicit type conversion operators can be changed to explicit Member function to avoid unexpected behavior)
6. Distinguish the prefix and postfix forms of the increment / decrement operator (pre-accumulate and take out and return a reference; post-preparation take and accumulate and return a const object; when processing user-defined types Should use pre-increment as much as possible; post-implementation should be based on its pre-brother)
7. Never overload the `&&`, `||`, and `,` operators (`&&` and `||` overloading will replace “sudden-semantic semantics” with “function call semantics”; `The overload of` does not guarantee that the left expression must be evaluated earlier than the right expression)
8. Understand the different meanings of new and delete ( `new operator`, `operator new`, `placement new`, `operator new[]` ; `delete operator`, `operator delete`, `destructor`, `operator delete[]` )
9. Use destructors to avoid leaking resources (freeing resources when destructors can avoid resource leaks during exceptions)
10. Prevent resource leaks in constructors (because C ++ will only destruct objects that have already been constructed, the constructor can use try ... catch or auto_ptr (and similar classes) to handle resource leaks when exceptions occur)
11. Prohibit exceptions from flowing out of destructors (reason: first, avoid the terminate function being called in the stack-unwinding mechanism of exception propagation; second, help ensure that destructors complete everything they should do)
12. Understand the difference between "throwing an exception" and "passing a parameter" or "calling a virtual function" (first, exception objects are always copied (except by pointer), if you catch even by value It is copied twice, but the object passed to the function parameter does not necessarily have to be copied. Second, the object that is "thrown as exceptions" has fewer allowed type conversion actions than the object "passed to the function"; Third, the catch clause is checked by the compiler for its "order in which it appears in the source code". The first match succeeds and is executed, and a virtual function is called. Function "
13. Capture exceptions by by reference (to avoid the problem of object deletion and cutting of exception objects, retain the ability to catch standard exceptions, and restrict the number of times an exception object needs to be copied)
14. Use exception specifications wisely (exception specifications provide an excellent description of what kind of exceptions a function expects to throw; there are also some disadvantages, including that the compiler only checks them locally and is easy to inadvertently violate them. Prevent higher-level exception handlers from handling unexpected exceptions)
15. Understand the cost of exception handling (roughly estimated, if try block is used, the overall code will expand by about 5% -10%, and the execution speed will also decrease by this number; therefore, please limit your use of try block and exception specifications Must-use locations, and throw exceptions only in case of real exceptions)
16. Keep in mind the 80-20 rule (the overall performance of software is almost always determined by a small part of its constituent elements (codes), and the code that consumes resources can be identified using a program profiler)
17. Consider using lazy evaluation (can be applied to: Reference Counting to avoid unnecessary object copying, distinguish read and write actions of operator [] to do different things, Lazy Fetching (easy (Remove) to avoid unnecessary database reads, and Lazy Expression Evaluation (to avoid unnecessary numerical calculations)
18. Amortize the expected computational cost (when you must support certain operations whose structure is almost always required, or when the results are often required multiple times, over-eager evaluation can improve program efficiency )

### Google C ++ Style Guide

* English: [Google C ++ Style Guide](https://google.github.io/styleguide/cppguide.html)
* Chinese: [C ++ Style Guide](https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/contents/)

### Other

* [Bjarne Stroustrup FAQ](http://www.stroustrup.com/bs_faq.html)
* [C ++ style and trick FAQ for Bjarne Stroustrup](http://www.stroustrup.com/bs_faq2.html)

<a id="stl"></a>

## 📦 STL

### STL index

[STL Method Meaning Index](https://github.com/huihut/interview/tree/master/STL)

### STL container

Container | Underlying data structure | Time complexity | Unordered | Can not be repeated | Other
---|---|---|---|---|---
[array](https://github.com/huihut/interview/tree/master/STL#array) | array | random read and change O(1) | unordered | repeatable | support random access
[vector](https://github.com/huihut/interview/tree/master/STL#vector) | Array | Random read, tail insertion, tail deletion O(1) <br/> head insertion, head Delete O(n) | Unordered | Repeatable | Support random access
[deque](https://github.com/huihut/interview/tree/master/STL#deque) | Dual-end queue | End-to-end insertion, end-to-end deletion O(1) | Unordered | Repeatable | One central control + Multiple buffers, support rapid addition and deletion at the beginning and end, support random access
[forward_list](https://github.com/huihut/interview/tree/master/STL#forward_list) | One-way linked list | Insert and delete O(1) | Unordered | Repeatable | Random access is not supported
[list](https://github.com/huihut/interview/tree/master/STL#list) | Doubly linked list | Insert / delete O(1) | Unordered | Repeatable | Does not support random access
[stack](https://github.com/huihut/interview/tree/master/STL#stack) | deque / list | top insert, top delete O(1) | unordered | repeatable | deque or list closed head The end is open. The reason why the vector is not used should be that the capacity is limited, and the expansion takes time.
[queue](https://github.com/huihut/interview/tree/master/STL#queue) | deque / list | tail insertion, head deletion O(1) | unordered | repeatable | deque or list closure The head end is open. The reason why the vector is not used should be that the capacity is limited, and the expansion takes time.
[priority_queue](https://github.com/huihut/interview/tree/master/STL#priority_queue) | vector + max-heap | Insert, delete O(log<sub>2</sub>n) | Ordered | Repeatable | vector container + heap processing rules
[set](https://github.com/huihut/interview/tree/master/STL#set) | Red and Black Tree | Insert, delete, find O(log<sub>2</sub>n) | Ordered | Not repeatable |
[multiset](https://github.com/huihut/interview/tree/master/STL#multiset) | Red and Black Tree | Insert, delete, find O(log<sub>2</sub>n) | Ordered | Repeatable |
[map](https://github.com/huihut/interview/tree/master/STL#map) | Red and Black Tree | Insert, delete, find O(log<sub>2</sub>n) | Ordered | Not repeatable |
[multimap](https://github.com/huihut/interview/tree/master/STL#multimap) | Red and Black Tree | Insert, delete, find O(log<sub>2</sub>n) | Ordered | Repeatable |
[unordered_set](https://github.com/huihut/interview/tree/master/STL#unordered_set) | Hash Table | Insert, Delete, Find O(1) Worst O(n) | Unordered | Not Repeatable |
[unordered_multiset](https://github.com/huihut/interview/tree/master/STL#unordered_multiset) | Hash Table | Insert, Delete, Find O(1) Worst O(n) | Unordered | Repeatable |
[unordered_map](https://github.com/huihut/interview/tree/master/STL#unordered_map) | Hash Table | Insert, Delete, Find O(1) Worst O(n) | Unordered | Not Repeatable |
[unordered_multimap](https://github.com/huihut/interview/tree/master/STL#unordered_multimap) | Hash Table | Insert, Delete, Find O(1) Worst O(n) | Unordered | Repeatable |


### STL Algorithm

Algorithm | Low-level algorithm | Time complexity | Can not be repeated
--- | --- | --- | ---
[find](http://www.cplusplus.com/reference/algorithm/find/) | Sequence search | O(n) | Repeatable
[sort](https://github.com/gcc-mirror/gcc/blob/master/libstdc++-v3/include/bits/stl_algo.h#L4808) | [Introspection sorting](https://en.wikipedia.org/wiki/Introsort) | O(n*log<sub>2</sub>n) | Repeatable

<a id="data-structure"></a>

## 〽️ Data Structure

### Sequence structure

#### Sequential stack（Sequence Stack）

[SqStack.cpp](DataStructure/SqStack.cpp)

Sequential stack data structures and pictures

```cpp
typedef struct {
	ElemType *elem;
	int top;
	int size;
	int increment;
} SqStack;
```

![](https://raw.githubusercontent.com/huihut/interview/master/images/SqStack.png)

#### queue（Sequence Queue）

Queue data structure

```cpp
typedef struct {
	ElemType * elem;
	int front;
	int rear;
	int maxSize;
}SqQueue;
```

##### Acyclic queue

Acyclic queue picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/SqQueue.png)

`SqQueue.rear++`

##### Circular queue

Circular queue picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/SqLoopStack.png)

`SqQueue.rear = (SqQueue.rear + 1) % SqQueue.maxSize`

#### Sequence table（Sequence List）

[SqList.cpp](DataStructure/SqList.cpp)

Sequence table data structure and pictures

```cpp
typedef struct {
	ElemType *elem;
	int length;
	int size;
	int increment;
} SqList;
```

![](https://raw.githubusercontent.com/huihut/interview/master/images/SqList.png)


### Chain structure

[LinkList.cpp](DataStructure/LinkList.cpp)

[LinkList_with_head.cpp](DataStructure/LinkList_with_head.cpp)

Chained data structure

```cpp
typedef struct LNode {
    ElemType data;
    struct LNode *next;
} LNode, *LinkList; 
```

#### Chain queue（Link Queue）

Chain queue picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/LinkQueue.png)

#### Chained representation of a linear list

##### Singly-Linked list（Link List）

Singly-linked list picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/LinkList.png)

##### Doubly linked list（Du-Link-List）

Doubly-linked list picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/DuLinkList.png)

##### Circular linked list（Cir-Link-List）

Circular-linked list picture

![](https://raw.githubusercontent.com/huihut/interview/master/images/CirLinkList.png)

### Hash table

[HashTable.cpp](DataStructure/HashTable.cpp)

#### Concept

Hash function：`H(key): K -> D , key ∈ K`

#### Construction method

* Direct Addressing
* Divided remainder method
* Digital analysis method
* Folding method
* The square method

#### Collision resolution method

* Chain address method: single linked list linked with the same key
* Open Addressing
     * Linear detection method: same key-> put to the next position of key，`Hi = (H(key) + i) % m`
    * Secondary detection method: same key-> put to `Di = 1^2, -1^2, ..., ±（k)^2,(k<=m/2）`
    * Random detection：`H = (H(key) + Pseudo-random number) % m`

#### Hash table data structure for linear probing

Hash table data structure and pictures for linear detection

```cpp
typedef char KeyType;

typedef struct {
	KeyType key;
}RcdType;

typedef struct {
	RcdType *rcd;
	int size;
	int count;
	bool *tag;
}HashTable;
```

![](https://raw.githubusercontent.com/huihut/interview/master/images/HashTable.png)

### Recursion

#### Concept

Function calls itself directly or indirectly

#### Recursion and Divide

* Divide and Conquer
     * Breakdown of the problem
     * Problem size decomposition
* Half search (recursive)
* Merge sort (recursive)
* Quick sort (recursive)

#### Recursion and Iteration

* Iteration: use the old value of the variable repeatedly to push out the new value
* Search in half (iterative)
* Merge sort (iterative)

#### Generalized table

##### Head and tail linked list storage representation

Head and tail linked list storage representations and pictures for generalized tables

```cpp
// Head-to-tail linked list storage representation of generalized list
typedef enum {ATOM, LIST} ElemTag;
// ATOM == 0: atom, LIST == 1: child table
typedef struct GLNode {
    ElemTag tag;
    // public part, used to distinguish atomic nodes from table nodes
    union {
        // joint part of atomic node and table node
        AtomType atom;
         // atom is the range of atom nodes, AtomType is defined by the user
        struct {
            struct GLNode *hp, *tp;
        } ptr;
        /// ptr is the pointer field of the table node, prt.hp and ptr.tp point to the table header and table tail respectively
    } a;
} *GList, GLNode;
```

![](https://raw.githubusercontent.com/huihut/interview/master/images/GeneralizedList1.png)

##### Extended linear linked list storage representation

Extended linear linked list storage representations and pictures

```cpp
// Extended linear linked list storage representation of generalized tables
typedef enum {ATOM, LIST} ElemTag;
// ATOM == 0: atom, LIST == 1: child table
typedef struct GLNode1 {
    ElemTag tag;
    // public part, used to distinguish atomic nodes from table nodes
    union {
        // joint part of atomic node and table node
        AtomType atom;  // range of atom nodes
        struct GLNode1 *hp; // table pointer pointer
    } a;
    struct GLNode1 *tp;
    // Equivalent to next of a linear linked list, pointing to the next 
} *GList1, GLNode1;
```

![](https://raw.githubusercontent.com/huihut/interview/master/images/GeneralizedList2.png)

### Binary tree

[BinaryTree.cpp](DataStructure/BinaryTree.cpp)

#### properties

1. Up to 2<sup>(i-1)</sup> nodes at the i-th level of a non-empty binary tree (i> = 1)
2. Binary tree with depth k up to 2<sup>k</sup>-1 node (k >= 1)
3. The number of nodes with degree 0 is n<sub>0</sub>, and the number of nodes with degree 2 is n<sub>2</sub>, then n<sub>0</sub> = n<sub>2</sub> + 1
4. Full binary tree depth with n nodes k = ⌊ log <sub> 2 </ sub> (n) ⌋ + 1
5. For the node numbered i (1 <= i <= n) in a complete binary tree with n nodes
     1. If i = 1, it is the root, otherwise the parents are ⌊ i / 2 ⌋
     2. If 2i > n, node i has no left child, otherwise the child number is 2i
     3. If 2i + 1> n, the i node has no right child, otherwise the child number is 2i + 1

#### Storage structure

Binary tree data structure

```cpp
typedef struct BiTNode
{
    TElemType data;
    struct BiTNode *lchild, *rchild;
}BiTNode, *BiTree;
```

##### Sequential storage

Binary tree sequential storage pictures

![](https://raw.githubusercontent.com/huihut/interview/master/images/SqBinaryTree.png)

##### Chained storage

Binary tree chain store pictures

![](https://raw.githubusercontent.com/huihut/interview/master/images/LinkBinaryTree.png)

#### Traversal

* Sequence traversal
* In-order traversal
* Subsequent traversals
* Hierarchical traversal

#### Categories

* Full Binary Tree
* Complete binary tree (heap)
     * Big top heap: root> = left && root> = right
     * Small top heap: root <= left && root <= right
* Binary search tree (binary sort tree): left <root <right
* Balanced binary tree (AVL tree): | Left subtree tree height-Right subtree tree height | <= 1
* Least Imbalanced Tree: Balanced Binary Tree Inserting New Nodes Causes Imbalanced Subtree: Adjustment:
     * LL type: left-handed child of the root
     * RR type: right child of the root
     * LR type: Left-handed child of the root, left-handed
     * RL type: Left child of right child, turn right first, then left

### Other trees and forests

#### The storage structure of the tree

* Parental notation
* Parental notation
* Child brother notation

#### And check

A set of disjoint subsets S = {S1, S2, ..., Sn}

#### Balanced Binary Tree (AVL Tree)

##### nature

* | Left Subtree Tree Height-Right Subtree Tree Height | <= 1
* A balanced binary tree must be a binary search tree, otherwise it is not necessarily
* The formula of the nodes of the minimum binary balanced tree: `F(n) = F(n-1) + F(n-2) + 1` (1 is the root node, F (n-1) is the left subtree Number of nodes, F (n-2) is the number of nodes in the right subtree)

Balanced binary tree pictures

![](https://raw.githubusercontent.com/huihut/interview/master/images/Self-balancingBinarySearchTree.png)

##### Minimal Imbalance Tree

Balanced binary tree inserting new nodes causes unbalanced subtrees

Adjustment:

* LL type: left child of the root
* RR type: right child of the root
* LR type: Left-handed child of the root, left-handed, then right-handed
* RL type: Left child of right child, right-handed first, then left-handed

#### Red black tree

[RedBlackTree.cpp](DataStructure/RedBlackTree.cpp)

##### What are the characteristics of red-black trees?

1. The nodes are red or black.
2. The root is black.
3. All leaves are black (the leaves are NIL nodes).
4. Each red node must have two black child nodes. (There cannot be two consecutive red nodes on all paths from each leaf to the root.) (The parent node of the new node must be the same)
5. All simple paths from any node to each of its leaves contain the same number of black nodes. (New nodes must be red)

##### Adjustment

Discoloration
Left
Right turn

##### Application

* Associative arrays: such as map, set in STL

##### What is the difference between red and black trees, B trees, and B + trees?

* The depth of the red-black tree is larger, while the depth of the B-tree and B + -tree is relatively smaller
* B + trees store data in leaf nodes, and connect them together in the form of linked lists.

#### B-tree, B + -tree

B-tree, B+-tree pictures

![B tree (B-tree), B+ tree (B+-tree)](https://i.stack.imgur.com/l6UyF.png)

##### Features

* Generalized binary search tree
* "Puffy", internal (non-leaf) nodes can have a variable number of child nodes (the number range is predefined)

##### Application

* Most file systems and database systems use B-trees and B + trees as index structures

##### the difference

* Only leaf nodes in the B + tree will have pointers to records (ROWID), while all nodes in the B-tree will have, and the index items appearing in the internal nodes will no longer appear in the leaf nodes.
* All leaf nodes in the B + tree are connected by pointers, while the B tree does not.

##### Advantages of B-tree

The data at the internal nodes can be obtained directly without having to locate according to the leaf nodes.

##### Advantages of B + trees

* Non-leaf nodes do not carry ROWID. In this way, more index entries can be accommodated in a block. One is to reduce the height of the tree. The second is that an internal node can locate more leaf nodes.
* The leaf nodes are connected by pointers. The range scan will be very simple. For the B-tree, the leaf nodes and internal nodes need to be moved back and forth continuously.

> The difference between B-tree and B + -tree comes from：[differences-between-b-trees-and-b-trees](https://stackoverflow.com/questions/870218/differences-between-b-trees-and-b-trees)、[Difference between B-tree and B + tree](https://www.cnblogs.com/ivictor/p/5849061.html)

#### Octree

Octree picture


![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Octree2.png/400px-Octree2.png)

An octree is a tree-like data structure used to describe three-dimensional space (dividing space). Each node of the octree represents a volume element of a cube, and each node has eight child nodes. The volume elements represented by the eight child nodes are added together to equal the volume of the parent node. The general center point is used as the bifurcation center of the node.

##### Purpose

* 3D computer graphics
* Nearest Search

<a id="algorithm"></a>

## ⚡️ Algorithm

### Sort

Sorting Algorithm | Average Time Complexity | Worst Time Complexity | Spatial Complexity | Data Object Stability
---|---|---|---|---
[Bubble Sort](Algorithm/BubbleSort.h) | O(n<sup>2</sup>)|O(n<sup>2</sup>)|O(1)|Stable
[Selection Sort](Algorithm/SelectionSort.h) | O(n<sup>2</sup>)|O(n<sup>2</sup>)|O(1)|The array is unstable and the linked list is stable
[Insert Sort](Algorithm/InsertSort.h) | O(n<sup>2</sup>)|O(n<sup>2</sup>)|O(1)|Stable
[Quick Sort](Algorithm/QuickSort.h) | O(n*log<sub>2</sub>n) |  O(n<sup>2</sup>) | O(log<sub>2</sub>n) | Unstable
[Heap Sort](Algorithm/HeapSort.cpp) | O(n*log<sub>2</sub>n)|O(n*log<sub>2</sub>n)|O(1)|Unstable
[Merge Sort](Algorithm/MergeSort.h) | O(n*log<sub>2</sub>n) | O(n*log<sub>2</sub>n)|O(n)| Stable
[Shell Sort](Algorithm/ShellSort.h) | O(n*log<sup>2</sup>n)|O(n<sup>2</sup>)|O(1)|Unstable
[Count Sort](Algorithm/CountSort.cpp) | O(n+m)|O(n+m)|O(n+m)|Stable
[Bucket Sort](Algorithm/BucketSort.cpp) | O(n)|O(n)|O(m)|Stable
[Radix Sort](Algorithm/RadixSort.h) | O(k*n)|O(n<sup>2</sup>)| |Stable

> * Are arranged in ascending order
> * k: represents the number of "digits" in the value
> * n: represents the size of the data
> * m: represents the maximum value minus the minimum value of the data
> * From: [wikipedia. Sorting Algorithm](https://en.wikipedia.org/wiki/Sorting_algorithm)

### Find

Find Algorithm | Average Time Complexity | Spatial Complexity | Find Conditions
---|---|---|---
[SequentialSearch](Algorithm/SequentialSearch.h) | O(n) | O(1) | sorted or unsorted
[Binary search (half search)](Algorithm/BinarySearch.h) | O(log<sub>2</sub>n)| O(1) | sorted
[Insertion Search](Algorithm/InsertionSearch.h) | O(log<sub>2</sub>(log<sub>2</sub>n)) | O(1) | sorted
[Fibonacci Search](Algorithm/FibonacciSearch.cpp) | O(log<sub>2</sub>n) | O(1) | soted
[Hash Table](DataStructure/HashTable.cpp) | O(1) | O(n) | sorted or unsorted
[Binary Search Tree (BST Search)](Algorithm/BSTSearch.h) |O(log<sub>2</sub>n) |   | 
[Red Black Tree](DataStructure/RedBlackTree.cpp) |O(log<sub>2</sub>n) | |
2-3 Tree | O(log<sub>2</sub>n - log<sub>3</sub>n) |   | 
B Tree/B+ Tree |O(log<sub>2</sub>n) |   | 

### Graph search algorithm

Graph Search Algorithm | Data Structure | Traversal Time Complexity | Spatial Complexity
---|---|---|---
[BFS - Breadth First Search](https://zh.wikipedia.org/wiki/%E5%B9%BF%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2)|adjacency matrix <br/> adjacency list |O(\|v\|<sup>2</sup>)<br/>O(\|v\|+\|E\|)|O(\|v\|<sup>2</sup>)<br/>O(\|v\|+\|E\|)
[DFS - Depth-First Search](https://zh.wikipedia.org/wiki/%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2)| adjacency matrix <br/> adjacent linked list |O(\|v\|<sup>2</sup>)<br/>O(\|v\|+\|E\|)|O(\|v\|<sup>2</sup>)<br/>O(\|v\|+\|E\|)

### Other algorithms

Algorithms | Ideas | Applications
--- | --- | ---
[Divide and Conquer](https://en.wikipedia.org/wiki/%E5%88%86%E6%B2%BB%E6%B3%95) | Divide a complex problem into two or more The same or similar sub-problems, until the last sub-problem can be simply and directly solved, the solution of the original problem is the combination of the solutions of the sub-problems | [loop schedule problem](https://github.com/huihut/interview/tree/master/Problems/RoundRobinProblem), sorting algorithms (quick sort, merge sort)
[Dynamic Programming](https://en.wikipedia.org/wiki/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92) | By decomposing the original problem into relative Simple sub-question way to solve complex problems, suitable for problems with overlapping sub-problems and optimal sub-structure properties | [knapsack problem] KnapsackProblem), Fibonacci sequence
[Greedy method](https://en.wikipedia.org/wiki/%E8%B4%AA%E5%BF%83%E6%B3%95) | A kind of choice is taken in the current state in each step The best or optimal (that is, the most advantageous) choice, so that the result is the best or optimal algorithm | Travel Salesman Problem (Shortest Path Problem), Minimum Spanning Tree, Huffman Coding

<a id="problems"></a>

## ❓ Problems

### Single Problem

* [Chessboard Coverage Problem (Checkerboard coverage problem)](Problems/ChessboardCoverageProblem)
* [Knapsack Problem](Problems/KnapsackProblem)
* [Neumann Neighbor Problem](Problems/NeumannNeighborProblem)
* [Round Robin Problem](Problems/RoundRobinProblem)
* [Tubing Problem](Problems/TubingProblem)

### Leetcode Problems

* [Github . haoel/leetcode](https://github.com/haoel/leetcode)
* [Github . pezy/LeetCode](https://github.com/pezy/LeetCode)

### Sword Finger Offer

* [Github . zhedahht/CodingInterviewChinese2](https://github.com/zhedahht/CodingInterviewChinese2)
* [Github . gatieme/CodingInterviews](https://github.com/gatieme/CodingInterviews)

### Cracking the Coding Interview (Programmer Interview Gold)

* [Github . careercup/ctci](https://github.com/careercup/ctci)
* [Niu Ke. Programmer interview golden code](https://www.nowcoder.com/ta/cracking-the-coding-interview)

### Niu Ke

* [Niu Ke . Online programming topics](https://www.nowcoder.com/activity/oj)

<a id="os"></a>

## 💻 Operating system

### Processes and threads

For threaded systems:
* Processes are independent units of resource allocation
* Thread is an independent unit of resource scheduling

For non-threaded systems:
* Process is an independent unit of resource scheduling and allocation

#### Communication between processes and advantages and disadvantages

* Pipeline (PIPE)
    * Famous Pipeline: A half-duplex communication method that allows communication between unrelated processes
        * Advantages: can achieve inter-process communication in any relationship
        * Disadvantages:
            1. Long-term storage in the system, improper use is prone to errors
            Limited buffer
    * Unnamed pipe: a half-duplex communication method that can only be used between processes with parental relationships (parent-child processes)
        * Advantages: simple and convenient
        * Disadvantages:
            Limited to one-way communication
            2. Can only be created between its processes and their related processes
            3. Limited buffer
* Semaphore: a counter that can be used to control access to shared resources by multiple threads
    * Advantages: can synchronize processes
    * Disadvantage: limited semaphore
* Signal (Signal): a more complex communication method used to notify the receiving process that an event has occurred
* Message Queue: a linked list of messages, stored in the kernel and identified by the message queue identifier
    * Advantages: can achieve communication between any process, and achieve synchronization between message sending and receiving through system call functions, no need to consider synchronization issues, convenient
    * Disadvantages: Copying information requires additional CPU time, which is not suitable for situations with large amounts of information or frequent operations
* Shared Memory: Maps a piece of memory that can be accessed by other processes. This shared memory is created by one process, but can be accessed by multiple processes.
    * Advantages: no need to copy, fast, large amount of information
    * Disadvantages:
        1. Communication is achieved by directly attaching the shared space buffer to the virtual address space of the process, so the synchronization of read and write operations between processes
        2. Use the memory buffer to directly exchange information. The entity of memory exists in the computer and can only be shared with many processes in a computer system, which is not convenient for network communication.
* Socket (Socket): can be used for process communication between different computers
    * Advantages:
        1. The transmission data is byte level, the transmission data can be customized, the data volume is small and the efficiency is high
        2. Short data transmission time and high performance
        3. Suitable for real-time information exchange between client and server
        4. Can be encrypted, strong data security
    * Disadvantages: The transmitted data needs to be parsed and converted into application-level data.

#### Communication between threads

* Locking mechanism: including mutex, reader-writer lock, spin lock, and condition
    * Mutex (mutex): Provides an exclusive way to prevent data structures from being modified concurrently.
    * Reader-writer lock: Allow multiple threads to read shared data at the same time, and are mutually exclusive for write operations.
    * Spin locks are similar to mutex locks in order to protect shared resources. The mutex is when the resource is occupied and the applicant goes to sleep; the spin lock circularly detects whether the holder has released the lock.
    * Condition variable (condition): you can atomically block the process until a certain condition is true. Testing of conditions is performed under the protection of a mutex. Condition variables are always used with a mutex.
* Semaphore mechanism
    * Unknown thread semaphore
    * Named thread semaphore
* Signal mechanism (Signal): similar to signal processing between processes
* Barrier: A barrier allows each thread to wait until all cooperating threads reach a certain point, and then continue execution from that point.

The purpose of communication between threads is mainly for thread synchronization, so threads have no communication mechanism for data exchange like in process communication.

> The communication methods between processes and their advantages and disadvantages come from: [Process thread interview question summary](http://blog.csdn.net/wujiafei_njgcxy/article/details/77098977)

#### Private and shared resources between processes

* Private: address space, heap, global variables, stack, registers
* Share: code snippet, public data, process directory, process ID

#### Private and shared resources between threads

* Private: thread stack, register, program counter
* Shared: heap, address space, global variables, static variables

#### Comparison, advantages and disadvantages of multi-process and multi-thread

##### Compared

Contrast Dimensions | Multi-Process | Multi-Threaded | Summary
--- | --- | --- | ---
Data sharing and synchronization | Complex data sharing requires IPC; data is separate and easy to synchronize | Because process data is shared, data sharing is simple, but it is also because of this reason that synchronization is complicated | Each advantage
Memory, CPU | Occupies more memory, complex switching, low CPU utilization | Less memory, simple switching, high CPU utilization | Threads dominate
Create destroy, switch | create destroy, switch complex, slow speed | create destroy, switch simple, fast speed | thread dominant
Programming, debugging | simple programming, simple debugging | complex programming, complex debugging | process dominates
Reliability | Processes will not affect each other | Hanging a thread will cause the entire process to hang | Process dominance
Distributed | Applicable to multi-core, multi-machine distributed; if one machine is not enough, it is relatively simple to expand to multiple machines | adapted to multi-core distributed | process dominant

##### Pros and cons

Pros and cons | multi-process | multi-threaded
--- | --- | ---
Advantages | Simple programming and debugging, high reliability | Fast creation, destruction, switching, small memory and resource occupation
Disadvantages | Creating, destroying, slow switching, large memory and resource occupation | Complex programming and debugging, poor reliability

##### Select

* Need to frequently create and destroy priority threads
* Priority threads that require a lot of calculations
* Strongly related processing threads, weakly related processing processes
* May be extended to multi-machine distributed processes, multi-core distributed threads
* When all meet the needs, use the method you are most familiar with

> The comparison, advantages and disadvantages of multi-process and multi-thread come from: [multi-thread or multi-process selection and difference](https://blog.csdn.net/lishenglong666/article/details/8557215)

### Linux kernel synchronization

#### the reason

In modern operating systems, there may be multiple kernel execution streams executing at the same time, so the kernel actually needs some synchronization mechanism to synchronize the access of the execution units to shared data like multi-process and multi-thread programming. Especially on multiprocessor systems, some synchronization mechanisms are needed to synchronize the access of the execution units on different processors to shared data.

#### Synchronously

* Atomic operations
* Semaphore
* Read and write semaphore (rw_semaphore)
* Spinlock
* Big Kernel Lock (BKL, Big Kernel Lock)
* Read-write lock (rwlock)
* Brlock-Big Reader Lock
* Read-Copy Update (RCU, Read-Copy Update)
* Sequence lock (seqlock)

> From: [Linux kernel synchronization mechanism, Part 1](https://www.ibm.com/developerworks/cn/linux/l-synch/part1/), [Linux kernel synchronization mechanism, Part 2](https://www.ibm.com/developerworks/cn/linux/l-synch/part2/)

### Deadlock

#### Reasons

* Insufficient system resources
* Improper allocation of resources
* The progress order of the process operation is not suitable

#### Generate conditions

* Mutex
* Request and hold
* Not deprived
* Loop

#### Prevention

* Breaking mutually exclusive conditions: transforming exclusive resources into virtual resources, most of which cannot be transformed.
* Break the non-preemption condition: when a process occupies an exclusive resource and then applies for an exclusive resource that cannot be met, it will withdraw from the original resource.
* Break possession and apply conditions: Adopt a resource pre-allocation strategy, that is, apply for all resources before the process runs, run if it meets, or wait, so that it will not be occupied and applied.
* Break the loop waiting condition: implement the orderly allocation of resources, implement classification numbers for all devices, and all processes can only apply for resources in the form of increasing numbers.
* Ordered resource allocation method
* Banker Algorithm

### File system

* Windows: FCB table + FAT + bitmap
* Unix: inode + mixed index + group link

### Host byte order and network byte order

#### Host Endianness (CPU Endianness)

##### Concept

The host byte order is also called the CPU byte order. It is not determined by the operating system, but by the CPU instruction set architecture. There are two types of host byte order:

* Big Endian: The high-order byte is stored in the low-order address, and the low-order byte is stored in the high-order address
* Little Endian: The high-order byte is stored in the high-order address, and the low-order byte is stored in the low-order address.

##### Storage method

The 32-bit integer `0x12345678` is stored from the address starting at` 0x00`, then:

Memory address | 0x00 | 0x01 | 0x02 | 0x03
--- | --- | --- | --- | ---
Big Endian | 12 | 34 | 56 | 78
Little Endian | 78 | 56 | 34 | 12

Big-endian little-endian pictures

![Big endian](https://raw.githubusercontent.com/huihut/interview/master/images/CPU-Big-Endian.svg.png)
![Little endian](https://raw.githubusercontent.com/huihut/interview/master/images/CPU-Little-Endian.svg.png)

##### Judging big-endian little-endian

Judge big-endian little-endian

You can determine whether your CPU byte order is big-endian or little-endian:

```cpp
#include <iostream>
using namespace std;

int main()
{
	int i = 0x12345678;

	if (*((char*)&i) == 0x12)
		cout << "Big endian" << endl;
	else	
		cout << "Little endian" << endl;

	return 0;
}
```

##### Byte order of each architecture processor

* x86 (Intel, AMD), MOS Technology 6502, Z80, VAX, PDP-11 and other processors are little-endian;
* Motorola 6800, Motorola 68000, PowerPC 970, System/370, SPARC (except V9) processors are big-endian;
* The endianness of ARM (default little-endian), PowerPC (except PowerPC 970), DEC Alpha, SPARC V9, MIPS, PA-RISC, and IA64 are configurable.

#### Network byte order

Network byte order is a data representation format specified in TCP/IP. It has nothing to do with the specific CPU type, operating system, etc., so that it can ensure that the data can be correctly interpreted when transmitted between different hosts.

The network byte order uses: Big Endian arrangement.

### Page replacement algorithm

During the address mapping process, if a page to be accessed is found not to be in memory, a page fault interrupt is generated. When a page fault occurs, if there is no free page in the operating system memory, the operating system must select a page in memory to move it out of memory in order to make room for the page that is about to be paged in. The rules used to select which pages to eliminate are called page replacement algorithms.

#### Categories

* Global replacement: replacement in the entire memory space
* Partial replacement: Replace in this process

#### Algorithm

Global:
* Working set algorithm
* Page rate replacement algorithm

Partially:
* Optimal Replacement Algorithm (OPT)
* First in, first out replacement algorithm (FIFO)
* Least Recently Used (LRU) Algorithm
* Clock replacement algorithm

<a id="computer-network"></a>

## ☁️ Computer Network

> Some of the knowledge in this section comes from Computer Networking (7th Edition)

Computer network architecture:

![Computer Network Architecture](https://raw.githubusercontent.com/huihut/interview/master/images/计算机网络体系结构.png)

### Roles and protocols of each layer

Layered | role | protocol
--- | --- | ---
Physical layer | Transmission of bits through the medium, determination of mechanical and electrical specifications (bits) | RJ45, CLOCK, IEEE802.3 (repeaters, hubs)
Data link layer | Assemble bits into frames and point-to-point delivery (Frame) | PPP, FR, HDLC, VLAN, MAC (bridge, switch)
Network layer | Responsible for the transmission of data packets from source to sink and Internet interconnection (packets) | IP, ICMP, ARP, RARP, OSPF, IPX, RIP, IGRP (router)
Transport layer | Provide end-to-end reliable message delivery and error recovery (Segment) | TCP, UDP, SPX
Session layer | Establishing, managing, and terminating sessions (session protocol data unit SPDU) | NFS, SQL, NETBIOS, RPC
Presentation Layer | Translate, Encrypt, and Compress Data (Representation Protocol Data Unit PPDU) | JPEG, MPEG, ASII
Application layer | A means to allow access to the OSI environment (Application Protocol Data Unit APDU) | FTP, DNS, Telnet, SMTP, HTTP, WWW, NFS


### Physical layer

* Unit of transmitted data: bit
* Data transmission system: source system (source point, sender)-> transmission system-> destination system (receiver, destination)

aisle:
* Unidirectional channel (simplex channel): only one direction communication, no reverse direction interaction, such as broadcasting
* Two-way alternate communication (half-duplex communication): both parties of the communication can send messages, but cannot send or receive at the same time
* Two-way simultaneous communication (full-duplex communication): both parties of the communication can send and receive information at the same time

Channel multiplexing technology:
* Frequency division multiplexing (FDM, Frequency Division Multiplexing): different users in different frequency bands, users use different bandwidth resources at the same time
* Time Division Multiplexing (TDM): different users in different time slices in the same time period, all users occupy the same bandwidth at different times
* Wavelength Division Multiplexing (WDM): Frequency division multiplexing of light
* Code Division Multiplexing (CDM): Different users use different codes and can use the same frequency band for communication at the same time

### data link layer

Main channel:
* Point-to-point channel
* Broadcast channel

#### Point-to-point channel

* Data unit: frame

Three basic questions:
* Encapsulation: Encapsulate IP datagrams at the network layer into frames, `SOH-data part-EOT`
* Transparent transmission: No matter what characters in the data part, it can be transmitted; it can be solved by byte padding method (escaping characters before conflicting characters)
* Error detection: reduce bit error rate (BER), widely use cyclic redundancy check (CRC, Cyclic Redundancy Check)

Point-to-Point Protocol:
* Point-to-Point Protocol: The protocol used by the user computer to communicate with the ISP

#### Broadcast Channel

Broadcast communication:
* Hardware address (physical address, MAC address)
* Unicast frame (one-to-one): The MAC address of the received frame is the same as the hardware address of this station
* Broadcast frame (one pair): frame sent to all stations on the local area network
* Multicast frame (one-to-many): frame sent to some sites on the local area network

### Network layer

* IP (Internet Protocol, Internet Protocol) is a protocol designed for computer networks to communicate with each other.
* ARP (Address Resolution Protocol, Address Resolution Protocol)
* ICMP (Internet Control Message Protocol, Internet Control Message Protocol)
* IGMP (Internet Group Management Protocol, Internet Group Management Protocol)

#### IP Internet Protocol

IP address classification:
* `IP address ::= (<network number>, <host number>)`

IP address category | network number | network range | host number | IP address range
--- | --- | --- | --- | ---
Class A | 8bit, the first bit is fixed at 0 | 0 —— 127 | 24bit | 1.0.0.0 —— 127.255.255.255
Class B | 16bit, the first two bits are fixed at 10 | 128.0 —— 191.255 | 16bit | 128.0.0.0 —— 191.255.255.255
Class C | 24bit, the first three bits are fixed at 110 | 192.0.0 —— 223.255.255 | 8bit | 192.0.0.0 —— 223.255.255.255
Class D | The first four bits are fixed at 1110, followed by the multicast address
Class E | The first five digits are fixed at 11110, the latter are reserved for future use

IP datagram format:

![IP 数据报格式](https://raw.githubusercontent.com/huihut/interview/master/images/IP数据报格式.png)

#### ICMP Internet Control Message Protocol

ICMP message format:

![ICMP message format](https://raw.githubusercontent.com/huihut/interview/master/images/ICMP报文格式.png)

application:
* PING (Packet InterNet Groper) to test connectivity between two hosts
* TTL (Time To Live, time to live) This field specifies the maximum number of network segments that IP packets are allowed to pass before being dropped by the router.

#### Interior Gateway Protocol

* RIP (Routing Information Protocol, Routing Information Protocol)
* OSPF (Open Sortest Path First)

#### External gateway protocol

* BGP (Border Gateway Protocol, Border Gateway Protocol)

#### IP multicast

* IGMP (Internet Group Management Protocol, Internet Group Management Protocol)
* Multicast routing protocol

#### VPN and NAT

* VPN (Virtual Private Network)
* NAT (Network Address Translation, Network Address Translation)

#### What does the routing table contain?

1. Network ID (Network ID): It is the network ID of the destination address.
2. Subnet mask: used to determine the network to which the IP belongs
3. Next hop address / interface: It is the address of the next stop of the data on the journey sent to the destination address. Where interface points to the next hop (that is, the next route). The route in an autonomous system (AS) should contain all subnets in the area, and the default gateway (Network id: `0.0.0.0`, Netmask:` 0.0.0.0`) points to the exit of the autonomous system.

Depending on the application and implementation, the routing table may contain the following additional information:

1. Cost: It is the cost required to pass the path during data transmission.
2. Quality of service for routing
3. List of inbound / outbound connections to be filtered in the route

### Transport layer

protocol:

* TCP (Transmission Control Protocol)
* UDP (User Datagram Protocol, User Datagram Protocol)

port:

Applications | FTP | TELNET | SMTP | DNS | TFTP | HTTP | HTTPS | SNMP
--- | --- | --- | --- | --- | --- | --- | --- | ---
Port number | 21 | 23 | 25 | 53 | 69 | 80 | 443 | 161

#### TCP

* TCP (Transmission Control Protocol, Transmission Control Protocol) is a connection-oriented, reliable, byte stream-based transport layer communication protocol, and its transmission unit is a message segment.

Feature:
* Connection oriented
* Only point-to-point (one-to-one) communication
* Reliable interaction
* Full-duplex communication
* Byte stream oriented

How TCP guarantees reliable transmission:
* Confirmation and timeout retransmission
* Reasonable fragmentation and ordering of data
* flow control
* Congestion control
* Data validation

TCP message structure

![TCP Message](https://raw.githubusercontent.com/huihut/interview/master/images/TCP报文.png)

TCP header

![TCP header](https://raw.githubusercontent.com/huihut/interview/master/images/TCP首部.png)

TCP: Status Control Code (Code, Control Flag), which takes 6 bits and has the following meaning:
* URG: Urgent. When `URG = 1` , it indicates that the urgent pointer field is valid, which means that the packet is an urgent packet. It tells the system that there is urgent data in this segment and it should be transmitted as soon as possible (equivalent to high-priority data), and the Urgent Pointer field in the above figure will also be enabled.
* ACK: Acknowledge. The acknowledgment number field is valid only when `ACK = 1`, which means this packet is an acknowledgment packet. When `ACK = 0`, the confirmation number is invalid.
* PSH: (Push function) If it is 1, the representative requires the other party to immediately transmit other corresponding packets in the buffer, without waiting for the buffer to be full before sending.
* RST: Reset bit (Reset). When `RST = 1`, it indicates that a serious error occurred in the TCP connection (such as due to a host crash or other reasons). You must release the connection and then re-establish the transport connection.
* SYN: Synchronous. When SYN is set to 1, it indicates that this is a connection request or connection acceptance message. Usually, the packet with the SYN flag indicates that "active" wants to connect to the other party.
* FIN: Final bit, used to release a connection. When `FIN = 1`, it means that the data of the sending end of this segment has been sent, and it is required to release the transport connection.

#### UDP

* UDP (User Datagram Protocol, User Datagram Protocol) is a connectionless transport layer protocol in the OSI (Open System Interconnection) reference model, which provides a simple and unreliable information transfer service oriented to transactions, and its transmission unit Is a user datagram.

feature:
* no connection
* Best efforts to deliver
* Message-oriented
* No congestion control
* Supports one-to-one, one-to-many, many-to-one, and many-to-many interactive communication
* Small overhead

UDP message structure

![UDP 报文](https://raw.githubusercontent.com/huihut/interview/master/images/UDP报文.png)

UDP 首部

![UDP 首部](https://raw.githubusercontent.com/huihut/interview/master/images/UDP首部.png)

> TCP/UDP Pictures from <https://github.com/JerryC8080/understand-tcp-udp>

#### Difference between TCP and UDP

1. TCP connection-oriented, UDP is connectionless;
2. TCP provides reliable service, that is, the data transmitted through the TCP connection is error-free, not lost, not duplicated, and arrives in order; UDP does its best to deliver, that is, it does not guarantee reliable delivery
3. TCP logical communication channel is a full-duplex reliable channel; UDP is an unreliable channel
5. Each TCP connection can only be point-to-point; UDP supports one-to-one, one-to-many, many-to-one and many-to-many interactive communication
6. TCP is oriented to byte streams (probably sticky packets may occur). In fact, TCP treats data as a series of unstructured byte streams; UDP is message-oriented (no sticky packets will occur)
7. UDP has no congestion control, so congestion on the network will not reduce the sending rate of the source host (useful for real-time applications, such as IP phones, real-time video conferencing, etc.)
8. TCP header overhead is 20 bytes; UDP header overhead is small, only 8 bytes

#### TCP Sticky Packet

##### the reason

TCP is a byte stream-based transmission service (UDP is message-based). "Stream" means that the data transmitted by TCP has no boundaries. So there may be situations where two data packets stick together.

##### Solve

* Send fixed-length packets. If the size of each message is the same, the receiving peer only needs to accumulate the received data until the data is equal to a fixed-length value and treats it as a message.
* Baotou plus package body length. The header is 4 bytes of fixed length, which indicates the length of the packet body. The receiving peer first receives the header length and receives the packet body according to the header length.
* Set boundaries between packets, such as adding special symbols `\r\n` mark. The FTP protocol does just that. The problem is that if the data body also contains `\r\n` , it will be misjudged as the message boundary.
* Use more complex application layer protocols.

#### TCP Flow Control

##### Concept

Flow control is to make the sending rate of the sender not too fast, but to allow the receiver to receive it.

##### Methods

Variable window for flow control

![](https://raw.githubusercontent.com/huihut/interview/master/images/利用可变窗口进行流量控制举例.png)

#### TCP congestion control

##### Concept

Congestion control is to prevent excessive data from being injected into the network, so that the routers or links in the network will not be overloaded.

##### Methods

* Slow start
* Congestion avoidance
* Fast retransmit
* Fast recovery



TCP Congestion control graph

![](https://raw.githubusercontent.com/huihut/interview/master/images/TCP拥塞窗口cwnd在拥塞控制时的变化情况.png)
![](https://raw.githubusercontent.com/huihut/interview/master/images/快重传示意图.png)
![](https://raw.githubusercontent.com/huihut/interview/master/images/TCP的拥塞控制流程图.png)

#### TCP Transmission connection management

> 因为 TCP 三次握手建立连接、四次挥手释放连接很重要，所以附上《计算机网络（第 7 版）-谢希仁》书中对此章的详细描述：<https://raw.githubusercontent.com/huihut/interview/master/images/TCP-transport-connection-management.png>

##### TCP 三次握手建立连接

![UDP 报文](https://raw.githubusercontent.com/huihut/interview/master/images/TCP三次握手建立连接.png)

【Explain the whole process of TCP connection establishment】

1. The client sends a SYN to the server, indicating that the client requests to establish a connection;
2. The server receives the SYN sent by the client and replies with SYN + ACK to the client (agreeing to establish a connection);
3. After receiving the SYN + ACK from the server, the client responds with an ACK to the server (indicating that the client received the consent message sent by the server);
4. The server receives the ACK from the client, the connection is established, and data transmission is possible.

##### Why does TCP have to shake hands three times?

【Answer One】 Because the channel is unreliable, and TCP wants to establish a reliable transmission on the unreliable channel, then three communications is the theoretical minimum. (And UDP does not need to establish a reliable transmission, so UDP does not require a three-way handshake.)

> [Google Groups. Why is TCP a three-way handshake to establish a connection? {Technology} {Network Communication}](https://groups.google.com/forum/#!msg/pongba/kF6O7-MFxM0/5S7zIJ4yqKUJ)

[Answer II] Because both parties need to confirm that the other party has received the serial number sent by themselves, the confirmation process requires at least three communications.

> [Know. Why is TCP a three-way handshake instead of two or four? ](https://www.zhihu.com/question/24853633/answer/115173386)

[Answer three] In order to prevent the invalid connection request segment from being sent to the server suddenly, an error is generated.

> ["Computer Network (7th Edition) -Xie Xiren"](https://raw.githubusercontent.com/huihut/interview/master/images/TCP-transport-connection-management.png)

##### TCP 四次挥手释放连接

![UDP 报文](https://raw.githubusercontent.com/huihut/interview/master/images/TCP四次挥手释放连接.png)

【TCP Four waves to release the connection】

1. The client sends FIN to the server, indicating that the client does not need to send data to the server (request to release the connection from the client to the server);
2. The server receives the FIN sent by the client and replies ACK to the client (agreeing to release the connection from the client to the server);
3. The client receives the ACK from the server, and the connection from the client to the server has been released (but the connection from the server to the client has not been released, and the client can still receive data);
4. The server continues to send the unfinished data to the client;
5. The server sends FIN + ACK to the client, indicating that the server has sent the data (request to release the connection from the server to the client, even if no reply is received from the client, it will be automatically released after a certain period of time);
6. The client receives the FIN + ACK from the server and replies to the client with an ACK (agreeing to release the connection from the server to the client);
7. After receiving the ACK from the client, the server releases the connection from the server to the client.

##### Why does TCP have to wave four times?

[Question 1] Why does TCP wave four times? / Why does TCP need three times to establish a connection and four times to release a connection?

[Answer One] Because TCP is in full-duplex mode, after the client requests to close the connection, the connection from the client to the server is closed (one or two waves), and the server continues to transmit the data that has not been previously transmitted to the client (data transmission) , The connection from the server to the client is closed (waving three or four times). Therefore, when TCP releases the connection, the server's ACK and FIN are sent separately (with data transmission in between), and when the TCP establishes the connection, the server's ACK and SYN are sent together (second handshake), so TCP needs to establish the connection three times. It takes four times to release the connection.

[Question 2] Why can ACK and SYN be sent together when TCP is connected, and ACK and FIN are sent separately when released? (ACK and FIN refer to the second and third wave)

[Answer 2:] When the client requests the release, the server may still have data to transmit to the client, so the server must respond to the client FIN request (the server sends an ACK), and then the data is transmitted. After the transmission is completed, the server then Make a FIN request (the server sends FIN); there is no intermediate data transmission when connecting, so ACK and SYN can be sent together when connecting.

[Question three] Why does the client need TIME-WAIT to wait for 2MSL at the end?

【Answer three】

1. In order to ensure that the last ACK message sent by the client can reach the server. If it fails to arrive, the server will retransmit the FIN + ACK segment overtime, and the client will retransmit the ACK and re-time.
2. Prevent invalid connection request segments from appearing in this connection. When TIME-WAIT lasts 2MSL, all the segments generated during the duration of this connection will disappear from the network, so that the old connection segments will not appear in the next connection.

#### TCP finite state machine

TCP finite state machine picture

![TCP Finite state machine](https://raw.githubusercontent.com/huihut/interview/master/images/TCP的有限状态机.png)

### Application layer

#### DNS

* DNS (Domain Name System) is a service of the Internet. It serves as a distributed database that maps domain names and IP addresses to each other, enabling people to access the Internet more conveniently. DNS uses TCP and UDP port 53. Currently, the limit for the length of each domain name is 63 characters, and the total length of the domain name cannot exceed 253 characters.

domain name:
* `Domain name :: = {<third-level domain name>.<Second-level domain name>.<Top-level domain name>}`, for example: `blog.huihut.com`

#### FTP

* FTP (File Transfer Protocol, file transfer protocol) is a set of standard protocols for file transfer on the network, using the client / server model, using TCP datagrams, providing interactive access, two-way transmission.
* TFTP (Trivial File Transfer Protocol) is a small and easy-to-implement file transfer protocol. It also uses the client-server method and uses UDP datagrams. It only supports file transfers and does not support interaction. User authentication

#### TELNET

* The TELNET protocol is a member of the TCP / IP protocol family and is the standard protocol and main method of the Internet remote login service. It provides users with the ability to complete remote host work on the local computer.

* HTTP (HyperText Transfer Protocol) is a transfer protocol used to transfer hypertext from a WWW (World Wide Web, World Wide Web) server to a local browser.

* SMTP (Simple Mail Transfer Protocol) is a set of rules for transferring mail from the source address to the destination address, which controls the transfer method of the letter. The SMTP protocol belongs to the TCP / IP protocol suite, which helps each computer find the next destination when sending or transferring letters.
* Socket requires at least a pair of port numbers (Socket) to establish a network communication connection. Socket is essentially a programming interface (API), which encapsulates TCP / IP. TCP / IP also provides an interface that programmers can use for network development. This is the Socket programming interface.

#### WWW

* WWW (World Wide Web, World Wide Web, World Wide Web) is a system composed of many hypertext links to each other, accessed via the Internet

##### URL

* URL (Uniform Resource Locator) is a standard resource address (Address) on the Internet

standard format:

* `Protocol type: [// server address [: port number]] [/ resource level UNIX file path] file name [? Query] [# Clip ID]`
    
Complete format:

* `Protocol type: [// [Credential information required to access resources @] server address [: port number]] [/ resource level UNIX file path] file name [? Query] [# segment ID]`

> Among them [access credential information @ ;: port number ;? query; #fragment ID] are all optional items
> For example: `https://github.com/huihut/interview#cc`

##### HTTP

Hypertext Transfer Protocol (HTTP) is an application-layer protocol for distributed, collaborative, and hypermedia information systems. HTTP is the foundation of data communication for the World Wide Web.

Request method

Method | meaning
--- | ---
OPTIONS | Request some option information to allow clients to view server performance
GET | Request the specified page information and return the entity body
HEAD | Similar to a get request, except that there is no specific content in the returned response, which is used to get the header
POST | Submits data to a specified resource for processing requests (such as submitting a form or uploading a file). The data is contained in the request body. POST requests may result in the creation of new resources and / or modification of existing resources
PUT | Data transmitted from the client to the server replaces the contents of the specified document
DELETE | request the server to delete the specified page
TRACE | echo requests received by the server, mainly for testing or diagnostics

Status Code

* 1xx: indicates notification information, such as the request has been received or is being processed
    * 100 Continue: Continue, the client should continue its request
    * 101 Switching Protocols. The server switches protocols according to the client's request. Can only switch to higher-level protocols, for example, to new versions of HTTP
* 2xx: indicates success, such as receiving or knowing
    * 200 OK: The request was successful
* 3xx: indicates a redirect, and further action is required to complete the request
    * 301 Moved Permanently: Move permanently. The requested resource has been permanently moved to the new URL, the returned information will include the new URL, and the browser will automatically be directed to the new URL. Any future requests should use the new URL instead
* 4xx: indicates a customer error, such as incorrect syntax in the request or inability to complete
    * 400 Bad Request: The client requested a syntax error that the server could not understand
    * 401 Unauthorized: request requires user authentication
    * 403 Forbidden: The server understood the request from the requesting client, but refused to execute the request (insufficient permissions)
    * 404 Not Found: The server cannot find the resource (web page) based on the client's request. With this code, the website designer can set a personality page for "the resource you requested could not be found"
    * 408 Request Timeout: The server waited too long for the request sent by the client, timed out
* 5xx: indicates a server error, such as the server failing to complete the request
    * 500 Internal Server Error: Server internal error, unable to complete request
    * 503 Service Unavailable: Due to overload or system maintenance, the server cannot temporarily process the client's request. The length of the delay can be included in the server's Retry-After header
    * 504 Gateway Timeout: The server acting as a gateway or proxy, not receiving requests from the remote server in a timely manner

>More status codes: [Rookie Tutorials. HTTP Status Codes](http://www.runoob.com/http/http-status-codes.html)

##### Other agreements

* SMTP (Simple Main Transfer Protocol, Simple Mail Transfer Protocol) is a standard for transmitting Email over the Internet. It is a relatively simple text-based protocol. One or more recipients of a message are specified on top of it (confirmed to exist in most cases), and the message text is transmitted. You can easily test an SMTP server through a Telnet program. SMTP uses TCP port 25.
* DHCP (Dynamic Host Configuration Protocol) is a network protocol for a local area network. It uses the UDP protocol to work and has two main purposes:
    * For internal network or network service provider to automatically assign IP addresses to users
    * For internal network administrators as a means of central management of all computers
* SNMP (Simple Network Management Protocol) forms part of the Internet protocol family defined by the Internet Engineering Task Force (IETF). The protocol can support a network management system to monitor whether the devices connected to the network have any management concerns.

<a id="network-programming"></a>

## 🌩 Network Programming

### Socket

> [Linux Socket Programming (unlimited Linux）](https://www.cnblogs.com/skynet/archive/2010/12/12/1903949.html)

![Socket Client server communication](https://raw.githubusercontent.com/huihut/interview/master/images/socket客户端服务器通讯.jpg)


#### Socket middle read()、write() function

```cpp
ssize_t read(int fd, void *buf, size_t count);
ssize_t write(int fd, const void *buf, size_t count);
```

##### read()

* The read function is responsible for reading content from fd.
* When the read is successful, read returns the actual number of bytes read.
* If the returned value is 0, it means that the end of the file has been read, and if it is less than 0, an error has occurred.
* If the error is EINTR, the reading is caused by interruption; if it is ECONNREST, there is a problem with the network connection.

##### write ()

* The write function writes the contents of nbytes in buf to the file descriptor fd.
* Returns the number of bytes written when successful. On failure, it returns -1 and sets the errno variable.
* In network programs, there are two possibilities when we write to the socket file descriptor.
* (1) The return value of write is greater than 0, indicating that part or all of the data has been written.
* (2) The returned value is less than 0, and an error has occurred at this time.
* If the error is EINTR, it indicates that an interruption error occurred during writing; if it is EPIPE, it indicates that there is a problem with the network connection (the other party has closed the connection).

#### TCP three-way handshake in socket to establish connection

We know that TCP establishes a connection by performing a "three-way handshake", that is, exchanging three packets. The general process is as follows:

1. The client sends a SYN J to the server
2. The server responds to the client with a SYN K, and confirms SYN J ACK J + 1
3. The client wants the server to send an acknowledgement ACK K + 1

Only the three-way handshake is finished, but what about the three-way handshake in the socket function? Please see the picture below:

![socket Sent in TCP Three handshake](http://images.cnblogs.com/cnblogs_com/skynet/201012/201012122157467258.png)

It can be seen from the figure:
1. When the client calls connect, a connection request is triggered and a SYN J packet is sent to the server. At this time, connect enters a blocking state;
2. The server listens to the connection request, that is, receives the SYN J packet, calls the accept function to receive the request and sends SYN K and ACK J + 1 to the client, then accept enters the blocking state;
3. After the client receives the SYN K of the server, ACK J + 1, connect returns at this time, and confirms the SYN K;
4. When the server receives ACK K + 1, accept returns, so that the three handshake is completed and the connection is established.

#### TCP four-way handshake in socket to release connection

The above describes the three-way handshake establishment process of TCP in socket and the socket functions involved. Now we introduce the process of releasing the connection by the four-way handshake in the socket, please see the following figure:

![socket TCP four-way handshake sent in](http://images.cnblogs.com/cnblogs_com/skynet/201012/201012122157487616.png)

The illustrated process is as follows:

1. An application process first calls close to actively close the connection, then TCP sends a FIN M;
2. After receiving the FIN M, the other end performs a passive close to confirm the FIN. Its reception is also passed to the application process as an end-of-file character, because the reception of FIN means that the application process can no longer receive additional data on the corresponding connection;
3. After a period of time, the application process that received the end-of-file character calls close to close its socket. This causes its TCP to also send a FIN N;
4. The source TCP that received the FIN confirms it.

So there is a FIN and ACK in each direction.

<a id="database"></a>

## 💾 Database

> Part of the knowledge in this section comes from "Introduction to Database Systems (5th Edition)"

### basic concepts

* Data: Symbolic records describing things are called data.
* Database (DB): It is a collection of a large amount of organized, shareable data stored in a computer for a long time, and has three basic characteristics of permanent storage, organization, and shareability.
* Database Management System (DBMS): is a layer of data management software located between the user and the operating system.
* Database system (DBS): is a system consisting of a database, a database management system (and its application development tools), applications, and a database administrator (DBA) to store, manage, process, and maintain data.
* Entity: Objects that exist objectively and can be distinguished from each other are called entities.
* Attribute: An attribute of an entity is called an attribute.
* Key: The set of attributes that uniquely identify an entity is called a key.
* Entity type: Use entity name and its attribute name set to abstract and characterize similar entities, called entity type.
* Entity set: A set of the same entity type is called an entity set.
* Relationship: The relationship between entities usually refers to the connection between different sets of entities.
* Schema: A schema is also called a logical schema. It is a description of the logical structure and characteristics of the entire database data. It is a common data view for all users.
* External schema: External schema is also called subschema or user schema. It is a description of the logical structure and characteristics of local data that database users (including application programmers and end users) can see and use. A database user's data view is a logical representation of data related to an application.
* Internal schema: Internal schema is also called storage schema. A database has only one internal schema. It is a description of the physical structure and storage of the data, and the way the database is organized within the database.

### Common data models

* Hierarchical model
* Network model
* Relational model
     * Relation (relation): a relation corresponds to a table
     * Tuple: a row in the table is a tuple
     * Attribute (attribute): a column in the table is an attribute
     * Key: A certain attribute group of a tuple can be uniquely identified in the table
     * Domain (domain): a set of values of the same data type
     * Component: an attribute value in a tuple
     * Relation mode: description of the relationship, generally expressed as `relation name (attribute 1, attribute 2, ..., attribute n)`
* Object oriented data model
* Object relational data model
* Semistructured data model

### Common SQL Operations

<table>
  <tr>
    <th> Object type </ th>
    <th> Object </ th>
    <th> Type of operation </ th>
  </ tr>
  <tr>
    <td rowspan = "4"> Database mode </ td>
    <td> Mode </ td>
    <td> <code> CREATE SCHEMA </ code> </ td>
  </ tr>
  <tr>
    <td> Basic table </ td>
    <td> <code> CREATE SCHEMA </ code>, <code> ALTER TABLE </ code> </ td>
  </ tr>
    <tr>
    <td> View </ td>
    <td> <code> CREATE VIEW </ code> </ td>
  </ tr>
    <tr>
    <td> Index </ td>
    <td> <code> CREATE INDEX </ code> </ td>
  </ tr>
    <tr>
    <td rowspan="2"> Data </ ​​td>
    <td> Basic tables and views </ td>
    <td> <code> SELECT </ code>, <code> INSERT </ code>, <code> UPDATE </ code>, <code> DELETE </ code>, <code> REFERENCES </ code>, <code > ALL PRIVILEGES </ code> </ td>
  </ tr>
    <tr>
    <td> Attribute column </ td>
    <td> <code> SELECT </ code>, <code> INSERT </ code>, <code> UPDATE </ code>, <code> REFERENCES </ code>, <code> ALL PRIVILEGES </ code> </ td>
  </ tr>
</table>

> SQL Grammar Tutorial: [runoob . SQL Tutorial](http://www.runoob.com/sql/sql-tutorial.html)

### Relational Database

* Basic relation operations: query (selection, projection, connection (equivalent connection, natural connection, outer connection (left outer connection, right outer connection)), division, union, difference, intersection, Cartesian product, etc.), insertion, deletion ,modify
* Three types of integrity constraints in the relationship model: entity integrity, referential integrity, user-defined integrity

#### Index

* Database index: sequential index, B + tree index, hash index
* [Data structure and algorithm principle behind MySQL index](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)

### Database integrity

* Database integrity refers to the correctness and compatibility of data.
    * Integrity: To prevent non-semantic (incorrect) data from the database.
    * Security: In order to protect the database from malicious damage and illegal access.
* Trigger: is a special event-driven process defined by the user in the relational table.

### Relational data theory

* Data dependency is a constraint relationship between the internal attributes and attributes of a relationship. It is a correlation between data that is reflected by the equality of the values ​​between attributes.
* The most important data dependencies: function dependencies, multi-value dependencies.

#### Paradigm

* First Normal Form (1NF): The attribute (field) is the smallest unit and cannot be separated.
* The second normal form (2NF): meet 1NF, each non-primary attribute completely depends on the primary key (eliminating the partial function dependence of 1NF non-primary attribute on the code).
* The third normal form (3NF): 2NF is satisfied, and any non-primary attribute does not depend on other non-primary attributes (eliminating the 2NF non-primary attribute's transfer function dependence on the code).
* Bowies-Kode Normal Form (BCNF): Satisfy 3NF, any non-primary attribute cannot depend on the subset of primary keys (eliminating the 3NF primary attribute's dependence on the code part and transfer function)
* The fourth normal form (4NF): meet 3NF, there must be non-trivial and non-functional dependent multi-value dependencies between attributes (eliminating 3NF non-trivial and non-functional multi-value dependencies).

### Database Recovery

* Transaction: It is a user-defined sequence of database operations. These operations are either all done or not done at all. It is an indivisible unit of work.
* ACID characteristics of things: atomicity, consistency, isolation, persistence.
* Implementation technology of recovery: establish redundant data-> use redundant data to implement database recovery.
* Common techniques for establishing redundant data: data dumps (dynamic mass dumps, dynamic incremental dumps, static mass dumps, static incremental dumps), registration log files.

### Concurrency control

* Transactions are the basic unit of concurrency control.
* Data inconsistencies caused by concurrent operations include: lost modifications, non-repeatable reads, and "dirty" data reads.
* The main technologies of concurrency control: blocking, timestamp, optimistic control method, multi-version concurrency control, etc.
* Basic lock types: exclusive lock (X lock / write lock), shared lock (S lock / read lock).
* Livelock deadlock:
    * Livelock: The transaction is always in a waiting state, which can be avoided through a first come, first served policy.
    * Deadlock: The transaction can never end
        * Prevention: one-time block method, sequential block method;
        * Diagnosis: timeout method, waiting graph method;
        * Cancel: Undo the transaction with the least deadlock cost and release all the locks of this transaction, so that other transactions can continue to run.
* Serializable scheduling: The concurrent execution of multiple transactions is correct if and only if the result is the same as when the transactions are executed serially in a certain order. Guidelines for correct scheduling of concurrent transactions when serializable.

<a id="design-pattern"></a>

## 📏 Design pattern

> Examples of major design patterns: [CSDN column. C ++ Design Patterns](https://blog.csdn.net/liang19890820/article/details/66974516) series of blog posts

[Design Pattern Project Catalog](DesignPattern)

### Singleton mode

[Singleton Pattern Example](DesignPattern/SingletonPattern)

### Abstract factory pattern

[Abstract Factory Pattern Example](DesignPattern/AbstractFactoryPattern)

### Adapter Mode

[Adapter pattern example](DesignPattern/AdapterPattern)

### Bridge mode

[Bridge pattern example](DesignPattern/BridgePattern)

### Observer mode

[Example of Observer Pattern](DesignPattern/ObserverPattern)

### Six Principles of Design Patterns

* Single Responsibility Principle (SRP)
* Liskov Substitution Principle (LSP)
* Dependence Inversion Principle (DIP)
* Interface Segregation Principle (ISP)
* Law of Demeter (LoD)
* Open Close Principle (OCP)

<a id="link-loading-library"></a>

## ⚙️ Link Loading Library

> Part of the knowledge in this section comes from "Programmer's Self-Cultivation-Link Loading Library"

### memory, stack, heap

The general application memory space has the following areas:

* Stack: Automatically allocated and released by the operating system, storing function parameter values, local variable values, etc., used to maintain the context of function calls
* Heap: Generally allocated and released by the programmer. If the programmer does not release, it may be recycled by the operating system at the end of the program to accommodate the dynamically allocated memory area of ​​the application.
* Executable image: Stores the image of the executable file in memory. Loading by the loader is to read or map the memory of the executable file here.
* Reserved area: The reserved area is not a single memory area, but a general term for memory areas that are protected from access in the memory. For example, in C, the invalid pointer is assigned a value of 0 (NULL), so the 0 address is normal. Impossible to access data efficiently

#### stack

The stack stores the maintenance information required for a function call. It is often called a stack frame or an active record. It generally contains the following aspects:

* Function return address and parameters
* Temporary variables: including non-static local variables of functions and other temporary variables automatically generated by the compiler
* Save context: including registers that need to remain unchanged before and after function calls

#### Heap

Heap allocation algorithm:

* Free List
* Bitmap
* Object pool

#### "Segment fault" or "Illegal operation, this memory address cannot be read / write"

Errors caused by typical illegal pointer dereferencing. This error occurs when the pointer points to a memory address that is not allowed to read and write, and the program attempts to use the pointer to read or write that address.

Common reasons:

* Initialize the pointer to NULL, then start using the pointer without giving it a reasonable value
* There is no need to initialize the pointer in the stack. The value of the pointer will generally be a random number. After that, the pointer is used directly.

### Compile and link

#### File formats for each platform

Platform | Executables | Objects | Dynamic Libraries / Shared Objects | Static Libraries
---|---|---|---|---
Windows|exe|obj|dll|lib
Unix/Linux|ELF、out|o|so|a
Mac|Mach-O|o|dylib、tbd、framework|a、framework

#### Compile and link process

1. Pre-compilation (pre-compiler processes pre-compilation instructions such as `# include`,` # define` and generates `.i` or` .ii` files)
2. Compile (the compiler performs lexical analysis, syntax analysis, semantic analysis, intermediate code generation, object code generation, optimization, and generation of `.s` files)
3. Assembly (the assembler translates the assembly code into machine code and generates a `.o` file)
4. Linking (connectors perform address and space allocation, symbol resolution, relocation, and generate `.out` files)

> The current version of GCC combines pre-compilation and compilation into one step, pre-compiled compiler cc1, assembler as, linker ld

> MSVC compilation environment, compiler cl, linker link, executable file viewer dumpbin

#### target document

The files generated by the compiler after compiling the source code are called object files. The object file is structurally speaking, it is a compiled executable file format, but the linking process has not yet been performed, and some symbols or addresses may not be adjusted.

> Executable files (`.exe` for Windows and` ELF` for Linux), dynamic link libraries (`.dll` for Windows and` .so` for Linux), static link libraries (`.lib` for Windows and Linux `.A`) are stored according to the executable file format (Windows according to PE-COFF, Linux according to ELF)

##### Object file format

* Windows PE (Portable Executable), or PE-COFF, `.obj` format
* Linux's ELF (Executable Linkable Format), `.o` format
* Intel / Microsoft OMF (Object Module Format)
* Unix `a.out` format
* MS-DOS `.COM` format

> PE and ELF are both COFF (Common File Format) variants

##### Object file storage structure

Segment | Function
--- | ---
File Header | File header, describing the file attributes of the entire file (including whether the file is executable, is it statically linked or dynamically linked with the entry address, target hardware, target operating system, etc.)
.text section | Code section, machine code compiled by the execution statement
.data section | Data section, initialized global and local static variables
.bss section | BSS section (Block Started by Symbol), uninitialized global and local static variables (because the default value is 0, so it is only reserved here and does not take up space)
.rodata section | Read-only data section, which stores read-only data, generally read-only variables (such as const-modified variables) and string constants in the program
.comment section | Comment section for compiler version information
.note.GNU-stack section | Stack hint section

> Other paragraphs omitted

#### Linked Interface-Symbol

In the link, the object files are actually a reference to the address between the object files, that is, a reference to the address of a function and a variable. We collectively refer to functions and variables as Symbols, and function names or variable names are Symbol Names.

The following Symbol Table:

Symbol (Symbol Name) | Symbol Value (Address)
--- | ---
main| 0x100
Add | 0x123
... | ...

### Shared Library for Linux

Shared libraries under Linux are ordinary ELF shared objects.

The shared library version update should ensure the compatibility of the binary interface ABI (Application Binary Interface)

#### Name

`libname.so.x.y.z`

* x: major version number, libraries with different major version numbers are not compatible and need to be recompiled
* y: minor version number, higher version number is backward compatible with lower version number
* z: release version number, no interface changes, fully compatible

#### path

Most open source systems, including Linux, follow the FHS (File Hierarchy Standard) standard. This standard specifies how system files are stored, including various directory structures, organizations, and roles.

* `/lib`: Stores the most critical and basic shared libraries of the system, such as dynamic linker, C language runtime library, math library, etc.
* `/usr/lib`: Stores key libraries required by non-system runtime, mainly development libraries
* `/usr/local/lib`: Stores libraries that are not very relevant to the operating system itself, mainly libraries for some third-party applications

> The dynamic linker looks for shared libraries in `/ lib`, `/usr/lib`, and specified by the `/etc/ld.so.conf` configuration file

#### Environment variables

* `LD_LIBRARY_PATH`: temporarily change the shared library search path of an application without affecting other applications
* `LD_PRELOAD`: specify some shared libraries or even object files that are pre-loaded
* `LD_DEBUG`: Turn on the debugging function of the dynamic linker

#### So shared library writing

Writing shared libraries with CLion

Create a shared library named MySharedLib

CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)
project(MySharedLib)

set(CMAKE_CXX_STANDARD 11)

add_library(MySharedLib SHARED library.cpp library.h)
```

library.h

```cpp
#ifndef MYSHAREDLIB_LIBRARY_H
#define MYSHAREDLIB_LIBRARY_H

// print Hello World!
void hello();

// Sum using variable template parameters
template <typename T>
T sum(T t)
{
    return t;
}
template <typename T, typename ...Types>
T sum(T first, Types ... rest)
{
    return first + sum<T>(rest...);
}

#endif
```

library.cpp

```cpp
#include <iostream>
#include "library.h"

void hello() {
    std::cout << "Hello, World!" << std::endl;
}
```

#### use of so shared library (called by executable project)

Use CLion to call a shared library

Create an executable project named TestSharedLib

CMakeLists.txt

```cmake
cmake_minimum_required (VERSION 3.10)
project (TestSharedLib)

# C ++ 11 compile
set (CMAKE_CXX_STANDARD 11)

# Header file path
set (INC_DIR / home / xx / code / clion / MySharedLib)
# Library file path
set (LIB_DIR / home / xx / code / clion / MySharedLib / cmake-build-debug)

include_directories(${INC_DIR})
link_directories(${LIB_DIR})
link_libraries(MySharedLib)

add_executable(TestSharedLib main.cpp)

# link MySharedLib Library
target_link_libraries(TestSharedLib MySharedLib)
```

main.cpp

```cpp
#include <iostream>
#include "library.h"
using std::cout;
using std::endl;

int main() {

    hello();
    cout << "1 + 2 = " << sum(1,2) << endl;
    cout << "1 + 2 + 3 = " << sum(1,2,3) << endl;

    return 0;
}
```

Results

```
Hello, World!
1 + 2 = 3
1 + 2 + 3 = 6
```

### Windows Application entry function

* GUI（Graphical User Interface) application, linker options:`/SUBSYSTEM:WINDOWS`
* CUI（Console User Interface) application, linker options：`/SUBSYSTEM:CONSOLE`

_tWinMain versus _tmain Function declaration

```cpp
Int WINAPI _tWinMain(
    HINSTANCE hInstanceExe,
    HINSTANCE,
    PTSTR pszCmdLine,
    int nCmdShow);

int _tmain(
    int argc,
    TCHAR *argv[],
    TCHAR *envp[]);
```

Application Type | Entry Point Function | Embedded Startup Function
--- | --- | ---
GUI application for processing ANSI characters (strings) | _tWinMain (WinMain) | WinMainCRTSartup
GUI application for handling Unicode characters (strings) | _tWinMain (wWinMain) | wWinMainCRTSartup
CUI application that handles ANSI characters (strings) | _tmain (Main) | mainCRTSartup
CUI application for handling Unicode characters (strings) | _tmain (wMain) | wmainCRTSartup
Dynamic-Link Library | DllMain | _DllMainCRTStartup

### Dynamic-Link Library for Windows

> Part of the knowledge comes from "Windows Core Programming (Fifth Edition)"

#### Uses

* Expanded application features
* Simplified project management
* Helps save memory
* Promote the sharing of resources
* Improved localization
* Helps resolve differences between platforms
* Can be used for special purposes

#### Note

* Creating a DLL is actually creating a function that can be called by an executable module
* When a module provides a memory allocation function (malloc, new), it must also provide another memory release function (free, delete)
* When mixing C and C++, use the extern "C" modifier
* A DLL can export functions, variables (to avoid export), C++ classes (export and import need to be the same as the compiler, otherwise avoid export)
* DLL module: __declspec (dllexport) in the cpp file is written before the include header file
* Calling DLL's executable module: __declspec (dllimport) of the cpp file should not define MYLIBAPI before

#### Search order for loading Windows programs

1. Directory containing executable files
2. The system directory of Windows can be obtained through GetSystemDirectory
3. 16-bit system directory, the System subdirectory in the Windows directory
4. The Windows directory can be obtained through GetWindowsDirectory
5. The current directory of the process
6. Directories listed in the PATH environment variable

#### DLL Entry function

DllMain function

```cpp
BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved)
{
    switch(fdwReason)
    {
    case DLL_PROCESS_ATTACH:
        // Called when mapping a DLL to the process address space for the first time
        // The DLL is being mapped into the process' address space.
        break;
    case DLL_THREAD_ATTACH:
        // When the process creates a thread, it is used to tell the DLL to perform thread-related initialization (non-main thread execution)
        // A thread is bing created.
        break;
    case DLL_THREAD_DETACH:
        // The system calls ExitThread before the thread exits, the thread that is about to be terminated performs thread-related cleanup by telling the DLL
        // A thread is exiting cleanly.
        break;
    case DLL_PROCESS_DETACH:
        // Called when a DLL is removed from the process's address space
        // The DLL is being unmapped from the process' address space.
        break;
    }
    
    return (TRUE); // Used only for DLL_PROCESS_ATTACH
}
```

#### Load and unload library

LoadLibrary、LoadLibraryExA、LoadPackagedLibrary、FreeLibrary、FreeLibraryAndExitThread Function declaration

```cpp
// load library
HMODULE WINAPI LoadLibrary (
  _In_ LPCTSTR lpFileName
);
HMODULE LoadLibraryExA (
  LPCSTR lpLibFileName,
  HANDLE hFile,
  DWORD dwFlags
);
// To load a Win32 DLL in a Universal Windows Platform (UWP) application, you need to call LoadPackagedLibrary instead of LoadLibrary or LoadLibraryEx
HMODULE LoadPackagedLibrary (
  LPCWSTR lpwLibFileName,
  DWORD Reserved
);

// uninstall library
BOOL WINAPI FreeLibrary (
  _In_ HMODULE hModule
);
// Unload the library and exit the thread
VOID WINAPI FreeLibraryAndExitThread(
  _In_ HMODULE hModule,
  _In_ DWORD   dwExitCode
);
```

#### Display link to export symbol

GetProcAddress function declaration

```cpp
FARPROC GetProcAddress (
  HMODULE hInstDll,
  PCSTR pszSymbolName // Can only accept ANSI strings, not Unicode
);
```

#### DumpBin.exe View DLL information

Use `DumpBin.exe` in the` VS Developer Command Prompt` to view the exported section of the DLL library (exported variables, functions, symbols of class names), relative virtual addresses (RVA). Such as:
```
DUMPBIN -exports D: \ mydll.dll
```

#### Flow chart of LoadLibrary and FreeLibrary

LoadLibrary and FreeLibrary flowchart

##### LoadLibrary

![WindowsLoadLibrary](https://raw.githubusercontent.com/huihut/interview/master/images/WindowsLoadLibrary.png)

##### FreeLibrary

![WindowsFreeLibrary](https://raw.githubusercontent.com/huihut/interview/master/images/WindowsFreeLibrary.png)

#### Writing of DLL library (export a DLL module)

Writing DLL library (export a DLL module)
DLL header file

```cpp
// MyLib.h

#ifdef MYLIBAPI

// MYLIBAPI should be defined before include "Mylib.h" in all DLL source files
// All functions / variables are being exported

#else

// This header file is included by an exe source code module, which means that all functions / variables are imported
#define MYLIBAPI extern "C" __declspec (dllimport)

#endif

// Define any data structure and symbol here

// Define exported variables (avoid exporting variables)
MYLIBAPI int g_nResult;

// Define the prototype of the exported function
MYLIBAPI int Add(int nLeft, int nRight);
```

DLL source files

```cpp
// MyLibFile1.cpp

// Contains standard Windows and C runtime header files
#include <windows.h>

// Functions and variables exported from DLL source files
#define MYLIBAPI extern "C" __declspec (dllexport)

// Contains exported data structures, symbols, functions, variables
#include "MyLib.h"

// Put the code of this DLL source code file here
int g_nResult;

int Add(int nLeft, int nRight)
{
    g_nResult = nLeft + nRight;
    return g_nResult;
}
```

#### Use of DLL library (dynamic link DLL at runtime)

Use of DLL libraries (dynamically linking DLLs at runtime)

```cpp
// A simple program that uses LoadLibrary and 
// GetProcAddress to access myPuts from Myputs.dll. 
 
#include <windows.h> 
#include <stdio.h> 
 
typedef int (__cdecl *MYPROC)(LPWSTR); 
 
int main( void ) 
{ 
    HINSTANCE hinstLib; 
    MYPROC ProcAdd; 
    BOOL fFreeResult, fRunTimeLinkSuccess = FALSE; 
 
    // Get a handle to the DLL module.
 
    hinstLib = LoadLibrary(TEXT("MyPuts.dll")); 
 
    // If the handle is valid, try to get the function address.
 
    if (hinstLib != NULL) 
    { 
        ProcAdd = (MYPROC) GetProcAddress(hinstLib, "myPuts"); 
 
        // If the function address is valid, call the function.
 
        if (NULL != ProcAdd) 
        {
            fRunTimeLinkSuccess = TRUE;
            (ProcAdd) (L"Message sent to the DLL function\n"); 
        }
        // Free the DLL module.
 
        fFreeResult = FreeLibrary(hinstLib); 
    } 

    // If unable to call the DLL function, use an alternative.
    if (! fRunTimeLinkSuccess) 
        printf("Message printed from executable\n"); 

    return 0;
}
```

### Runtime（Runtime Library）

#### Typical program operation steps

1. The operating system creates a process and passes control to the entry point of the program (often an entry function in the runtime library)
2. The entry function initializes the runtime library and program running environment (including heap, I / O, threads, global variable construction, etc.).
3. After the entry function is initialized, the main function is called to officially start executing the main part of the program.
4. After the main function finishes executing, return to the entry function for cleanup (including global variable destruction, heap destruction, closing I / O, etc.), and then make a system call to end the process.

> I / O of a program refers to the interaction between the program and the outside world, including files, management programs, network, command line, signals, etc. More broadly, I / O refers to what the operating system understands as a "file."

#### glibc entry

`_start-> __libc_start_main-> exit-> _exit`

The `main (argc, argv, __environ)` function is executed in `__libc_start_main`.

#### MSVC CRT Entry

`int mainCRTStartup (void)`

Do the following:

1. Initialize global variables related to the OS version.
2. Initialize the heap.
3. Initialize I / O.
4. Get command line parameters and environment variables.
5. Initialize some data of the C library.
6. Call main and record the return value.
7. Check for errors and return the return value of main.

#### C Language Runtime (CRT)

It contains the following functions:

* Start and exit: including entry functions and other functions on which entry functions depend.
* Standard functions: There are functions implemented by the C language standard library specified by the C language standard.
* I/O: Encapsulation and implementation of I / O functions.
* Heap: Encapsulation and implementation of the heap.
* Language implementation: implementation of some special functions in the language.
* Debugging: Code that implements debugging functions.

#### C Language Standard Library (ANSI C)

contain:

* Standard input and output (stdio.h)
* File operations (stdio.h)
* Character manipulation (ctype.h)
* String operations (string.h)
* Mathematical functions (math.h)
* Resource Management (stdlib.h)
* Format conversion (stdlib.h)
* Time / Date (time.h)
* Assertions (assert.h)
* Constants on various types (limits.h & float.h)
* Variable length parameter (stdarg.h)
* Non-local jump (setjmp.h)

<a id="books"></a>

## 📚 Books

> [huihut/CS-Books](https://github.com/huihut/CS-Books)：📚 Computer Technology Books PDF

### Language

* "C ++ Primer"
* "Effective C ++"
* "More Effective C ++"
* "Exploring the C ++ Object Model"
* "Understanding C ++ 11"
* "Anatomy of STL Source Code"

### Algorithm

* "Sword Finger Offer"
* "Programming Pearls"
* "Programmer Interview Collection"

### System

* "Understanding Computer Systems"
* "Windows Core Programming"
* "Advanced Programming in the Unix Environment"

### The internet

* "Unix Network Programming"
* "Detailed Explanation of TCP / IP"

### Other

* "The Self-Cultivation of Programmers"

<a id="cc-development-direction"></a>

## 🔱 C / C ++ Development Direction

> The development direction of C / C ++ is very wide, including not limited to the following directions. The following are some of the requirements for recruiting positions of big factories and schools.

### Backend / Server

[Backend Development]

* Solid basic programming skills, master C / C ++ / JAVA and other development languages, commonly used algorithms and data structures;
* Familiar with TCP / UDP network protocol and related programming, inter-process communication programming;
* Understanding Python, Shell, Perl and other scripting languages;
* Understand MYSQL, SQL language, programming, NoSQL, key-value storage principle;
* Comprehensive and solid software knowledge structure, mastering professional knowledge of operating systems, software engineering, design patterns, data structures, database systems, and network security;
* Understand the knowledge of distributed system design and development, load balancing technology, system disaster recovery design, and high availability systems.

### Desktop Client

[PC client development]

* Bachelor degree or above in computer software, majoring in programming, solid foundation, understanding of algorithms and data structure;
* Familiar with memory management, file system, process thread scheduling of windows operating system;
* Familiar with MFC / windows interface implementation mechanism, proficient in VC, proficient in C / C ++, proficient in STL, and network programming experience under Windows;
* Familiar with Windows client development and debugging, Windows application software development experience is preferred;
* Passionate about innovation and solving challenging problems, with good algorithm foundation and system analysis ability.

### Graphics / Game / VR / AR

[Game Client Development]

* Bachelor degree or above in computer science / engineering major, passion for programming, solid foundation, understanding of algorithms, data structure, software design related knowledge;
* At least one programming language commonly used in game development, C ++ / C # programming experience is preferred;
* Experience with game engines (such as Unity, Unreal) is preferred;
* Knowledge of game client technology (such as graphics, audio, animation, physics, artificial intelligence, network synchronization) is preferred;
* Passionate about innovation and solving challenging problems, strong learning ability, analytical and problem solving skills, and a good sense of teamwork;
* Ability to read English technical documents;
* Love games.

### Test Development

[Test Development]

* Bachelor degree or above in computer or related field;
* One to two years of programming experience in C / C ++ / Python or other computer languages;
* Ability to write test plans, test cases, and achieve performance and safety tests;
* Ability to implement automated systems;
* Ability to locate and investigate product defects and code-level debugging defects;
* Work proactively, have a sense of responsibility, and have a good team spirit.

### Cyber Security / Reverse

[safety technology]

* Love the Internet, have a passionate pursuit of operating systems and network security, and professionalism is not limited;
* Familiar with vulnerability mining, network security attack and defense technologies, and common hacking techniques;
* Master basic development skills and be proficient in C / C ++ language;
* Have a good grasp of database, operating system and network principles;
* Experience in software reverse, network security attack and defense or security system development is preferred.

### Embedded / IoT

[Embedded Application Development]

* Have a good programming foundation, proficient in C / C ++ language;
* Master the necessary knowledge for software development such as operating system and data structure;
* Strong communication and understanding ability and good teamwork awareness;
* Development experience on Linux / Android system platform is preferred.

### Audio / Video / Streaming / SDK

[Audio and video codec]

1. Master's degree or above, computer, signal processing, mathematics, information and related majors and directions;
2. Solid video coding and decoding foundation, familiar with commonly used HEVC or H264, have a good digital signal processing foundation;
3. Master C / C ++, strong code ability, familiar with an assembly language is preferred;
4. Strong English literature reading ability;
5. Strong learning ability, teamwork spirit, and strong resistance to stress.

### Computer Vision / Machine Learning

[Computer Vision Research]

* Computer, applied mathematics, pattern recognition, artificial intelligence, automatic control, statistics, operations research, bioinformatics, physics / quantum computing, neuroscience, sociology / psychology and other majors, image processing, pattern recognition, machine learning related research Direction, undergraduate and above, doctoral degree is preferred;
* Proficient in basic algorithms and applications related to computer vision and image processing;
* Strong algorithm implementation ability, proficient in C / C ++ programming, familiar with at least one programming language of Shell / Python / Matlab;
* Publication of papers in computer vision, pattern recognition and other academic conferences or journals, awards in relevant international competitions, and related patents are preferred.

<a id="review-of-brush-questions-website"></a>

## 💯 Review brush question website

* [cplusplus](http://www.cplusplus.com/)
* [cppreference](https://zh.cppreference.com/w/%E9%A6%96%E9%A1%B5)
* [runoob](http://www.runoob.com/cplusplus/cpp-tutorial.html)
* [leetcode](https://leetcode.com/) | [leetcode-cn](https://leetcode-cn.com/)
* [lintcode](https://www.lintcode.com/)
* [nowcoder](https://www.nowcoder.net/)

<a id="interview-questions-experience"></a>

## 📝 Interview Question Experience

* [Nowcoder.com's summary of the 2020 autumn tricks! (Post division)](https://www.nowcoder.com/discuss/205497)
* [【Preparation for Autumn Moves】 Raiders for 2020 Autumn Moves](https://www.nowcoder.com/discuss/197116)
* [2019 School Recruitment Summary! 【Daily Update】](https://www.nowcoder.com/discuss/90907)
* [2019 School Recruitment Technology Posts Summary [Technology]](https://www.nowcoder.com/discuss/146655)
* [2018 School Recruitment Questions Summary](https://www.nowcoder.com/discuss/68802)
* [2017 Autumn Campus Recruitment Pen and Face Summaries](https://www.nowcoder.com/discuss/12805)
* [The most complete collection of 2017 spring tricks in history!!](https://www.nowcoder.com/discuss/25268)
* [Interview questions are here](https://www.nowcoder.com/discuss/57978)
* [zhihu. On the Internet job search, what well-written and attentive face have you seen? It is best to share your own facial and mental journey. ](https://www.zhihu.com/question/29693016)
* [zhihu. What are the most common interview algorithm questions for internet companies? ](https://www.zhihu.com/question/24964987)
* [CSDN. C ++ Interview Questions Completely Organized](http://blog.csdn.net/ljzcome/article/details/574158)
* [CSDN. Baidu R & D interview questions (C ++ direction)](http://blog.csdn.net/Xiongchao99/article/details/74524807?locationNum=6&fps=1)
* [CSDN. C ++ 30 common interview questions](http://blog.csdn.net/fakine/article/details/51321544)
* [CSDN. Tencent 2016 intern interview experience (already got offer)](http://blog.csdn.net/onever_say_love/article/details/51223886)
* [cnblogs. C ++ Interview Collection (Questions Asked for Interview)](https://www.cnblogs.com/Y1Focus/p/6707121.html)
* [cnblogs. C / C ++ written and interview questions summary](https://www.cnblogs.com/fangyukuan/archive/2010/09/18/1829871.html)
* [cnblogs. Summary of common C ++ interview questions and basic knowledge points (1)](https://www.cnblogs.com/LUO77/p/5771237.html)
* [segmentfault. Summary of common interview questions in C ++](https://segmentfault.com/a/1190000003745529)

<a id="recruitment-time-post"></a>

## 📆 Recruiting time posts

* [nowcoder . Enterprise Recruitment Schedule](https://www.nowcoder.com/school/schedule)

<a id="recommend"></a>

## 👍 Recommend

* [Github. CyC2018 / Job-Recommend](https://github.com/CyC2018/Job-Recommend): 🔎 Internet internal push information (social recruitment, school recruitment, internship)
* [Github. Amusi / AI-Job-Recommend](https://github.com/amusi/AI-Job-Recommend): direction of artificial intelligence of domestic companies (including machine learning, deep learning, computer vision and natural language processing) Job recruitment information (including full-time, internship and school recruitment)

<a id="contributor"></a>

## 👬 Contributor

<a href="https://github.com/huihut/interview/graphs/contributors"><img src="https://opencollective.com/interview/contributors.svg?button=false" /></a>

<a id="support-sponsor"></a>

## 🍭 Support sponsorship

**[Avalive](https://store.steampowered.com/app/1137770/Avalive/)** - A avatar role-playing software for facial capture.

<a id="license"></a>

## 📜 License

This repository follows the CC BY-NC-SA 4.0 (signed-non-commercial use-shared in the same way) agreement, please indicate the source when reprinting, and should not be used for commercial purposes.

[![CC BY-NC-SA 4.0](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](https://github.com/huihut/interview/blob/master/LICENSE)
