import { Tag } from 'antd'
import React from 'react'


export function ApprovalState(props: { state: string }) {
    switch (props.state) {
        case 'waiting': return <Tag color="processing">等待审批</Tag>
        case 'approve': return <Tag color="success">审批通过</Tag>
        case 'reject': return <Tag color="error">被拒绝</Tag>
    }
}

export function renderApprovalState(value) {
    return <ApprovalState state={value} />
}