type User = {
  permissions: string[];
  roles: string[];
}

type ValidateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
}

export function validateUserPermissions({ user, permissions, roles }: ValidateUserPermissionsParams) {
  // Verificas se tem todas as permissões
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every(permissions => {
      return user.permissions.includes(permissions);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  // Verifica se tem todas as funções (ex: adm, visitante, user)
  if (roles?.length > 0) {
    const hasAllRoles = roles.some(roles => {
      return user.roles.includes(roles);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}