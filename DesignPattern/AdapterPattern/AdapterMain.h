//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_ADAPTERMAIN_H
#define DESIGNPATTERN_ADAPTERMAIN_H

#include "adapter.h"

void AdapterMain()
{
    // Create a power adapter
    IRussiaSocket * pAdapter = new PowerAdapter();

    // Recharge
    pAdapter->Charge();

    SAFE_DELETE(pAdapter);
}

#endif //DESIGNPATTERN_ADAPTERMAIN_H
