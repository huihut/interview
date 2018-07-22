//
// Created by xiemenghui on 2018/7/20.
//

#include <iostream>
#include "SingletonPattern/SingletonMain.h"
#include "AbstractFactoryPattern/FactoryMain.h"
#include "AdapterPattern/AdapterMain.h"
#include "BridgePattern/BridgeMain.h"
#include "ObserverPattern/ObserverMain.h"

int main() {
    std::cout << "*******************" << std::endl;
    std::cout << "** 设计模式例子 **" << std::endl;
    std::cout << "*******************" << std::endl;

    std::cout << "*******************" << std::endl;
    std::cout << "** 单例模式 **" << std::endl;
    std::cout << "*******************" << std::endl;
    SingletonMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** 抽象工厂模式 **" << std::endl;
    std::cout << "*******************" << std::endl;
    FactoryMain();
    
    std::cout << "*******************" << std::endl;
    std::cout << "** 适配器模式 **" << std::endl;
    std::cout << "*******************" << std::endl;
    AdapterMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** 桥接模式 **" << std::endl;
    std::cout << "*******************" << std::endl;
    BridgeMain();
    
    std::cout << "*******************" << std::endl;
    std::cout << "** 观察者模式 **" << std::endl;
    std::cout << "*******************" << std::endl;
    ObserverMain();

    return 0;
}