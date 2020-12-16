//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_PRODUCT_H
#define DESIGNPATTERN_PRODUCT_H

#include <string>
using std::string;

// Car Interface
class ICar
{
public:
    virtual string Name() = 0;
};

// Bike Interface
class IBike
{
public:
    virtual string Name() = 0;
};

#endif //DESIGNPATTERN_PRODUCT_H
