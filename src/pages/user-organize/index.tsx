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
import { purifyResponse } from 'commons/utils';
import { deleteInfoClass, getInfoClasses, InfoClass } from 'commons/api/approval/info/manage';
import { getUsers, UserEntity } from 'commons/api/user';
import { getOrganizes, Organize } from 'commons/api/organize';
import { deleteUserOrganize, getUserOrganizes, UserOrganize } from 'commons/api/userorganize';

@config({
    path: '/userorg',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as UserOrganize[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        data: {} as Partial<UserOrganize>,
        users: [] as UserEntity[],
        orgs: [] as Organize[]
    };

    form = React.createRef<FormInstance>()

    columns = [
        {
            title: '用户', dataIndex: 'userId', width: 150,
            render: (value) => {
                const users = this.state.users
                if (!users) return undefined
                return users.find(it => it.id == value)?.realName
            }
        },
        {
            title: '组织', dataIndex: 'organizeId',
            render: (value) => {
                const orgs = this.state.orgs
                if (!orgs) return undefined
                return orgs?.find(it => it.id == value)?.name
            }
        },
        { title: '级别', dataIndex: 'dutyLevel' },
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
                            title: `确定删除?`,
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
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const params = {
            ...values,
        };


        this.setState({ loading: true })
        getUsers({ page: 1, rows: 100 }, "")
            .then(resp => {
                const data = purifyResponse(resp.data)
                this.setState({ users: data.rows })
            })

        getOrganizes()
            .then(resp => {
                const data = purifyResponse(resp.data)
                const flatData = []
                this.flatMap(data, flatData)
                this.setState({ orgs: flatData })
            })
        getUserOrganizes()
            .then(resp => {
                const data = purifyResponse(resp.data)
                this.setState({ dataSource: data })
            })
            .finally(() => this.setState({ loading: false }))



    };

    flatMap(orgs: Organize[], flat: Organize[]) {
        orgs.forEach(it => {
            flat.push(it)
            if (it.subOrganizes?.length ?? 0) {
                this.flatMap(it.subOrganizes, flat)
            }
        })
    }

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });
        deleteUserOrganize(id)
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

    render() {
        const {
            loading,
            dataSource,
            visible,
            users,
            orgs,
            data
        } = this.state;

        const formProps = {
            width: 220,
            style: { paddingLeft: 16 },
        };

        return (
            <PageContent styleName="root" loading={loading}>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={this.form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="信息名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button onClick={() => this.form.current.resetFields()}>重置</Button>
                                <Button type="primary" onClick={() => this.setState({ visible: true, data: {} })}>添加</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Table
                    rowClassName="role-table"
                    serialNumber
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
                <EditModal
                    users={users}
                    orgs={orgs}
                    visible={visible}
                    data={data}
                    onOk={() => this.setState({ visible: false }, this.form.current.submit)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
