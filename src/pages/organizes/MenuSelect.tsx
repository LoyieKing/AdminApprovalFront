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


type MenuSelectProps = {
    value: number[],
    onChange?: (value: number[]) => void
}

@config()
export default class MenuSelect extends Component<MenuSelectProps> {
    state = {
        loading: false,
        menus: [],
        allMenuKeys: [],
        expandedRowKeys: [],
        cats: [] as OrganizeCat[],
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
        }
    ];

    componentDidMount() {
        this.handleSearch();
        getOrganizeCats().then(resp => {
            const data = purifyResponse(resp.data)
            this.setState({ cats: data })
        })
    }

    mapTree(data: Organize[], parent?: Organize, keys?: number[]) {
        if (!data || data.length == 0) return undefined
        data.forEach(it => keys?.push(it.id))
        return data.map(item => ({ key: item.id, parentKey: parent?.id, children: this.mapTree(item.subOrganizes, item), ...item }))
    }

    handleSearch() {
        this.setState({ loading: true });
        // this.props.ajax
        //     .get('/menus')
        getOrganizes()
            .then(resp => {
                const data = purifyResponse(resp.data) ?? []
                const keys = [] as number[]
                const menus = this.mapTree(data, undefined, keys)
                this.setState({ menus, expandedRowKeys: keys })
            })
            .finally(() => this.setState({ loading: false }));
    }


    handleSelect = (record, selected, selectedRows, nativeEvent) => {
        const { value = [] } = this.props;
        const { menus } = this.state;

        const { id: key } = record;

        let allKeys = [...value];

        // 全选 取消 子级
        const childrenKeys = tree.getGenerationKeys(menus, key);
        const { parentKeys = [] } = record;
        if (selected) {
            // 子级全部加入
            allKeys = allKeys.concat(key, ...childrenKeys);

            // 父级状态 全部加入
            allKeys = allKeys.concat(...parentKeys);
        } else {
            // 子级全部删除
            allKeys = allKeys.filter(item => !(([key, ...childrenKeys]).includes(item)));

            // 判断父级状态 只要有后代选中就加入
            parentKeys.reverse().forEach(pk => {
                const cKs = tree.getGenerationKeys(menus, pk);
                const hasChildSelected = cKs.some(ck => allKeys.includes(ck));

                if (hasChildSelected) {
                    allKeys.push(pk);
                } else {
                    allKeys = allKeys.filter(item => item !== pk);
                }
            });
        }

        const { onChange } = this.props;

        onChange?.call(this, Array.from(new Set(allKeys)));
    };

    handleSelectAll = (selected) => {
        const { allMenuKeys } = this.state;
        const { onChange } = this.props;

        onChange?.call(this, selected ? allMenuKeys : []);
    };

    render() {
        const {
            menus,
            loading,
            expandedRowKeys,
        } = this.state;

        const { value, onChange, ...others } = this.props;

        return (
            <Table
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: expandedRowKeys => this.setState({ expandedRowKeys }),
                }}
                rowSelection={{
                    selectedRowKeys: value,
                    onSelect: this.handleSelect,
                    onSelectAll: this.handleSelectAll,
                }}
                loading={loading}
                columns={this.columns}
                dataSource={menus}
                pagination={false}
                {...others}
            />
        );
    }
}

