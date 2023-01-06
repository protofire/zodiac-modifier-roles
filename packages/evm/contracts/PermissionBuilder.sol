// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "@gnosis.pm/zodiac/contracts/core/Modifier.sol";

import "./ScopeConfig.sol";
import "./Types.sol";

abstract contract PermissionBuilder is OwnableUpgradeable {
    uint256 internal constant SCOPE_MAX_PARAMS = 38;

    /// Not possible to define gt/lt for Dynamic types
    error UnsuitableRelativeComparison();

    error UnsuitableSubsetOfComparison();

    /// CompValue for static types should have a size of exactly 32 bytes
    error UnsuitableStaticCompValueSize();

    /// CompValue for Dynamic32 types should be a multiple of exactly 32 bytes
    error UnsuitableDynamic32CompValueSize();

    /// Exceeds the max number of params supported
    error ScopeMaxParametersExceeded();

    error NoCompValuesProvidedForScope();

    error NotEnoughCompValuesForScope();

    error TooManyCompValuesForScope();

    event AllowTarget(
        uint16 role,
        address targetAddress,
        ExecutionOptions options
    );
    event RevokeTarget(uint16 role, address targetAddress);
    event ScopeTarget(uint16 role, address targetAddress);

    event AllowFunction(
        uint16 role,
        address targetAddress,
        bytes4 selector,
        ExecutionOptions options
    );
    event RevokeFunction(uint16 role, address targetAddress, bytes4 selector);
    event ScopeFunction(
        uint16 role,
        address targetAddress,
        bytes4 functionSig,
        ParameterConfig[] parameters,
        ExecutionOptions options,
        uint256 resultingScopeConfig
    );

    mapping(uint16 => Role) internal roles;

    /// @dev Allows transactions to a target address.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    /// @param options designates if a transaction can send ether and/or delegatecall to target.
    function allowTarget(
        uint16 roleId,
        address targetAddress,
        ExecutionOptions options
    ) external onlyOwner {
        roles[roleId].targets[targetAddress] = TargetAddress(
            Clearance.Target,
            options
        );
        emit AllowTarget(roleId, targetAddress, options);
    }

    /// @dev Removes transactions to a target address.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    function revokeTarget(
        uint16 roleId,
        address targetAddress
    ) external onlyOwner {
        roles[roleId].targets[targetAddress] = TargetAddress(
            Clearance.None,
            ExecutionOptions.None
        );
        emit RevokeTarget(roleId, targetAddress);
    }

    /// @dev Designates only specific functions can be called.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    function scopeTarget(
        uint16 roleId,
        address targetAddress
    ) external onlyOwner {
        roles[roleId].targets[targetAddress] = TargetAddress(
            Clearance.Function,
            ExecutionOptions.None
        );
        emit ScopeTarget(roleId, targetAddress);
    }

    /// @dev Specifies the functions that can be called.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    /// @param selector 4 byte function selector.
    /// @param options designates if a transaction can send ether and/or delegatecall to target.
    function allowFunction(
        uint16 roleId,
        address targetAddress,
        bytes4 selector,
        ExecutionOptions options
    ) external onlyOwner {
        roles[roleId].functions[
            _keyForFunctions(targetAddress, selector)
        ] = ScopeConfig.pack(0, options, true, 0);

        emit AllowFunction(roleId, targetAddress, selector, options);
    }

    /// @dev Removes the functions that can be called.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    /// @param selector 4 byte function selector.
    function revokeFunction(
        uint16 roleId,
        address targetAddress,
        bytes4 selector
    ) external onlyOwner {
        delete roles[roleId].functions[
            _keyForFunctions(targetAddress, selector)
        ];
        emit RevokeFunction(roleId, targetAddress, selector);
    }

    /// @dev Defines the values that can be called for a given function for each param.
    /// @param roleId identifier of the role to be modified.
    /// @param targetAddress Destination address of transaction.
    /// @param selector 4 byte function selector.
    /// @param options designates if a transaction can send ether and/or delegatecall to target.
    function scopeFunction(
        uint16 roleId,
        address targetAddress,
        bytes4 selector,
        ParameterConfig[] calldata parameters,
        ExecutionOptions options
    ) external onlyOwner {
        if (parameters.length > SCOPE_MAX_PARAMS) {
            revert ScopeMaxParametersExceeded();
        }

        for (uint256 i = 0; i < parameters.length; i++) {
            if (parameters[i].isScoped) {
                _enforceParameterConfig(parameters[i]);
            }
        }

        Role storage role = roles[roleId];

        /*
         * pack(
         *    0           -> start from a fresh scopeConfig
         *    options     -> externally provided options
         *    false       -> mark the function as not wildcarded
         *    length      -> parameter count
         * )
         */
        uint256 scopeConfig = ScopeConfig.pack(
            0,
            options,
            false,
            parameters.length
        );
        for (uint256 i = 0; i < parameters.length; ++i) {
            ParameterConfig calldata parameter = parameters[i];
            if (!parameter.isScoped) {
                continue;
            }
            scopeConfig = ScopeConfig.packParameter(
                scopeConfig,
                i,
                parameter.isScoped,
                parameter._type,
                parameter.comp
            );

            bytes32 key = _keyForCompValues(targetAddress, selector, i);
            if (
                parameter.comp == Comparison.EqualTo ||
                parameter.comp == Comparison.GreaterThan ||
                parameter.comp == Comparison.LessThan
            ) {
                assert(parameter.compValues.length == 1);
                role.compValue[key] = _compressCompValue(
                    parameter._type,
                    parameter.compValues[0]
                );
            } else if (parameter.comp == Comparison.OneOf) {
                role.compValues[key] = _compressCompValues(
                    parameter._type,
                    parameter.compValues
                );
            } else {
                assert(parameter.comp == Comparison.SubsetOf);
                role.compValues[key] = _splitCompValue(
                    parameter._type,
                    parameter.compValues[0]
                );
            }
        }
        role.functions[_keyForFunctions(targetAddress, selector)] = scopeConfig;

        emit ScopeFunction(
            roleId,
            targetAddress,
            selector,
            parameters,
            options,
            scopeConfig
        );
    }

    /// @dev Internal function that enforces a param type is valid.
    /// @param config  provides information about the type of parameter and the type of comparison.
    function _enforceParameterConfig(
        ParameterConfig calldata config
    ) private pure {
        assert(config.isScoped);

        if (config.compValues.length == 0) {
            revert NoCompValuesProvidedForScope();
        }

        // equal -> Static, Dynamic, Dynamic32
        // less -> Static
        // greater -> Static
        // oneOf -> Static, Dynamic, Dynamic32
        // subsetOf -> Dynamic32
        if (config.comp == Comparison.EqualTo) {
            if (config.compValues.length != 1) {
                revert TooManyCompValuesForScope();
            }
        } else if (config.comp == Comparison.GreaterThan) {
            if (config._type != ParameterType.Static) {
                revert UnsuitableRelativeComparison();
            }
        } else if (config.comp == Comparison.LessThan) {
            if (config._type != ParameterType.Static) {
                revert UnsuitableRelativeComparison();
            }
        } else if (config.comp == Comparison.OneOf) {
            if (config.compValues.length < 2) {
                revert NotEnoughCompValuesForScope();
            }
        } else if (config.comp == Comparison.SubsetOf) {
            if (config._type != ParameterType.Dynamic32) {
                revert UnsuitableSubsetOfComparison();
            }
            if (config.compValues.length != 1) {
                revert TooManyCompValuesForScope();
            }
        }

        for (uint256 i = 0; i < config.compValues.length; i++) {
            if (
                config._type == ParameterType.Static &&
                config.compValues[i].length != 32
            ) {
                revert UnsuitableStaticCompValueSize();
            }

            if (
                config._type == ParameterType.Dynamic32 &&
                config.compValues[i].length % 32 != 0
            ) {
                revert UnsuitableDynamic32CompValueSize();
            }
        }
    }

    function _keyForFunctions(
        address targetAddress,
        bytes4 selector
    ) internal pure returns (bytes32) {
        return bytes32(abi.encodePacked(targetAddress, selector));
    }

    function _keyForCompValues(
        address targetAddress,
        bytes4 selector,
        uint256 index
    ) internal pure returns (bytes32) {
        assert(index <= type(uint8).max);
        return bytes32(abi.encodePacked(targetAddress, selector, uint8(index)));
    }

    function _compressCompValue(
        ParameterType paramType,
        bytes calldata compValue
    ) private pure returns (bytes32) {
        return
            paramType == ParameterType.Static
                ? bytes32(compValue)
                : keccak256(compValue);
    }

    function _compressCompValues(
        ParameterType paramType,
        bytes[] calldata compValues
    ) private pure returns (bytes32[] memory) {
        bytes32[] memory result = new bytes32[](compValues.length);
        for (uint256 i = 0; i < compValues.length; i++) {
            result[i] = _compressCompValue(paramType, compValues[i]);
        }

        return result;
    }

    function _splitCompValue(
        ParameterType paramType,
        bytes memory compValue
    ) private pure returns (bytes32[] memory) {
        assert(paramType == ParameterType.Dynamic32);

        uint256 length = compValue.length / 32;
        bytes32[] memory result = new bytes32[](length);

        uint256 index;
        for (uint256 i = 0; i < length; ++i) {
            bytes32 chunk;
            assembly {
                chunk := mload(add(compValue, i))
            }
            result[index] = chunk;
            index++;
        }

        return result;
    }
}
