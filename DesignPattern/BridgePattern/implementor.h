//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_IMPLEMENTOR_H
#define DESIGNPATTERN_IMPLEMENTOR_H

// 电器
class IElectricalEquipment
{
public:
    virtual ~IElectricalEquipment(){}
    virtual void PowerOn() = 0;     // 打开
    virtual void PowerOff() = 0;    // 关闭
};

#endif //DESIGNPATTERN_IMPLEMENTOR_H
