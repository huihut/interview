//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_CONCRETE_OBSERVER_H
#define DESIGNPATTERN_CONCRETE_OBSERVER_H

#include "observer.h"
#include <iostream>
#include <string>

class ConcreteObserver : public IObserver
{
public:
    ConcreteObserver(std::string name) { m_strName = name; }
    void Update(float price)
    {
        std::cout << m_strName << " - price" << price << "\n";
    }

private:
    std::string m_strName;  // name
};

#endif //DESIGNPATTERN_CONCRETE_OBSERVER_H
