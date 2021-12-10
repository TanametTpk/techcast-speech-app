import React from 'react'
import AvaliableForm from '../AvaliableForm'
import { Props } from '../SourceForm'
import TextFieldSource from '../TextFieldSource'

const TeachableForm: React.FC<Props> = (props: Props) => {
    return (
        <AvaliableForm
            sourceName="Teachable Machine"
            onCheck={(check) => {
                let sources = props.sources
                sources.teachable.allow = check
                props.setSources(sources)
            }}
            value={props.sources.teachable.allow}
        >
            <TextFieldSource
                title="Model url (Shareable link)"
                placeholder="https://teachablemachine.withgoogle.com/models/...../"
                onChange={(e) => {
                    let sources = props.sources
                    sources.teachable.url = e.target.value
                    props.setSources(sources)
                }}
                value={props.sources.teachable.url}
            />

            <TextFieldSource
                title="Probability Threshold"
                placeholder="Threshold (more detail at teachable machine github readme)"
                numberic
                onChange={(interval: number) => {
                    let sources = props.sources
                    sources.teachable.probabilityThreshold = interval
                    props.setSources(sources)
                }}
                min={0.1}
                max={1}
                value={props.sources.teachable.probabilityThreshold || 0.75}
            />

            <TextFieldSource
                title="OverlapFactor"
                placeholder="Factor (more detail at teachable machine github readme)"
                numberic
                onChange={(interval: number) => {
                    let sources = props.sources
                    sources.teachable.overlapFactor = interval
                    props.setSources(sources)
                }}
                min={0.1}
                max={1}
                value={props.sources.teachable.overlapFactor || 0.5}
            />
            <p>
                ใช้ class ใน teachable machine มา Match กับ words ในหน้า commands (ต่อเน็ตด้วย!!)
            </p>
            <p>
                ปล. ไม่แนะนำให้ใช้คู่กับอันอื่นๆ เพราะ มันทำให้เกิด bug ได้ เช่น ทำให้ทำงานซ้ำหลายครั้ง (เปิดปิดใหม่ก็หายแหล่ะ)
            </p>
        </AvaliableForm>
    )
}

export default TeachableForm