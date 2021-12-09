import { Input, InputNumber } from 'antd';
import React from 'react'

export interface TextFieldSourceProps {
    title: string
    placeholder: string
    numberic?: boolean
    onChange?: (event: any) => void
    value: any
}

const TextFieldSource: React.FC<TextFieldSourceProps> = ({
    title,
    placeholder,
    numberic,
    onChange,
    value
}) => {

    return (
        <div>
            <h2 className="textfield">{title}</h2>
            <div style={{padding: '0 24px'}}>
                {
                    numberic ? 
                      <InputNumber
                        min={100}
                        defaultValue={1000}
                        onChange={onChange}
                        value={value}
                    />
                    : <Input placeholder={placeholder} onChange={onChange} value={value} />
                }
            </div>
        </div>
    )
}

export default TextFieldSource