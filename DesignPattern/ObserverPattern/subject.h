//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_SUBJECT_H
#define DESIGNPATTERN_SUBJECT_H

class IObserver;

class ISubject
{
public:
    virtual void Attach(IObserver *) = 0;   // Attach observer
    virtual void Detach(IObserver *) = 0;   // Detach observer
    virtual void Notify() = 0;              // Notify observer
};

#endif //DESIGNPATTERN_SUBJECT_H
