//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_CONCRETE_SUBJECT_H
#define DESIGNPATTERN_CONCRETE_SUBJECT_H

#include "subject.h"
#include "observer.h"
#include <iostream>
#include <list>

// Specific Subject
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
    // Notify all observers
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
    std::list<IObserver *> m_observers; // Observer list
    float m_fPrice;                     // Price
};

#endif //DESIGNPATTERN_CONCRETE_SUBJECT_H
