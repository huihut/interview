#ifndef STRATEGY_H
#define STRATEGY_H

// 策略接口（抽象策略类）
// Strategy Pattern: 定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换
class Strategy {
public:
    virtual ~Strategy() {}
    
    // 算法接口
    virtual void algorithmInterface() = 0;
};

#endif // STRATEGY_H
