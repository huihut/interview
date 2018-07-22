//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_SINGLETONMAIN_H
#define DESIGNPATTERN_SINGLETONMAIN_H

#include "Singleton.h"

void SingletonMain()
{
    Singleton::GetInstance().DoSomething();
}

#endif //DESIGNPATTERN_SINGLETONMAIN_H
