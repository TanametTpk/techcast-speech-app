import React from 'react'
import AvaliableForm from '../AvaliableForm'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const DiscordForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Discord"
            onCheck={(check) => {
                let sources = props.sources
                sources.discord.allow = check
                props.setSources(sources)
            }}
            value={props.sources.discord.allow}
        >
            <TextFieldSource
                title="Discord Token"
                placeholder="token"
                onChange={(e) => {
                    let sources = props.sources
                    sources.discord.token = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.discord.token}
            />
        </AvaliableForm>
    )
}

export default DiscordForm