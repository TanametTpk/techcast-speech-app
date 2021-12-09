import React from 'react'
import AvaliableForm from '../AvaliableForm'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const TwitchForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Twitch"
            onCheck={(check) => {
                let sources = props.sources
                sources.twitch.allow = check
                props.setSources(sources)
            }}
            value={props.sources.twitch.allow}
        >
            <TextFieldSource
                title="Twitch Channel Name"
                placeholder="channel name"
                onChange={(e) => {
                    let sources = props.sources
                    sources.twitch.channel = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.twitch.channel}
            />
        </AvaliableForm>
    )
}

export default TwitchForm