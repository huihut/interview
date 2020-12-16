//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H
#define DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H

#include "implementor.h"
#include <iostream>

// Electric lights
class Light : public IElectricalEquipment
{
public:
    // Turn on the lights
    virtual void PowerOn() override
    {
        std::cout << "Light is on." << std::endl;
    }
    // Turn off the lights
    virtual  void PowerOff() override
    {
        std::cout << "Light is off." << std::endl;
    }
};

// Electric Fan
class Fan : public IElectricalEquipment
{
public:
    // Turn on the fan
    virtual void PowerOn() override
    {
        std::cout << "Fan is on." << std::endl;
    }
    // Turn off the fan
    virtual  void PowerOff() override
    {
        std::cout << "Fan is off." << std::endl;
    }
};


#endif //DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H
