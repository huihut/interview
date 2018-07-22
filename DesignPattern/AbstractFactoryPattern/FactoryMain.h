//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_FACTORYMAIN_H
#define DESIGNPATTERN_FACTORYMAIN_H

#ifndef SAFE_DELETE
#define SAFE_DELETE(p) { if(p) {delete(p); (p)=nullptr;}}
#endif

void FactoryMain();

#endif //DESIGNPATTERN_FACTORYMAIN_H
