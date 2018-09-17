//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_REFINED_ABSTRACTION_H
#define DESIGNPATTERN_REFINED_ABSTRACTION_H

#include "abstraction.h"
#include <iostream>

// 拉链式开关
class PullChainSwitch : public ISwitch
{
public:
    PullChainSwitch(IElectricalEquipment *ee) : ISwitch(ee) {}

    // 用拉链式开关打开电器
    virtual void On() override
    {
        std::cout << "Switch on the equipment with a pull chain switch." << std::endl;
        m_pEe->PowerOn();
    }

    // 用拉链式开关关闭电器
    virtual void Off() override
    {
        std::cout << "Switch off the equipment with a pull chain switch." << std::endl;
        m_pEe->PowerOff();
    }
};

// 两位开关
class TwoPositionSwitch : public ISwitch
{
public:
    TwoPositionSwitch(IElectricalEquipment *ee) : ISwitch(ee) {}

    // 用两位开关打开电器
    virtual void On() override
    {
        std::cout << "Switch on the equipment with a two-position switch." << std::endl;
        m_pEe->PowerOn();
    }

    // 用两位开关关闭电器
    virtual void Off() override {
        std::cout << "Switch off the equipment with a two-position switch." << std::endl;
        m_pEe->PowerOff();
    }
};


#endif //DESIGNPATTERN_REFINED_ABSTRACTION_H
