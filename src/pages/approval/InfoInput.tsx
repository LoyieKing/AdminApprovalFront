

import { DatePicker, Input } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';

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

export type InfoInputProps = {
    type: string
    value?: string,
    onChange?: (value: string) => void
    [P: string]: any
}

export default class InfoInput extends Component<InfoInputProps> {
    render() {
        const { type, value, onChange, ...props } = this.props


        switch (type) {
            case 'text': return <Input.TextArea {...props} value={value} onChange={(val) => onChange?.call(this, val)} />
            case 'time': return <DatePicker {...props} value={moment(value)} onChange={(val) => onChange?.call(this, val.format())} />
            case 'times': {
                if (value) {
                    const moments = value.split(",").map(it => moment(parseInt(it)))
                    return <DatePicker.RangePicker {...props} value={[moments[0], moments[1]]} onChange={(val) => onChange?.call(this, val[0] + "," + val[1])} />
                } else {
                    return <DatePicker.RangePicker {...props} onChange={(val) => onChange?.call(this, val[0] + "," + val[1])} />
                }
            }
            default: return null
        }
    }
}


class PictureUpload extends Component {

}