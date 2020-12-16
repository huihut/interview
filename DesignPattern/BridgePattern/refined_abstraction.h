//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_REFINED_ABSTRACTION_H
#define DESIGNPATTERN_REFINED_ABSTRACTION_H

#include "abstraction.h"
#include <iostream>

// Zipper switch
class PullChainSwitch : public ISwitch
{
public:
    PullChainSwitch(IElectricalEquipment *ee) : ISwitch(ee) {}

    // Turn on the equipment with a zipper switch
    virtual void On() override
    {
        std::cout << "Turn on the equipment with a zipper switch." << std::endl;
        m_pEe->PowerOn();
    }

    // Turn off the equipment with a zipper switch
    virtual void Off() override
    {
        std::cout << "Turn off the equipment with a zipper switch." << std::endl;
        m_pEe->PowerOff();
    }
};

// Two-position switch
class TwoPositionSwitch : public ISwitch
{
public:
    TwoPositionSwitch(IElectricalEquipment *ee) : ISwitch(ee) {}

    // Turn on the equipment with a two-position switch
    virtual void On() override
    {
        std::cout << "Turn on the equipment with a two-position switch." << std::endl;
        m_pEe->PowerOn();
    }

    // Turn off the equipment with a two-position switch
    virtual void Off() override {
        std::cout << "Turn off the equipment with a two-position switch." << std::endl;
        m_pEe->PowerOff();
    }
};


#endif //DESIGNPATTERN_REFINED_ABSTRACTION_H
