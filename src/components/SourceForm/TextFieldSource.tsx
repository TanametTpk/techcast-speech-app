import { Input, InputNumber } from 'antd';
import React from 'react'

export interface TextFieldSourceProps {
    title: string
    placeholder: string
    numberic?: boolean
    min?: number
    max?: number
    defaultNummber?: number
    onChange?: (event: any) => void
    value: any
}

const TextFieldSource: React.FC<TextFieldSourceProps> = ({
    title,
    placeholder,
    numberic,
    onChange,
    value,
    min,
    max,
    defaultNummber
}) => {

    return (
        <div>
            <h2 className="textfield">{title}</h2>
            <div style={{padding: '0 24px'}}>
                {
                    numberic ? 
                      <InputNumber
                        min={min || undefined}
                        max={max || undefined}
                        defaultValue={defaultNummber || 1000}
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