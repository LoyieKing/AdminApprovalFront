import React, { Component } from 'react';
import { Button, message } from 'antd';
import { Icon } from 'ra-lib';
import config from 'commons/config-hoc';
import { PageContent } from 'ra-lib';
import { tree } from 'ra-lib';
import { Table, ToolBar, Operator } from 'ra-lib';
import EditModal from './EditModal';
import BatchAddModal from './BatchAddModal';
import './style.less';
import { deleteOrganize, getOrganizeCats, getOrganizes, Organize, OrganizeCat } from 'commons/api/organize';
import { purifyResponse } from 'commons/utils';
import { TableDataSource } from 'commons/types';

@config({
    path: '/organizes',
})
export default class index extends Component {
    state = {
        loading: false,
        menus: [],
        visible: false,
        batchAddVisible: false,
        record: {},
        iconVisible: false,
        data: null as (Organize & { parentKey: number }) & { cats: OrganizeCat[] },
        cats: [] as OrganizeCat[]
    };

    columns: TableDataSource<Organize> = [
        {
            title: '名称', dataIndex: 'name', key: 'categoryId', width: 300,
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon} /> {value}</span>;

                return value;
            },
        },
        {
            title: '组织类型', dataIndex: 'categoryId', key: 'categoryId', width: 150,
            render: (value, record) => {
                const cat = this.state.cats.find(it => it.id == value)
                return cat?.name ?? value
            }
        },
        {
            title: '操作', dataIndex: 'operator', key: 'operator', width: 180,
            render: (value, record) => {
                // 要有type
                const items = [
                    {
                        label: '编辑',
                        icon: 'form',
                        onClick: () => this.setState({ data: { ...record }, visible: true }),
                    },
                    {
                        label: '删除',
                        icon: 'delete',
                        color: 'red',
                        confirm: {
                            title: '您请确定要删除此节点及其子节点吗？',
                            onConfirm: () => this.handleDeleteNode(record),
                        },
                    },
                    {
                        label: '添加子菜单',
                        icon: 'folder-add',
                        onClick: () => this.setState({ data: { parentKey: record.id }, visible: true }),
                    },
                    {
                        label: '批量添加子菜单',
                        icon: 'bars',
                        onClick: () => this.setState({ data: { parentKey: record.id }, batchAddVisible: true }),
                    },
                ];
                return <Operator items={items} />;
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
        getOrganizeCats().then(resp => {
            const data = purifyResponse(resp.data)
            this.setState({ cats: data })
        })
    }

    mapTree(data?: Organize[], parent?: Organize) {
        if (!data || data.length == 0) return undefined
        return data.map(item => ({ key: item.id, parentKey: parent?.id, children: this.mapTree(item.subOrganizes, item), ...item }))
    }

    handleSearch() {
        this.setState({ loading: true });
        // this.props.ajax
        //     .get('/menus')
        getOrganizes()
            .then(resp => {
                const data = purifyResponse(resp.data) ?? []
                const menus = this.mapTree(data)
                this.setState({ menus })
            })
            .finally(() => this.setState({ loading: false }));
    }

    handleAddTopMenu = () => {
        this.setState({ data: { type: '1' }, visible: true });
    };

    handleDeleteNode = async (record) => {
        const { id } = record;
        this.setState({ loading: true });
        let resp = await deleteOrganize(id)
        purifyResponse(resp.data)
        this.handleSearch()
        this.setState({ loading: false })
    };

    render() {
        const {
            menus,
            visible,
            batchAddVisible,
            loading,
            data,
        } = this.state;

        return (
            <PageContent styleName="root">
                <ToolBar>
                    <Button type="primary" onClick={this.handleAddTopMenu}>添加顶级</Button>
                </ToolBar>

                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={menus}
                    pagination={false}
                />
                <EditModal
                    visible={visible}
                    data={data}
                    cats={this.state.cats}
                    onOk={() => this.setState({ visible: false }, this.handleSearch)}
                    onCancel={() => this.setState({ visible: false })}
                />
                <BatchAddModal
                    visible={batchAddVisible}
                    data={data}
                    onOk={() => this.setState({ batchAddVisible: false }, this.handleSearch)}
                    onCancel={() => this.setState({ batchAddVisible: false })}
                />
            </PageContent>
        );
    }
}

