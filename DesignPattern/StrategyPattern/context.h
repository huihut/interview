#ifndef CONTEXT_H
#define CONTEXT_H

#include "strategy.h"

// 上下文类
// 维护一个对Strategy对象的引用，用于调用具体策略
class Context {
private:
    Strategy* strategy_;
    
public:
    // 构造函数
    Context(Strategy* strategy) : strategy_(strategy) {}
    
    // 析构函数
    ~Context() {
        if (strategy_) {
            delete strategy_;
            strategy_ = nullptr;
        }
    }
    
    // 设置策略
    void setStrategy(Strategy* strategy) {
        if (strategy_) {
            delete strategy_;
        }
        strategy_ = strategy;
    }
    
    // 执行策略
    void contextInterface() {
        if (strategy_) {
            strategy_->algorithmInterface();
        }
    }
};

#endif // CONTEXT_H
