//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_CONCRETE_FACTORY_H
#define DESIGNPATTERN_CONCRETE_FACTORY_H

#include "Factory.h"
#include "concrete_product.h"

// Benz factory
class BenzFactory : public Factory
{
public:
    ICar* CreateCar()
    {
        return new BenzCar();
    }
    IBike* CreateBike()
    {
        return new BenzBike();
    }
};

// BMW factory
class BmwFactory : public Factory
{
public:
    ICar* CreateCar() {
        return new BmwCar();
    }

    IBike* CreateBike() {
        return new BmwBike();
    }
};

// Audi factory
class AudiFactory : public Factory
{
public:
    ICar* CreateCar() {
        return new AudiCar();
    }

    IBike* CreateBike() {
        return new AudiBike();
    }
};

#endif //DESIGNPATTERN_CONCRETE_FACTORY_H
