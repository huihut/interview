//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_ADAPTEE_H
#define DESIGNPATTERN_ADAPTEE_H

#include <iostream>

// Built-in charger (two-leg flat type)
class OwnCharger
{
public:
    void ChargeWithFeetFlat()
    {
        std::cout << "OwnCharger::ChargeWithFeetFlat\n";
    }
};

#endif //DESIGNPATTERN_ADAPTEE_H
