//
// Created by xiemenghui on 2018/7/20.
//

#ifndef DESIGNPATTERN_TARGET_H
#define DESIGNPATTERN_TARGET_H

// 俄罗斯提供的插座
class IRussiaSocket
{
public:
    // 使用双脚圆形充电（暂不实现）
    virtual void Charge() = 0;
};

#endif //DESIGNPATTERN_TARGET_H
