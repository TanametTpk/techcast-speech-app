import { Checkbox, Card  } from 'antd';
import React from 'react'

interface AvaliableFormProps {
    sourceName: string
    value: any
    onCheck: (check: boolean) => void
}

const AvaliableForm: React.FC<AvaliableFormProps> = ({sourceName, children, onCheck, value}) => {
    return (
        <div>
            <h1 className="header">
                {sourceName}
            </h1>
            <Checkbox
                onChange={(e) => {
                    onCheck(e.target.checked)
                }}
                checked={value}
            >
                avaliable {sourceName.toLowerCase()}
            </Checkbox>
            {
                value &&
                <Card style={{padding: "12px"}}>
                    { children }
                </Card>
            }
        </div>
    )
}

export default AvaliableForm