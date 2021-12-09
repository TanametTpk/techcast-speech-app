
import React from 'react'
import AvaliableForm from '../AvaliableForm'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const WebHookForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Webhook"
            onCheck={(check) => {
                let sources = props.sources
                sources.webhooks.allow = check
                props.setSources(sources)
            }}
            value={props.sources.webhooks.allow}
        >
            <TextFieldSource
                title="Webhook url"
                placeholder="url"
                onChange={(e) => {
                    let sources = props.sources
                    sources.webhooks.urls = [e.target.value]
                    props.setSources(sources)
                }}
                value={props.sources.webhooks.urls}
            />
        </AvaliableForm>
    )
}

export default WebHookForm