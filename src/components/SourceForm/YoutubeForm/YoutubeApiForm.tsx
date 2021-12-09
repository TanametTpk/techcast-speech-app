import React from 'react'
import TextFieldSource from '../TextFieldSource';
import { Props } from '../SourceForm';

const YoutubeApiForm: React.FC<Props> = (props: Props) => {
    return (
        <div>
            <TextFieldSource
                title="Youtube API KEY"
                placeholder="API KEY"
                onChange={(e) => {
                    let sources = props.sources
                    sources.youtube.API_KEY = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.youtube.API_KEY}
            />

            <TextFieldSource
                title="Youtube CHANNEL_ID"
                placeholder="CHANNEL_ID"
                onChange={(e) => {
                    let sources = props.sources
                    sources.youtube.CHANNEL_ID = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.youtube.CHANNEL_ID}
            />
        </div>
    )
}

export default YoutubeApiForm