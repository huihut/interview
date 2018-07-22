//
// Created by xiemenghui on 2018/7/21.
//

#include "ObserverMain.h"

void ObserverMain()
{
    // 创建主题
    ConcreteSubject * pSubject = new ConcreteSubject();

    // 创建观察者
    IObserver * pObserver1 = new ConcreteObserver("Jack Ma");
    IObserver * pObserver2 = new ConcreteObserver("Pony");

    // 注册观察者
    pSubject->Attach(pObserver1);
    pSubject->Attach(pObserver2);

    // 更改价格，并通知观察者
    pSubject->SetPrice(12.5);
    pSubject->Notify();

    // 注销一个观察者
    pSubject->Detach(pObserver2);

    // 再次更改状态，并通知观察者
    pSubject->SetPrice(15.0);
    pSubject->Notify();

    SAFE_DELETE(pObserver1);
    SAFE_DELETE(pObserver2);
    SAFE_DELETE(pSubject);
}