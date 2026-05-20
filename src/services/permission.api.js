import api from "./api"; // Ensure main API interceptor is used

// Get the full matrix of permissions by roles
export const getPermissionMatrix = async () => {
    const res = await api.get("/admin/permissions/matrix");
    return res.data;
};

// Create a new permission entirely
export const createPermission = async (data) => {
    const res = await api.post("/admin/permissions", data);
    return res.data;
};

// Assign a permission to a role
export const assignRolePermission = async (role, permissionId) => {
    const res = await api.post("/admin/permissions/role", { role, permissionId });
    return res.data;
};

// Toggle a permission for a role
export const toggleRolePermission = async (role, permissionId) => {
    const res = await api.post("/admin/permissions/role/toggle", { role, permissionId });
    return res.data;
};

// Assign a special permission overriding user role
export const assignUserPermission = async (targetUserId, permissionId) => {
    const res = await api.post("/admin/permissions/user", { targetUserId, permissionId });
    return res.data;
};

// Remove a permission from a role (need the relation ID)
export const removeRolePermission = async (id) => {
    const res = await api.delete(`/admin/permissions/role/${id}`);
    return res.data;
};
