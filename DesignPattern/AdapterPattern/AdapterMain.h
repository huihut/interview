//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_ADAPTERMAIN_H
#define DESIGNPATTERN_ADAPTERMAIN_H

#include "adapter.h"

void AdapterMain()
{
    // ´´½¨ÊÊÅäÆ÷
    IRussiaSocket * pAdapter = new PowerAdapter();

    // ³äµç
    pAdapter->Charge();

    SAFE_DELETE(pAdapter);
}

#endif //DESIGNPATTERN_ADAPTERMAIN_H
