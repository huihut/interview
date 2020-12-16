//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_CONCRETE_PRODUCT_H
#define DESIGNPATTERN_CONCRETE_PRODUCT_H

#include "product.h"

/********** Car **********/
// Benz
class BenzCar : public ICar
{
public:
    string Name()
    {
        return "Benz Car";
    }
};

// BMW
class BmwCar : public ICar
{
public:
    string Name()
    {
        return "Bmw Car";
    }
};

// Audi
class AudiCar : public ICar
{
public:
    string Name()
    {
        return "Audi Car";
    }
};

/********** Bicycle **********/
// Benz
class BenzBike : public IBike
{
public:
    string Name()
    {
        return "Benz Bike";
    }
};

// BMW
class BmwBike : public IBike
{
public:
    string Name()
    {
        return "Bmw Bike";
    }
};

// Audi
class AudiBike : public IBike
{
public:
    string Name()
    {
        return "Audi Bike";
    }
};

#endif //DESIGNPATTERN_CONCRETE_PRODUCT_H
