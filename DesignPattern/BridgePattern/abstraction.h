//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_ABSTRACTION_H
#define DESIGNPATTERN_ABSTRACTION_H

#include "implementor.h"

// Switch
class ISwitch
{
public:
    ISwitch(IElectricalEquipment *ee){ m_pEe = ee; }
    virtual ~ISwitch(){}
    virtual void On() = 0;  // Turn on the appliance
    virtual void Off() = 0;  // Turn off the appliance

protected:
    IElectricalEquipment * m_pEe;
};

#endif //DESIGNPATTERN_ABSTRACTION_H
