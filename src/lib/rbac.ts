// filepath: src/lib/rbac.ts
export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export function canAccess(
  roleOrUser: Role | { permissions: Permission[] },
  resource: string,
  action: string
): boolean {
  return roleOrUser.permissions.some(
    (perm) => perm.resource === resource && perm.action === action
  );
}