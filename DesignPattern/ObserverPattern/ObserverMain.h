//
// Created by xiemenghui on 2018/7/21.
//

#ifndef DESIGNPATTERN_OBSERVERMAIN_H
#define DESIGNPATTERN_OBSERVERMAIN_H

#include "concrete_subject.h"
#include "concrete_observer.h"

#ifndef SAFE_DELETE
#define SAFE_DELETE(p) { if(p){delete(p); (p)=nullptr;} }
#endif

void ObserverMain();

#endif //DESIGNPATTERN_OBSERVERMAIN_H
