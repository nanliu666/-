const getters = {
  userInfo: (state) => state.user.userInfo,
  unreadCount: (state) => state.user.unreadCount,
  userId: (state) => state.user.userInfo.user_id,
  companyId: (state) => state.user.userInfo.company_id,
  token: (state) => state.user.token,
  roles: (state) => state.user.roles,
  privileges: (state) => state.user.privileges,
  menu: (state) => state.user.menu,
  menuAll: (state) => state.user.menuAll,
  tenantContent: (state) => state.user.tenantContent,
  menuLoading: (state) => state.user.menuLoading,
  orgIds: (state) => state.user.orgIds,
  diyInfor: (state) => state.diyInfor
}
export default getters
