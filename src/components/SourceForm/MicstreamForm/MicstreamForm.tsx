import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import React from 'react'
import AvaliableForm from '../AvaliableForm'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const MicstreamForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Micstream"
            onCheck={(check) => {
                let sources = props.sources
                sources.micstream.allow = check
                props.setSources(sources)
            }}
            value={props.sources.micstream.allow}
        >
            <TextFieldSource
                title="Micstream Low Ratio (use 'miclow' as words to trigger action)"
                placeholder=""
                numberic
                onChange={(interval: number) => {
                    let sources = props.sources
                    if (sources.micstream.ratios.length < 1) {
                        sources.micstream.ratios = [0, 0]
                        sources.micstream.messages = ["", ""]
                    }
                    sources.micstream.ratios[0] = interval
                    sources.micstream.messages[0] = "miclow"
                    props.setSources(sources)
                }}
                min={0}
                value={ props.sources.micstream.ratios.length > 0 ? props.sources.micstream.ratios[0] : 0}
            />

            <TextFieldSource
                title="Micstream High Ratio (use 'michigh' as words to trigger action)"
                placeholder=""
                numberic
                onChange={(interval: number) => {
                    let sources = props.sources
                    if (sources.micstream.ratios.length < 1) {
                        sources.micstream.ratios = [0, 0]
                        sources.micstream.messages = ["", ""]
                    }
                    sources.micstream.ratios[1] = interval
                    sources.micstream.messages[1] = "michigh"
                    props.setSources(sources)
                }}
                min={0}
                value={ props.sources.micstream.ratios.length > 1 ? props.sources.micstream.ratios[1] : 0}
            />
            <p>
                ใช้ระดับเสียงในการเล่น (ใส่ _notActive ใน word ได้ถ้าต้องการให้ เวลาไม่ได้พูดเกิด action)
            </p>
            <p>
                แนะนำว่าอย่าเปิด message ให้ขึ้น ไม่งั้นโปรแกรมค้างแน่
            </p>
        </AvaliableForm>
    )
}

export default MicstreamForm