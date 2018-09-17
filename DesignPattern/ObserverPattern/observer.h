//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_OBSERVER_H
#define DESIGNPATTERN_OBSERVER_H

// 抽象观察者
class IObserver
{
public:
    virtual void Update(float price) = 0;   // 更新价格
};

#endif //DESIGNPATTERN_OBSERVER_H
