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
    std::cout << "** ���ģʽ���� **" << std::endl;
    std::cout << "*******************" << std::endl;

    std::cout << "*******************" << std::endl;
    std::cout << "** ����ģʽ **" << std::endl;
    std::cout << "*******************" << std::endl;
    SingletonMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** ���󹤳�ģʽ **" << std::endl;
    std::cout << "*******************" << std::endl;
    FactoryMain();
    
    std::cout << "*******************" << std::endl;
    std::cout << "** ������ģʽ **" << std::endl;
    std::cout << "*******************" << std::endl;
    AdapterMain();

    std::cout << "*******************" << std::endl;
    std::cout << "** �Ž�ģʽ **" << std::endl;
    std::cout << "*******************" << std::endl;
    
    std::cout << "*******************" << std::endl;
    std::cout << "** �۲���ģʽ **" << std::endl;
    std::cout << "*******************" << std::endl;
    ObserverMain();

    return 0;
}