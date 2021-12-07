import React from 'react'
import { Configs } from 'utils/loadConfig'
import { Card  } from 'antd';
import YoutubeForm from './YoutubeForm/YoutubeForm';
import DiscordForm from './DiscordForm/DiscordForm';
import FacebookForm from './FacebookForm/FacebookForm';
import TwitchForm from './TwitchForm/TwitchForm';
import WebHookForm from './WebHookForm/WebHookForm';

export interface Props {
    setSources: (sources: Configs) => void
    sources: Configs
}

const SourcesForm: React.FC<Props> = (props: Props) => {
    let Sources: React.FC<Props>[] = [
        YoutubeForm,
        TwitchForm,
        DiscordForm,
        FacebookForm,
        WebHookForm
    ]

    return (
        <Card style={{padding: '12px'}}>
            {
                Sources.map((Source: React.FC<Props>, key: number) => <Source key={key} {...props} />)
            }
        </Card>
    )
}

export default SourcesForm