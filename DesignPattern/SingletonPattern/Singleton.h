//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_SINGLETON_H
#define DESIGNPATTERN_SINGLETON_H

// Singleton mode
class Singleton {
private:
    Singleton(){}
    ~Singleton(){}
    Singleton(const Singleton &);
    Singleton & operator= (const Singleton &);

public:
    static Singleton & GetInstance()
    {
        static Singleton instance;
        return instance;
    }
    void DoSomething();
};

#endif //DESIGNPATTERN_SINGLETON_H
