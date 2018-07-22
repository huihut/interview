//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_CONCRETE_SUBJECT_H
#define DESIGNPATTERN_CONCRETE_SUBJECT_H

#include "subject.h"
#include "observer.h"
#include <iostream>
#include <list>

// 具体主题
class  ConcreteSubject : public ISubject
{
public:
    ConcreteSubject(){ m_fPrice = 10.0; }
    void SetPrice(float price)
    {
        m_fPrice = price;
    }
    void Attach(IObserver * observer)
    {
        m_observers.push_back(observer);
    }
    void Detach(IObserver * observer)
    {
        m_observers.remove(observer);
    }
    // 通知所有观察者
    void Notify()
    {
        std::list<IObserver *>::iterator it = m_observers.begin();
        while (it != m_observers.end())
        {
            (*it)->Update(m_fPrice);
            ++it;
        }
    }
private:
    std::list<IObserver *> m_observers; // 观察者列表
    float m_fPrice;                     // 价格
};

#endif //DESIGNPATTERN_CONCRETE_SUBJECT_H
