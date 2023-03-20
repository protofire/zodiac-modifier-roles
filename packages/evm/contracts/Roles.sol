// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.17 <0.9.0;

import "./PermissionLoader.sol";
import "./PermissionBuilder.sol";
import "./PermissionChecker.sol";

/**
 * @title Zodiac Roles Mod - granular, role-based, access control for your
 * on-chain avatar accounts (like Safe).
 * @author Cristóvão Honorato - <cristovao.honorato@gnosis.pm>
 * @author Jan-Felix Schwarz  - <jan-felix.schwarz@gnosis.pm>
 * @author Auryn Mcmillan     - <auryn.macmillan@gnosis.pm>
 * @author Nathan Ginnever    - <nathan.ginnever@gnosis.pm>
 */
contract Roles is
    Modifier,
    PermissionLoader,
    PermissionBuilder,
    PermissionChecker
{
    mapping(address => uint16) public defaultRoles;

    event AssignRoles(address module, uint16[] roles, bool[] memberOf);
    event RolesModSetup(
        address indexed initiator,
        address indexed owner,
        address indexed avatar,
        address target
    );
    event SetDefaultRole(address module, uint16 defaultRole);

    error ArraysDifferentLength();

    /// Sender is allowed to make this call, but the internal transaction failed
    error ModuleTransactionFailed();

    /// @param _owner Address of the owner
    /// @param _avatar Address of the avatar (e.g. a Gnosis Safe)
    /// @param _target Address of the contract that will call exec function
    constructor(address _owner, address _avatar, address _target) {
        bytes memory initParams = abi.encode(_owner, _avatar, _target);
        setUp(initParams);
    }

    /// @dev There is no zero address check as solidty will check for
    /// missing arguments and the space of invalid addresses is too large
    /// to check. Invalid avatar or target address can be reset by owner.
    function setUp(bytes memory initParams) public override initializer {
        (address _owner, address _avatar, address _target) = abi.decode(
            initParams,
            (address, address, address)
        );
        __Ownable_init();

        avatar = _avatar;
        target = _target;

        transferOwnership(_owner);
        setupModules();

        emit RolesModSetup(msg.sender, _owner, _avatar, _target);
    }

    /// @dev Assigns and revokes roles to a given module.
    /// @param module Module on which to assign/revoke roles.
    /// @param _roles Roles to assign/revoke.
    /// @param memberOf Assign (true) or revoke (false) corresponding _roles.
    function assignRoles(
        address module,
        uint16[] calldata _roles,
        bool[] calldata memberOf
    ) external onlyOwner {
        if (_roles.length != memberOf.length) {
            revert ArraysDifferentLength();
        }
        for (uint16 i; i < _roles.length; ++i) {
            roles[_roles[i]].members[module] = memberOf[i];
        }
        if (!isModuleEnabled(module)) {
            enableModule(module);
        }
        emit AssignRoles(module, _roles, memberOf);
    }

    /// @dev Sets the default role used for a module if it calls execTransactionFromModule() or execTransactionFromModuleReturnData().
    /// @param module Address of the module on which to set default role.
    /// @param roleId Role to be set as default.
    function setDefaultRole(address module, uint16 roleId) external onlyOwner {
        defaultRoles[module] = roleId;
        emit SetDefaultRole(module, roleId);
    }

    /// @dev Passes a transaction to the modifier.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @notice Can only be called by enabled modules
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) public override moduleOnly returns (bool success) {
        Trace[] memory result = authorize(
            roles[defaultRoles[msg.sender]],
            to,
            value,
            data,
            operation
        );
        success = exec(to, value, data, operation);
        if (success) {
            _track(result);
        }
    }

    /// @dev Passes a transaction to the modifier, expects return data.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @notice Can only be called by enabled modules
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    )
        public
        override
        moduleOnly
        returns (bool success, bytes memory returnData)
    {
        Trace[] memory result = authorize(
            roles[defaultRoles[msg.sender]],
            to,
            value,
            data,
            operation
        );
        (success, returnData) = execAndReturnData(to, value, data, operation);
        if (success) {
            _track(result);
        }
    }

    /// @dev Passes a transaction to the modifier assuming the specified role.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @param roleId Identifier of the role to assume for this transaction
    /// @param shouldRevert Should the function revert on inner execution returning success false?
    /// @notice Can only be called by enabled modules
    function execTransactionWithRole(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint16 roleId,
        bool shouldRevert
    ) public moduleOnly returns (bool success) {
        Trace[] memory result = authorize(
            roles[roleId],
            to,
            value,
            data,
            operation
        );
        success = exec(to, value, data, operation);
        if (shouldRevert && !success) {
            revert ModuleTransactionFailed();
        }
        if (success) {
            _track(result);
        }
    }

    /// @dev Passes a transaction to the modifier assuming the specified role. Expects return data.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @param roleId Identifier of the role to assume for this transaction
    /// @param shouldRevert Should the function revert on inner execution returning success false?
    /// @notice Can only be called by enabled modules
    function execTransactionWithRoleReturnData(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation,
        uint16 roleId,
        bool shouldRevert
    ) public moduleOnly returns (bool success, bytes memory returnData) {
        Trace[] memory result = authorize(
            roles[roleId],
            to,
            value,
            data,
            operation
        );
        (success, returnData) = execAndReturnData(to, value, data, operation);
        if (shouldRevert && !success) {
            revert ModuleTransactionFailed();
        }
        if (success) {
            _track(result);
        }
    }
}
