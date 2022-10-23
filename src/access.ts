/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser?: API.CurrentUser | undefined;
  currentUserTables?: string[];
}) {
  const { currentUser, currentUserTables } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canGetTable: (table: string) => {
      return currentUserTables?.includes(table);
    },
  };
}
