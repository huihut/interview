//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_ABSTRACTION_H
#define DESIGNPATTERN_ABSTRACTION_H

#include "implementor.h"

// 开关
class ISwitch
{
public:
    ISwitch(IElectricalEquipment *ee){ m_pEe = ee; }
    virtual ~ISwitch(){}
    virtual void On() = 0;  // 打开电器
    virtual void Off() = 0;  // 关闭电器

protected:
    IElectricalEquipment * m_pEe;
};

#endif //DESIGNPATTERN_ABSTRACTION_H
