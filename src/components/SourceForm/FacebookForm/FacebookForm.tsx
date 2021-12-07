import React from 'react'
import AvaliableForm from '../AvaliableForm'
import SelectionInput from '../SelectionInput'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const FacebookForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Facebook"
            onCheck={(check) => {
                let sources = props.sources
                sources.facebook.allow = check
                props.setSources(sources)
            }}
            value={props.sources.facebook.allow}
        >
            <TextFieldSource
                title="Facebook Access Token"
                placeholder="token"
                onChange={(e) => {
                    let sources = props.sources
                    sources.facebook.access_token = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.facebook.access_token}
            />

            <TextFieldSource
                title="Video id"
                placeholder="video id"
                onChange={(e) => {
                    let sources = props.sources
                    sources.facebook.video_id = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.facebook.video_id}
            />

            <SelectionInput 
                title="Comment Rate"
                placeholder="Select a Comment Rate"
                onChange={(value) => {
                    let sources = props.sources
                    sources.facebook.comment_rate = value
                    props.setSources(sources)
                }}
                value={props.sources.facebook.comment_rate}
                choices={[
                    'one_per_two_seconds',
                    'ten_per_second',
                    'one_hundred_per_second'
                ]}
            />
        </AvaliableForm>
    )
}

export default FacebookForm