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

// 电源适配器
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
        // 使用自带的充电器（两脚扁形）充电
        m_pCharger->ChargeWithFeetFlat();
    }
private:
    // 持有需要被适配的接口对象（自带的充电器）
    OwnCharger* m_pCharger;
};

#endif //DESIGNPATTERN_ADAPTER_H
