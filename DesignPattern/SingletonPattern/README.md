# 单例模式

```cpp
// 懒汉式单例模式
class Singleton
{
private:
	Singleton() { }
	static Singleton * pInstance;
public:
	static Singleton * GetInstance()
	{
		if (pInstance == nullptr)
			pInstance = new Singleton();
		return pInstance;
	}
};

// 线程安全的单例模式
class Singleton
{
private:
	Singleton() { }
	~Singleton() { }
	Singleton(const Singleton &);
	Singleton & operator = (const Singleton &);
public:
	static Singleton & GetInstance()
	{
		static Singleton instance;
		return instance;
	}
};
```