import React from 'react'
import AvaliableForm from '../AvaliableForm'
import SelectionInput from '../SelectionInput'
import { Props } from '../SourceForm'

const Wav2vecForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Wav2vec"
            onCheck={(check) => {
                let sources = props.sources
                sources.wav2vec.allow = check
                props.setSources(sources)
            }}
            value={props.sources.wav2vec.allow}
        >
            <SelectionInput 
                title="Processor"
                placeholder="Select a Processor for Wav2vec model"
                onChange={(value) => {
                    let sources = props.sources
                    sources.wav2vec.processor = value
                    props.setSources(sources)
                }}
                value={props.sources.wav2vec.processor}
                choices={[
                    'cpu',
                    'cuda'
                ]}
            />
            <p>
                Model นี้ใช้ memory ขนาด 4GB ถ้าเป็น cpu ใช้ RAM มากกว่า 8GB = ดี
            </p>
            <p>
                ส่วย cuda จะใช้ GPU ที่คำนวณได้เร็วกว่า แต่จะไปใช้ VRAM แทน
            </p>
        </AvaliableForm>
    )
}

export default Wav2vecForm