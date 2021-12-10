import React from 'react'
import AvaliableForm from '../AvaliableForm'
import SelectionInput from '../SelectionInput'
import { Props } from '../SourceForm'

const GoogleSpeechForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="GoogleSpeech"
            onCheck={(check) => {
                let sources = props.sources
                sources.googlespeech.allow = check
                props.setSources(sources)
            }}
            value={props.sources.googlespeech.allow}
        >
            <SelectionInput 
                title="Language"
                placeholder="Select a Language"
                onChange={(value) => {
                    let sources = props.sources
                    sources.googlespeech.language = value
                    props.setSources(sources)
                }}
                value={props.sources.googlespeech.language}
                choices={[
                    'th-TH',
                    'en-EN'
                ]}
            />
            <p>
                อย่าลืมต่อเน็ตละ เดี๋ยวใช้ไม่ได้นะ!!
            </p>
        </AvaliableForm>
    )
}

export default GoogleSpeechForm