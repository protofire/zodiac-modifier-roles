import SUBGRAPH from "./subgraph"
import { ChainId, Target } from "./types"

interface Props {
  address: string
  chainId: ChainId
}

const QUERY = `
  query RolesMod($id: String) {
    rolesModifier(id: $id) {
      address
      owner
      avatar
      target 
      roles {
        members {
          member {
            address
          }
        }
        targets {
          address
        }
      }
    }
  }
`

export const fetchRolesMod = async ({
  address,
  chainId,
}: Props): Promise<RolesModifier> => {
  const res = await fetch(SUBGRAPH[chainId], {
    method: "POST",
    body: JSON.stringify({
      query: QUERY,
      variables: { id: address.toLowerCase() },
      operationName: "Roles",
    }),
  })
  const { data, error } = await res.json()
  if (error) {
    throw new Error(error)
  }
  if (!data || !data.rolesModifier) {
    throw new Error(`Roles modifier ${address} not found on chain #${chainId}`)
  }

  return mapGraphQl(data.rolesModifier)
}

interface RoleSummary {
  key: string
  members: `0x${string}`[]
  targets: `0x${string}`[]
}

interface RolesModifier {
  address: `0x${string}`
  owner: `0x${string}`
  avatar: `0x${string}`
  target: `0x${string}`
  roles: RoleSummary[]
}

const mapGraphQl = (rolesModifier: any): RolesModifier => ({
  ...rolesModifier,
  roles: rolesModifier.roles.map(mapGraphQlRole),
})

const mapGraphQlRole = (role: any): RoleSummary => ({
  key: role.key,
  members: role.members.map((assignment: any) => assignment.member.address),
  targets: role.targets.map((target: any): Target => target.address),
})
