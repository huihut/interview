//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_FACTORY_H
#define DESIGNPATTERN_FACTORY_H

#include "product.h"

// 抽象工厂模式
class Factory {
public:
    enum FACTORY_TYPE {
        BENZ_FACTORY,   // 奔驰工厂
        BMW_FACTORY,    // 宝马工厂
        AUDI_FACTORY    // 奥迪工厂
    };

    virtual ICar* CreateCar() = 0;      // 生产汽车
    virtual IBike* CreateBike() = 0;    // 生产自行车
    static Factory * CreateFactory(FACTORY_TYPE factory); // 创建工厂
};

#endif //DESIGNPATTERN_FACTORY_H
