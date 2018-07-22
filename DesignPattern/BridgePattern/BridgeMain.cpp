//
// Created by xiemenghui on 2018/7/21.
//

#include "BridgeMain.h"

void BridgeMain()
{
    // 创建电器（电灯、电风扇）
    IElectricalEquipment * light = new Light();
    IElectricalEquipment * fan = new Fan();

    // 创建开关（拉链式开关、两位开关）
    // 将拉链式开关和电灯关联起来，两位开关和风扇关联起来
    ISwitch * pullChain = new PullChainSwitch(light);
    ISwitch * twoPosition = new TwoPositionSwitch(fan);

    // 开灯、关灯
    pullChain->On();
    pullChain->Off();

    // 打开风扇、关闭风扇
    twoPosition->On();
    twoPosition->Off();

    SAFE_DELETE(twoPosition);
    SAFE_DELETE(pullChain);
    SAFE_DELETE(fan);
    SAFE_DELETE(light);
}