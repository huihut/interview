//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_SUBJECT_H
#define DESIGNPATTERN_SUBJECT_H

class IObserver;

class ISubject
{
public:
    virtual void Attach(IObserver *) = 0;   // 注册观察者
    virtual void Detach(IObserver *) = 0;   // 注销观察者
    virtual void Notify() = 0;              // 通知观察者
};

#endif //DESIGNPATTERN_SUBJECT_H
