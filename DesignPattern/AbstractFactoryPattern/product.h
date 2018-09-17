//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_PRODUCT_H
#define DESIGNPATTERN_PRODUCT_H

#include <string>
using std::string;

// 汽车接口
class ICar
{
public:
    virtual string Name() = 0;
};

// 自行车接口
class IBike
{
public:
    virtual string Name() = 0;
};

#endif //DESIGNPATTERN_PRODUCT_H
