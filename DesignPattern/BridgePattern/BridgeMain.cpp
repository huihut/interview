//
// Created by xiemenghui on 2018/7/21.
//

#include "BridgeMain.h"

void BridgeMain()
{
    // Create electrical appliances (electric lights, electric fans)
    IElectricalEquipment * light = new Light();
    IElectricalEquipment * fan = new Fan();

    // Create switch (pull chain switch, two-position switch)
    // Associating a pull chain switch with a light and a two-position switch with a fan
    ISwitch * pullChain = new PullChainSwitch(light);
    ISwitch * twoPosition = new TwoPositionSwitch(fan);

    // Lights on, lights off
    pullChain->On();
    pullChain->Off();

    // Turn on the fan, turn off the fan
    twoPosition->On();
    twoPosition->Off();

    SAFE_DELETE(twoPosition);
    SAFE_DELETE(pullChain);
    SAFE_DELETE(fan);
    SAFE_DELETE(light);
}