import React from 'react'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const YoutubeScripingForm: React.FC<Props> = (props: Props) => {
    return (
        <div>
            <TextFieldSource
                title="Youtube Stream ID"
                placeholder="Stream ID"
                onChange={(e) => {
                    let sources = props.sources
                    sources.youtube.STREAM_ID = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.youtube.STREAM_ID}
            />

            <TextFieldSource
                title="Youtube Chat Interval (ms)"
                placeholder="Interval"
                numberic
                onChange={(interval: number) => {
                    let sources = props.sources
                    sources.youtube.INTERVAL = interval
                    props.setSources(sources)
                }}
                value={props.sources.youtube.INTERVAL || 1000}
            />
        </div>
    )
}

export default YoutubeScripingForm