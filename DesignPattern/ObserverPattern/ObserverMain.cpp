//
// Created by xiemenghui on 2018/7/21.
//

#include "ObserverMain.h"

void ObserverMain()
{
    // Create Subject
    ConcreteSubject * pSubject = new ConcreteSubject();

    // Create Observer
    IObserver * pObserver1 = new ConcreteObserver("Jack Ma");
    IObserver * pObserver2 = new ConcreteObserver("Pony");

    // Attach Observers
    pSubject->Attach(pObserver1);
    pSubject->Attach(pObserver2);

    // Change the price and notify the observer
    pSubject->SetPrice(12.5);
    pSubject->Notify();

    // Detach Observers
    pSubject->Detach(pObserver2);

    // Change the state again and notify the observer
    pSubject->SetPrice(15.0);
    pSubject->Notify();

    SAFE_DELETE(pObserver1);
    SAFE_DELETE(pObserver2);
    SAFE_DELETE(pSubject);
}