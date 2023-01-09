export default [
  // Compound V2 - USDC
  {
    // Approval of USDC with cUSDC as spender
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    data: "0x095ea7b300000000000000000000000039aa39c021dfbae8fac545936693ac917d5e7563ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  {
    // mint
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // redeem
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    data: "0xdb006a750000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // redeemUnderlying
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    data: "0x852a12e30000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // claimComp for cAAVE
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    data: "0x1c3db2e0000000000000000000000000dcba2646961784610ce0bCE7e120BF72bAd9e55200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e65cdb6479bac1e22340e4e755fae7e509ecd06c",
    expectRevert: true,
  },
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Compound V2 - DAI
  {
    // Approval of DAI with cDAI as spender
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    data: "0x095ea7b30000000000000000000000005d3a536e4d6dbd6114cc1ead35777bab948e36430000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // mint
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // redeem
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    data: "0xdb006a750000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // redeemUnderlying
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    data: "0x852a12e30000000000000000000000000000000000000000000000000000000000000001",
  },
  {
    // claimComp for cDAI + cUSD
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    data: "0x1c3db2e0000000000000000000000000dcba2646961784610ce0bCE7e120BF72bAd9e5520000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000039aa39c021dfbae8fac545936693ac917d5e75630000000000000000000000005d3a536e4d6dbd6114cc1ead35777bab948e3643",
  },
  {
    // claimComp for cUSDC
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    data: "0x1c3db2e0000000000000000000000000dcba2646961784610ce0bce7e120bf72bad9e5520000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000039aa39c021dfbae8fac545936693ac917d5e7563",
  },
  {
    // claimComp for cDAI
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    data: "0x1c3db2e0000000000000000000000000dcba2646961784610ce0bce7e120bf72bad9e552000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000005d3a536e4d6dbd6114cc1ead35777bab948e3643",
  },
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Stakewise
  {
    //stake
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0xC874b064f465bdD6411D45734b56fac750Cda29A",
    data: "0x3a4b66f1",
  },
  {
    //claim
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0xA3F21010e8b9a3930996C8849Df38f9Ca3647c20",
    data: "0xeedb74870000000000000000000000000000000000000000000000000000000000000001000000000000000000000000dcba2646961784610ce0bce7e120bf72bad9e55200000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000200000000000000000000000020bc832ca081b91433ff6c17f85701b6e92486c500000000000000000000000048c3399719b582dd63eb5aadf12a40b4c3f52fa200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020017069e1c810707c2e1b47af470c93a4725fc0b729bdbd806ab40b923574d234c8150b398cad1647b8d5098b4e7ebe1a140aa60074bcb2d601f9442e7b23901",
  },
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Stakewise - Uniwsap V3

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Lido

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Curve - stETH/ETH

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // AURA wstETH-ETH
  {
    //depositSingle
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0xB188b1CB84Fb0bA13cb9ee1292769F903A9feC59",
    data: "0x9eba6619000000000000000000000000e4683fe8f53da14ca5dac4251eadfb3aa614d528000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000132296969ef14eb0c6d29669c550d4a044913023000020000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000586aa273f262909eef8fa02d90ab65f5015e05160000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045d964b80000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000003f1ac53fe3fc0e326f5f00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045d964b800",
  },
  //---------------------------------------------------------------------------------------------------------------------------------
  // Balancer wstETH -ETH pool

  //---------------------------------------------------------------------------------------------------------------------------------
  // Swapping of rewards COMP, CRV, rETH2, SWISE and sETH2 in UniswapV3

  //---------------------------------------------------------------------------------------------------------------------------------
  //Swapping of rewards AURA, BAL, COMP in Balancer

  //---------------------------------------------------------------------------------------------------------------------------------
  //Swapping in SushiSwap

  {
    //depositSingle
    from: "0xdcba2646961784610ce0bCE7e120BF72bAd9e552",
    to: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    data: "0x38ed17390000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000dcba2646961784610ce0bce7e120bf72bad9e55200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c00e94cb662c3520282e6f5717214004a7f26888000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
]
