//
// Created by xiemenghui on 2018/7/20.
//

#include "Factory.h"
#include "concrete_factory.h"

Factory* Factory::CreateFactory(FACTORY_TYPE factory)
{
    Factory *pFactory = nullptr;
    switch (factory) {
        case FACTORY_TYPE::BENZ_FACTORY:  // Benz factory
            pFactory = new BenzFactory();
            break;
        case FACTORY_TYPE::BMW_FACTORY:  // BMW factory
            pFactory = new BmwFactory();
            break;
        case FACTORY_TYPE::AUDI_FACTORY:  // Audi factory
            pFactory = new AudiFactory();
            break;
        default:
            break;
    }
    return pFactory;
}