import { Select  } from 'antd';
import React from 'react'
import styles from './SourceForm.module.scss';
import { TextFieldSourceProps } from './TextFieldSource';

interface SelectionInputProps {
    choices: string[]
}

const SelectionInput: React.FC<TextFieldSourceProps & SelectionInputProps> = ({
    title,
    placeholder,
    onChange,
    value,
    choices
}) => {

    return (
        <div>
            <h2 className={styles["textfield"]}>{title}</h2>
            <div style={{padding: '0 24px'}}>
                <Select
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                >
                    {
                        choices.map((choice: string, index: number) => (
                            <Select.Option value={choice} key={index}>{choice}</Select.Option>
                        ))
                    }
                </Select>
            </div>
        </div>
    )
}

export default SelectionInput