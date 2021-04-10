
export default function getMenus() {
    return Promise.resolve([
        { key: 'system', text: '系统管理', icon: 'user', order: 900 },
        { key: 'user', parentKey: 'system', text: '用户管理', icon: 'user', path: '/users', order: 900 },
        { key: 'organize', parentKey: 'system', text: '组织管理', icon: 'align-left', order: 900 },
        { key: 'organizemanage', parentKey: 'organize', text: '组织管理', icon: 'align-left', path: '/organizes', order: 900 },
        { key: 'organizecatnamage', parentKey: 'organize', text: '组织类型管理', icon: 'align-left', path: '/organize/cat', order: 900 },
        { key: 'userorg', parentKey: 'system', text: '用户组织管理', icon: 'align-left', path: '/userorg', order: 900 },


        { key: 'role', parentKey: 'system', text: '角色管理', icon: 'lock', path: '/roles', order: 900 },

        { key: 'approval', parentKey: 'system', text: '审批模板管理', icon: 'lock', order: 900 },
        { key: 'approvalinfomanage', parentKey: 'approval', text: '信息模板管理', icon: 'lock', path: '/approval/info/manage', order: 900 },
        { key: 'approvalmanage', parentKey: 'approval', text: '审批模板管理', icon: 'lock', path: '/approval/manage', order: 900 },


        { key: 'menu', parentKey: 'system', text: '菜单查看', icon: 'align-left', path: '/menus', order: 900 },

        { key: 'approvalapproval', text: '审批管理', icon: 'ant-design', order: 800 },
        { key: 'approval-wait-approval', parentKey: 'approvalapproval', text: '待审批流', icon: 'ant-design', path: '/approval/manage/wait', order: 800 },
        { key: 'approval-all-approval', parentKey: 'approvalapproval', text: '所有审批记录', icon: 'ant-design', path: '/approval/manage/all', order: 800 },

        { key: 'approval-new', text: '我发起的审批', icon: 'ant-design', order: 800 },
        { key: 'approval-new-approval', parentKey: 'approval-new', text: '发起审批', icon: 'ant-design', path: '/approval/my/new', order: 800 },
        { key: 'approval-all-my-info', parentKey: 'approval-new', text: '我的信息', icon: 'ant-design', path: '/approval/my/info', order: 800 },
        { key: 'approval-wait-my-approval', parentKey: 'approval-new', text: '我的审批中', icon: 'ant-design', path: '/approval/my/wait', order: 800 },
        { key: 'approval-all-my-approval', parentKey: 'approval-new', text: '审批历史', icon: 'ant-design', path: '/approval/my/all', order: 800 },

    ]);

}
