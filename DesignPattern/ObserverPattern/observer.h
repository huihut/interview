//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_OBSERVER_H
#define DESIGNPATTERN_OBSERVER_H

// Abstract observer
class IObserver
{
public:
    virtual void Update(float price) = 0;   // Update price
};

#endif //DESIGNPATTERN_OBSERVER_H
