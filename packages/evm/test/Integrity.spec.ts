import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";

import "@nomiclabs/hardhat-ethers";
import { Operator, ExecutionOptions, ParameterType } from "./utils";
import { defaultAbiCoder, solidityPack } from "ethers/lib/utils";

// Through abi.encodePacked() , Solidity supports a non-standard packed mode where:
// types shorter than 32 bytes are neither zero padded nor sign extended and
// dynamic types are encoded in-place and without the length.
// array elements are padded, but still encoded in-place
// Furthermore, structs as well as nested arrays are not supported.
const A_32_BYTES_VALUE = defaultAbiCoder.encode(["uint256"], [123]);

describe("Integrity", async () => {
  const baseSetup = deployments.createFixture(async () => {
    await deployments.fixture();
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const TestContract = await hre.ethers.getContractFactory("TestContract");
    const testContract = await TestContract.deploy();
    return { Avatar, avatar, testContract };
  });

  const setupRolesWithOwnerAndInvoker = deployments.createFixture(async () => {
    const base = await baseSetup();

    const [owner, invoker] = waffle.provider.getWallets();

    const Modifier = await hre.ethers.getContractFactory("Roles");
    const modifier = await Modifier.deploy(
      owner.address,
      base.avatar.address,
      base.avatar.address
    );

    await modifier.enableModule(invoker.address);

    return {
      ...base,
      Modifier,
      modifier,
      owner,
      invoker,
    };
  });

  describe("Enforces Parameter Size constraints", () => {
    const MORE_THAN_32_BYTES_TEXT =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

    it("checks limit on scopeFunction", async () => {
      const { modifier, testContract, owner } =
        await setupRolesWithOwnerAndInvoker();

      const SELECTOR = testContract.interface.getSighash(
        testContract.interface.getFunction("doNothing")
      );

      const ROLE_ID = 0;

      await expect(
        modifier.connect(owner).scopeFunction(
          ROLE_ID,
          testContract.address,
          SELECTOR,
          [
            {
              parent: 0,
              paramType: ParameterType.AbiEncoded,
              operator: Operator.Matches,
              compValue: "0x",
            },
            {
              parent: 0,
              paramType: ParameterType.Static,
              operator: Operator.EqualTo,
              compValue: solidityPack(["string"], [MORE_THAN_32_BYTES_TEXT]),
            },
          ],
          ExecutionOptions.None
        )
      ).to.be.revertedWith("UnsuitableStaticCompValueSize()");

      await expect(
        modifier.connect(owner).scopeFunction(
          ROLE_ID,
          testContract.address,
          SELECTOR,
          [
            {
              parent: 0,
              paramType: ParameterType.AbiEncoded,
              operator: Operator.Matches,
              compValue: "0x",
            },
            {
              parent: 0,
              paramType: ParameterType.Array,
              operator: Operator.EqualTo,
              compValue: "0x",
            },
            {
              parent: 1,
              paramType: ParameterType.Static,
              operator: Operator.EqualTo,
              compValue: A_32_BYTES_VALUE,
            },
          ],
          ExecutionOptions.None
        )
      ).to.be.not.reverted;
    });

    it("checks well formed Or", async () => {
      const { modifier, testContract, owner } =
        await setupRolesWithOwnerAndInvoker();

      const SELECTOR = testContract.interface.getSighash(
        testContract.interface.getFunction("doNothing")
      );

      const ROLE_ID = 0;
      await expect(
        modifier.connect(owner).scopeFunction(
          ROLE_ID,
          testContract.address,
          SELECTOR,
          [
            {
              parent: 0,
              paramType: ParameterType.AbiEncoded,
              operator: Operator.Matches,
              compValue: "0x",
            },
            {
              parent: 0,
              paramType: ParameterType.Static,
              operator: Operator.EqualTo,
              compValue: ethers.utils.solidityPack(
                ["string"],
                [MORE_THAN_32_BYTES_TEXT]
              ),
            },
          ],
          ExecutionOptions.None
        )
      ).to.be.revertedWith("UnsuitableStaticCompValueSize()");

      await expect(
        modifier.connect(owner).scopeFunction(
          ROLE_ID,
          testContract.address,
          SELECTOR,
          [
            {
              parent: 0,
              paramType: ParameterType.AbiEncoded,
              operator: Operator.Matches,
              compValue: "0x",
            },
            {
              parent: 0,
              paramType: ParameterType.Static,
              operator: Operator.EqualTo,
              compValue: defaultAbiCoder.encode(["uint256"], [123]),
            },
          ],
          ExecutionOptions.None
        )
      ).to.not.be.reverted;
    });
  });

  it("enforces only one root node", async () => {
    const { modifier, testContract, owner } =
      await setupRolesWithOwnerAndInvoker();

    const ROLE_ID = 0;

    await expect(
      modifier.connect(owner).scopeFunction(
        ROLE_ID,
        testContract.address,
        "0x00000000",
        [
          {
            parent: 1,
            paramType: ParameterType.AbiEncoded,
            operator: Operator.Whatever,
            compValue: "0x",
          },
          {
            parent: 0,
            paramType: ParameterType.Tuple,
            operator: Operator.Whatever,
            compValue: "0x",
          },
        ],
        ExecutionOptions.None
      )
    ).to.be.revertedWith("NoRootNodeFound()");

    await expect(
      modifier.connect(owner).scopeFunction(
        ROLE_ID,
        testContract.address,
        "0x00000000",
        [
          {
            parent: 0,
            paramType: ParameterType.AbiEncoded,
            operator: Operator.Whatever,
            compValue: "0x",
          },
          {
            parent: 1,
            paramType: ParameterType.Tuple,
            operator: Operator.Whatever,
            compValue: "0x",
          },
        ],
        ExecutionOptions.None
      )
    ).to.be.revertedWith("MultipleRootNodesFound()");
  });

  it("enforces param config in BFS order", async () => {
    const { modifier, testContract, owner } =
      await setupRolesWithOwnerAndInvoker();

    const ROLE_ID = 0;
    await expect(
      modifier.connect(owner).scopeFunction(
        ROLE_ID,
        testContract.address,
        "0x00000000",
        [
          {
            parent: 0,
            paramType: ParameterType.AbiEncoded,
            operator: Operator.Whatever,
            compValue: "0x",
          },
          {
            parent: 0,
            paramType: ParameterType.Tuple,
            operator: Operator.Whatever,
            compValue: "0x",
          },
          {
            parent: 1,
            paramType: ParameterType.Static,
            operator: Operator.Whatever,
            compValue: "0x",
          },
          {
            parent: 0,
            paramType: ParameterType.Static,
            operator: Operator.Whatever,
            compValue: "0x",
          },
        ],
        ExecutionOptions.None
      )
    ).to.be.revertedWith("FlatButNotBFS()");
  });
});
