//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H
#define DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H

#include "implementor.h"
#include <iostream>

// 电灯
class Light : public IElectricalEquipment
{
public:
    // 开灯
    virtual void PowerOn() override
    {
        std::cout << "Light is on." << std::endl;
    }
    // 关灯
    virtual  void PowerOff() override
    {
        std::cout << "Light is off." << std::endl;
    }
};

// 风扇
class Fan : public IElectricalEquipment
{
public:
    // 打开风扇
    virtual void PowerOn() override
    {
        std::cout << "Fan is on." << std::endl;
    }
    //关闭风扇
    virtual  void PowerOff() override
    {
        std::cout << "Fan is off." << std::endl;
    }
};


#endif //DESIGNPATTERN_CONCRETE_IMPLEMENTOR_H
