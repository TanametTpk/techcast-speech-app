import React from 'react'
import AvaliableForm from '../AvaliableForm'
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
            <p>
                อย่าลืมต่อเน็ตละ เดี๋ยวใช้ไม่ได้นะ!!
            </p>
        </AvaliableForm>
    )
}

export default GoogleSpeechForm