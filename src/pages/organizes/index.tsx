import React, { Component } from 'react';
import { Button, message } from 'antd';
import { Icon } from 'ra-lib';
import config from 'commons/config-hoc';
import { PageContent } from 'ra-lib';
import { tree } from 'ra-lib';
import { Table, ToolBar, Operator } from 'ra-lib';
import EditModal, { targetOptions } from './EditModal';
import BatchAddModal from './BatchAddModal';
import './style.less';
import { getOrganizes, Organize } from 'commons/api/organize';

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
        data: []
    };

    columns = [
        {
            title: '名称', dataIndex: 'name', key: 'text', width: 300,
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon} /> {value}</span>;

                return value;
            },
        },
        { title: '基础路径', dataIndex: 'basePath', key: 'basePath', width: 150 },
        { title: '路径', dataIndex: 'path', key: 'path' },
        { title: 'url', dataIndex: 'url', key: 'url', width: 100 },
        {
            title: 'target', dataIndex: 'target', key: 'target', width: 60,
            render: value => {
                const option = targetOptions.find(item => item.value === value);

                return option?.label;
            },
        },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 60,
            render: (value, record) => {
                const { url } = record;
                if (url) return <span style={{ color: 'purple' }}>外站</span>;
                if (value === '1') return <span style={{ color: 'green' }}>菜单</span>;
                if (value === '2') return <span style={{ color: 'orange' }}>功能</span>;

                return <span style={{ color: 'green' }}>菜单</span>;
            },
        },
        // { title: '功能编码', dataIndex: 'code', key: 'code', width: 100 },
        { title: '排序', dataIndex: 'order', key: 'order', width: 60 },
        {
            title: '操作', dataIndex: 'operator', key: 'operator', width: 180,
            render: (value, record) => {
                // 要有type
                const { type = '1' } = record;
                const items = [
                    {
                        label: '编辑',
                        icon: 'form',
                        onClick: () => this.setState({ data: { ...record, type }, visible: true }),
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
                        onClick: () => this.setState({ data: { parentKey: record.key, type: '1' }, visible: true }),
                    },
                    {
                        label: '添加子功能',
                        icon: 'file-add',
                        onClick: () => this.setState({ data: { parentKey: record.key, type: '2' }, visible: true }),
                    },
                    {
                        label: '批量添加子菜单',
                        icon: 'bars',
                        onClick: () => this.setState({ data: { parentKey: record.key }, batchAddVisible: true }),
                    },
                ];
                return <Operator items={items} />;
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
    }

    mapTree(data: Organize[], parent?: Organize) {
        return data.map(item => ({ key: item.id, parentKey: parent?.id, children: this.mapTree(item.subOrganizes, item), ...item }))
    }

    handleSearch() {
        this.setState({ loading: true });
        // this.props.ajax
        //     .get('/menus')
        getOrganizes()
            .then(resp => {
                const data = resp.data
                if (data.success === false) {
                    message.error(data.message)
                }
                else if (data.success) {
                    const menus = this.mapTree(data.data)
                    this.setState({ menus })
                }

            })
            .finally(() => this.setState({ loading: false }));
    }

    handleAddTopMenu = () => {
        this.setState({ data: { type: '1' }, visible: true });
    };

    handleDeleteNode = (record) => {
        const { id } = record;
        this.setState({ loading: true });
        // this.props.ajax
        //     .del(`/menus/${id}`)
        //     .then(() => {
        //         this.setState({ visible: false });
        //         this.handleSearch();
        //     })
        //     .finally(() => this.setState({ loading: false }));
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

