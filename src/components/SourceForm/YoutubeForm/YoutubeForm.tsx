import React from 'react'
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Props } from '../SourceForm';
import AvaliableForm from '../AvaliableForm';
import YoutubeApiForm from './YoutubeApiForm';
import YoutubeScripingForm from './YoutubeScripingForm';

const YoutubeForm: React.FC<Props> = (props: Props) => {
    const onChangeMethod = (e: CheckboxChangeEvent) => {
        let sources = props.sources
        sources.youtube.useAPI = e.target.checked
        props.setSources(sources)
    }

    return (
        <AvaliableForm
            sourceName="Youtube"
            onCheck={(check) => {
                let sources = props.sources
                sources.youtube.allow = check
                props.setSources(sources)
            }}
            value={props.sources.youtube.allow}
        >
            <Checkbox
                onChange={onChangeMethod}
                checked={props.sources.youtube.useAPI}
            >
                use youtube APIs
            </Checkbox>
            {
                props.sources.youtube.useAPI 
                ? <YoutubeApiForm {...props} />
                : <YoutubeScripingForm {...props} />
            }
        </AvaliableForm>
    )
}

export default YoutubeForm