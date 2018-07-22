//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_CONCRETE_PRODUCT_H
#define DESIGNPATTERN_CONCRETE_PRODUCT_H

#include "product.h"

/********** 汽车 **********/
// 奔驰
class BenzCar : public ICar
{
public:
    string Name()
    {
        return "Benz Car";
    }
};

// 宝马
class BmwCar : public ICar
{
public:
    string Name()
    {
        return "Bmw Car";
    }
};

// 奥迪
class AudiCar : public ICar
{
public:
    string Name()
    {
        return "Audi Car";
    }
};

/********** 自行车 **********/
// 奔驰
class BenzBike : public IBike
{
public:
    string Name()
    {
        return "Benz Bike";
    }
};

// 宝马
class BmwBike : public IBike
{
public:
    string Name()
    {
        return "Bmw Bike";
    }
};

// 奥迪
class AudiBike : public IBike
{
public:
    string Name()
    {
        return "Audi Bike";
    }
};

#endif //DESIGNPATTERN_CONCRETE_PRODUCT_H
