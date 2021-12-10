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
        </AvaliableForm>
    )
}

export default Wav2vecForm