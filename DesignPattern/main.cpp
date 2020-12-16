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
    std::cout << "** Design pattern example **" << std::endl;
    std::cout << "*******************" << std::endl;

    std::cout << "*******************" << std::endl;
    std::cout << "** Singleton mode **" << std::endl;
    std::cout << "*******************" << std::endl;
    SingletonMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** Abstract factory pattern **" << std::endl;
    std::cout << "*******************" << std::endl;
    FactoryMain();
    
    std::cout << "*******************" << std::endl;
    std::cout << "** Adapter mode **" << std::endl;
    std::cout << "*******************" << std::endl;
    AdapterMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** Bridge mode **" << std::endl;
    std::cout << "*******************" << std::endl;
    
    std::cout << "*******************" << std::endl;
    std::cout << "** Observer mode **" << std::endl;
    std::cout << "*******************" << std::endl;
    ObserverMain();

    return 0;
}
