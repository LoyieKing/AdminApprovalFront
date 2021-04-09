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
import { ApprovalTable, deleteApprovalTable, getApprovalTables } from 'commons/api/approval/manage';
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
        selectTableId: 0
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
        const params = {
            ...values,
        };

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true })
        getApprovalTables()
            .then(resp => {
                const dataSource = purifyResponse(resp.data)
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
        this.setState({ selectTableId: selectData.id, })
    }

    render() {
        const {
            loading,
            dataSource,
            visible,
            selectTableId,
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
                        <MenuSelect value={this.state.selectedOrganizes}
                            onChange={(value) => this.setState({ selectedOrganizes: value })}
                        />
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
