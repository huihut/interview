//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_IMPLEMENTOR_H
#define DESIGNPATTERN_IMPLEMENTOR_H

// Electric equipment
class IElectricalEquipment
{
public:
    virtual ~IElectricalEquipment(){}
    virtual void PowerOn() = 0;
    virtual void PowerOff() = 0;
};

#endif //DESIGNPATTERN_IMPLEMENTOR_H
