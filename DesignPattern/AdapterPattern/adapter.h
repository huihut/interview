//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_ADAPTER_H
#define DESIGNPATTERN_ADAPTER_H

#include "target.h"
#include "adaptee.h"

#ifndef SAFE_DELETE
#define SAFE_DELETE(p) { if(p){delete(p); (p)=NULL;} }
#endif

// Power Adapter
class PowerAdapter : public IRussiaSocket
{
public:
    PowerAdapter() : m_pCharger(new OwnCharger()){}
    ~PowerAdapter()
    {
        SAFE_DELETE(m_pCharger);
    }
    void Charge()
    {
        // Use the built-in charger (two-pin flat) to charge
        m_pCharger->ChargeWithFeetFlat();
    }
private:
    // Hold the interface object that needs to be adapted (the built-in charger)
    OwnCharger* m_pCharger;
};

#endif //DESIGNPATTERN_ADAPTER_H
