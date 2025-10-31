#ifndef CONCRETE_STRATEGY_H
#define CONCRETE_STRATEGY_H

#include "strategy.h"
#include <iostream>

// 具体策略A
class ConcreteStrategyA : public Strategy {
public:
    void algorithmInterface() override {
        std::cout << "使用策略A的算法实现" << std::endl;
    }
};

// 具体策略B
class ConcreteStrategyB : public Strategy {
public:
    void algorithmInterface() override {
        std::cout << "使用策略B的算法实现" << std::endl;
    }
};

// 具体策略C
class ConcreteStrategyC : public Strategy {
public:
    void algorithmInterface() override {
        std::cout << "使用策略C的算法实现" << std::endl;
    }
};

#endif // CONCRETE_STRATEGY_H
