cmake_minimum_required(VERSION 3.10)
project(DesignPattern)

set(CMAKE_CXX_STANDARD 11)

add_executable(DesignPattern main.cpp AbstractFactoryPattern/product.h AbstractFactoryPattern/concrete_product.h AbstractFactoryPattern/Factory.cpp AbstractFactoryPattern/Factory.h AbstractFactoryPattern/concrete_factory.h AbstractFactoryPattern/FactoryMain.cpp AbstractFactoryPattern/FactoryMain.h SingletonPattern/Singleton.cpp SingletonPattern/Singleton.h SingletonPattern/SingletonMain.h AdapterPattern/target.h AdapterPattern/adaptee.h AdapterPattern/adapter.h AdapterPattern/AdapterMain.h BridgePattern/implementor.h BridgePattern/concrete_implementor.h BridgePattern/abstraction.h BridgePattern/refined_abstraction.h BridgePattern/BridgeMain.h BridgePattern/BridgeMain.cpp ObserverPattern/subject.h ObserverPattern/observer.h ObserverPattern/concrete_subject.h ObserverPattern/concrete_observer.h ObserverPattern/ObserverMain.cpp ObserverPattern/ObserverMain.h)