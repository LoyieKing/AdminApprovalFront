import React, { Component } from 'react';
import { Button, Form, Row, Col, FormInstance, message, Tag } from 'antd';
import { PageContent } from 'ra-lib';
import config from 'commons/config-hoc';
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
import { ApprovalTable, deleteApprovalTable, getApprovalTables, updateApprovalTable } from 'commons/api/approval/manage';
import { getInfoClasses, InfoClass } from 'commons/api/approval/info/manage';
import MenuSelect from 'pages/organizes/MenuSelect';


const cats = [
    {
        name: "文字",
        value: "text"
    }, {
        name: "图片",
        value: "pic"
    }, {
        name: "时间",
        value: "time"
    }, {
        name: "时间间隔",
        value: "times"
    },
]


@config({
    path: '/approval/manage',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as ApprovalTable[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        data: {} as Partial<ApprovalTable>,
        infoClasses: [] as InfoClass[],
        selectedOrganizes: [] as number[],
        selectTableId: 0,
        selectTableName: null
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '审批表', dataIndex: 'name', width: 150 },
        { title: '类型', dataIndex: 'category', with: 150 },
        {
            title: '字段', dataIndex: 'infoClasses',
            render: (value: number[], record) => {
                return <div>
                    {value.map(id => <Tag color="blue">{this.state.infoClasses.find(it => it.id == id).name}</Tag>)}
                </div>
            }
        },
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
        getInfoClasses()
            .then(resp => {
                const infoClasses = purifyResponse(resp.data)
                this.setState({ infoClasses })
            })
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const value = values?.name ?? ""

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true })
        getApprovalTables()
            .then(resp => {
                const dataSource = purifyResponse(resp.data).filter(it => it.name.indexOf(value) != -1 || it.category.indexOf(value) != -1)
                this.setState({ dataSource })
            })
            .finally(() => this.setState({ loading: false }))
    };

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });
        deleteApprovalTable(id)
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

    handleRowClick(index: number) {
        const selectData = this.state.dataSource[index]
        this.setState({ selectTableId: selectData.id, selectedOrganizes: selectData.ownerOrganizes, selectTableName: selectData.name, data: selectData })
    }

    handleSaveOrganizes() {
        const data = { ...this.state.data }
        data.ownerOrganizes = this.state.selectedOrganizes
        this.setState({ loading: true })
        updateApprovalTable(data)
            .then(resp => {
                if (resp.data.success) {
                    message.success("保存可用组织成功！")
                    this.handleSubmit({})

                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ loading: false }))
    }

    render() {
        const {
            loading,
            dataSource,
            visible,
            selectTableId,
            selectTableName
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
                            <div className="role-menu-tip">
                                {selectTableName ? <span>当前审批表：「{selectTableName}」</span> : <span>请在左侧列表中选择一个审批表！</span>}
                                <Button disabled={!selectTableName} type="primary" onClick={() => this.handleSaveOrganizes()}>保存可用组织</Button>
                            </div>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Row>
                    <Col flex="14">
                        <Table
                            rowClassName={record => {
                                if (record.id === selectTableId) return 'role-table selected';

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
                    <Col flex="10">
                        <MenuSelect
                            value={this.state.selectedOrganizes}
                            onChange={(value) => this.setState({ selectedOrganizes: value })} />
                    </Col>
                </Row>
                <EditModal
                    infoClasses={this.state.infoClasses}
                    visible={visible}
                    data={this.state.data}
                    onOk={() => this.setState({ visible: false }, this.form.current.submit)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
