//
// Created by xiemenghui on 2018/7/20.
//

#include "Factory.h"
#include "concrete_factory.h"

Factory* Factory::CreateFactory(FACTORY_TYPE factory)
{
    Factory *pFactory = nullptr;
    switch (factory) {
        case FACTORY_TYPE::BENZ_FACTORY:  // 奔驰工厂
            pFactory = new BenzFactory();
            break;
        case FACTORY_TYPE::BMW_FACTORY:  // 宝马工厂
            pFactory = new BmwFactory();
            break;
        case FACTORY_TYPE::AUDI_FACTORY:  // 奥迪工厂
            pFactory = new AudiFactory();
            break;
        default:
            break;
    }
    return pFactory;
}