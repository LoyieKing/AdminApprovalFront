import React, { Component } from 'react';
import { Button, Form, Row, Col, FormInstance, message } from 'antd';
import { PageContent } from 'ra-lib';
import config from 'commons/config-hoc';
import MenuSelect from 'pages/menus/MenuSelect';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
} from 'ra-lib';
import EditModal from './EditModal';
import './style.less';
import { getOrganizeCats, OrganizeCat } from 'commons/api/organize';
import { deleteRole, getRoles, Role } from 'commons/api/role';
import { purifyResponse } from 'commons/utils';

@config({
    path: '/roles',
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as Role[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
        loadingRoleMenu: false, // 查询角色权限 loading标识
        selectedKeys: [],   // 角色对应的菜单
        selectedRoleId: undefined, // 当前选中角色
        cats: [] as OrganizeCat[],
        data: {} as Partial<Role>
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '角色名称', dataIndex: 'name', width: 150 },
        {
            title: '组织类型', dataIndex: 'organizeCategoryId',
            render: (value) => {
                return this.state.cats.find(it => it.id == value)?.name ?? ""
            }
        },
        { title: '级别', dataIndex: 'organizeDutyLevel' },
        { title: '审批类型', dataIndex: 'availableApprovals' },
        { title: '描述', dataIndex: 'description' },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '修改',
                        onClick: (e) => {
                            e.stopPropagation();
                            console.log(record);
                            this.setState({ visible: true, data: record });
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: (e) => {
                                e.stopPropagation();
                                this.handleDelete(id);
                            },
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    componentDidMount() {
        this.handleSubmit({});

        getOrganizeCats()
            .then(resp => {
                let cats = purifyResponse(resp.data)
                this.setState({ cats })
            })
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const params = {
            ...values,
        };

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true });
        getRoles()
            .then(resp => {
                const dataSource = purifyResponse(resp.data)
                this.setState({ dataSource })
                if (dataSource[0]) this.handleRowClick(dataSource[0])
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });
        deleteRole(id)
            .then(resp => {
                if (resp.data.success) {
                    message.success("删除成功")
                    this.handleSubmit({})
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ deleting: false }))
    };

    handleRowClick = (index) => {
        const menus = this.state.dataSource[index]?.availableMenus ?? []
        
    };

    handleSaveRoleMenu = () => {
        const { selectedKeys } = this.state;

        const params = { ids: selectedKeys };
        this.setState({ loading: true });
        // this.props.ajax.post('/mock/roles/menus', params, { successTip: '保存角色权限成功！' })
        //     .then(res => {

        //     })
        //     .finally(() => this.setState({ loading: false }));
    };

    render() {
        const {
            loading,
            dataSource,
            visible,
            id,
            selectedRoleId,
            selectedKeys,
            loadingRoleMenu,
        } = this.state;

        const formProps = {
            width: 220,
            style: { paddingLeft: 16 },
        };

        const selectedRoleName = dataSource.find(item => item.id === selectedRoleId)?.name;

        return (
            <PageContent styleName="root" loading={loading || loadingRoleMenu}>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={this.form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="角色名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button onClick={() => this.form.current.resetFields()}>重置</Button>
                                <Button type="primary" onClick={() => this.setState({ visible: true, data: {} })}>添加</Button>
                            </FormElement>
                            <div className="role-menu-tip">
                                {selectedRoleName ? <span>当前角色权限：「{selectedRoleName}」</span> : <span>请在左侧列表中选择一个角色！</span>}
                                <Button disabled={!selectedRoleName} type="primary" onClick={this.handleSaveRoleMenu}>保存权限</Button>
                            </div>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Row>
                    <Col span={14}>
                        <Table
                            rowClassName={record => {
                                if (record.id === selectedRoleId) return 'role-table selected';

                                return 'role-table';
                            }}
                            serialNumber
                            columns={this.columns}
                            dataSource={dataSource}
                            rowKey="id"
                            onRow={(record, index) => {
                                return {
                                    onClick: () => this.handleRowClick(index),
                                };
                            }}
                        />
                    </Col>
                    <Col span={10}>
                        <MenuSelect
                            value={selectedKeys}
                            onChange={selectedKeys => this.setState({ selectedKeys })}
                        />
                    </Col>
                </Row>
                <EditModal
                    cats={this.state.cats}
                    visible={visible}
                    data={this.state.data}
                    onOk={() => this.setState({ visible: false }, this.form.current.submit)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
