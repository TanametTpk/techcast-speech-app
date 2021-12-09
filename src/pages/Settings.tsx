import React, {useState, useEffect} from 'react'
import InnerPageLayout from '../layouts/InnerPageLayout'
import { ipcRenderer, IpcRendererEvent } from 'electron'
import styled from 'styled-components'
import { Settings } from '../utils/ConfigWriter'
import isequal from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import SourcesForm from '../components/SourceForm/SourceForm'
import CommandTable from '../components/CommandTable/CommandTable'
import useModal from '../hooks/useModal'
import { CommandConfig, Configs, KeywordConfig } from '../utils/loadConfig'
import CommandForm from '../components/CommandTable/CommandForm'
import { Checkbox, Tooltip } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

const HeaderContainer = styled.div`
    display: flex;
    min-width: 95vw;
    justify-content: space-between;
    padding: 12px;
    align-items: flex-end;
`

// this is really smell code - should we refactor? or we didn't work with this project anymore lol?
const SettingPage = () => {
    const [isCommandTabSelected, setCommandTab]             = useState<boolean>(false)
    const [settings, setSettings]                           = useState<Settings>()
    const [originalSettings, setOriginalSetting]            = useState<Settings>()
    const [isNewModalOpen, newModalOpen, newModalClose]     = useModal()

    useEffect(() => {
        getSetting()

        ipcRenderer.on('settings:received', (_: IpcRendererEvent, settings: Settings) => {
            setSettings(settings)
            setOriginalSetting(cloneDeep(settings))
        })

        return () => {
            ipcRenderer.removeAllListeners('settings:received')
        }
    }, [])

    const getSetting = () => {
        let settings = ipcRenderer.sendSync('settings:get')
        setSettings(settings)
        setOriginalSetting(cloneDeep(settings))
    }

    const saveSetting = () => {
        if (!settings) return
        ipcRenderer.send('settings:save', settings)
        reloadSetting()
    }

    const reloadSetting = () => {
        ipcRenderer.send('system:reload')
    }

    const isSettingChanged = (): boolean => {
        return !isequal(settings, originalSettings)
    }

    const setSources = (sources: Configs): void => {
        if (!settings) return
        
        setSettings({
            ...settings,
            sources
        })
    }

    const setCommand = (commands: CommandConfig): void => {
        if (!settings) return

        setSettings({
            ...settings,
            commands
        })
    }

    const onGetCommand = (config: KeywordConfig) => {
        if (!settings) return
        let commandConfig = settings.commands
        let targets = commandConfig.useReplace ? commandConfig.replaces : commandConfig.commands
        targets = [config, ...targets]

        if (commandConfig.useReplace) commandConfig.replaces = targets
        else commandConfig.commands = targets

        setSettings({
            ...settings,
            commands: commandConfig
        })
    }

    const onDeleteCommand = (index: number) => {
        if (!settings) return
        let commandConfig = settings.commands

        let targets = commandConfig.useReplace ? commandConfig.replaces : commandConfig.commands
        targets = targets.filter((_, target: number) => {
            return target !== index
        })

        if (commandConfig.useReplace) commandConfig.replaces = targets
        else commandConfig.commands = targets
        setSettings({
            ...settings,
            commands: commandConfig
        })
    }

    const onEditCommand = (index: number, config: KeywordConfig) => {
        if (!settings) return
        let commandConfig = settings.commands

        let targets = commandConfig.useReplace ? commandConfig.replaces : commandConfig.commands
        targets = targets.map((conf: KeywordConfig, target: number) => {
            if (target === index) return config
            return conf
        })

        if (commandConfig.useReplace) commandConfig.replaces = targets
        else commandConfig.commands = targets
        setSettings({
            ...settings,
            commands: commandConfig
        })
    }

    return (
        <InnerPageLayout>
            {
                settings && 
                <>
                    <HeaderContainer>
                        <div>
                            <button
                                type="button"
                                className={isCommandTabSelected ? "mainBtn" : "disableBtn"}
                                onClick={() => setCommandTab(false)}
                            >
                                <span role="img" aria-label="books">
                                </span>
                                Sources
                            </button>
                            <button
                                type="button"
                                className={isCommandTabSelected ? "disableBtn" : "mainBtn"}
                                onClick={() => setCommandTab(true)}
                            >
                                <span role="img" aria-label="books">
                                </span>
                                Commands
                            </button>
                        </div>
                        <div>
                            {
                                isCommandTabSelected &&
                                <>
                                    <div style={{ padding: '0 12px' }}>
                                        <Tooltip title="ทับคำเก่าด้วยคำใหม่ (แทนที่ words ให้เป็น command)" >
                                            <Checkbox
                                                style={{color: 'white'}}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    let {commands} = settings
                                                    commands.useReplace = e.target.checked
                                                    setCommand(commands)
                                                }}
                                                checked={settings.commands.useReplace}
                                            >
                                                Use replace
                                            </Checkbox>
                                        </Tooltip>
                                    </div>

                                    <button
                                        type="button"
                                        className="mainBtn"
                                        onClick={() => newModalOpen()}
                                    >
                                        <span role="img" aria-label="books">
                                        📝
                                        </span>
                                        Add Command
                                    </button>

                                </>
                            }
                            <button
                                type="button"
                                className={isSettingChanged() ? "mainBtn" : "disableBtn"}
                                onClick={() => saveSetting()}
                            >
                                <span role="img" aria-label="books">
                                💾
                                </span>
                                Save
                            </button>
                        </div>
                    </HeaderContainer>
                    <div style={{height: '60vh', width: '95vw'}}>
                        {
                            isCommandTabSelected ?
                            <CommandTable
                                commands={settings.commands}
                                onDeleteCommand={onDeleteCommand}
                                onEditCommand={onEditCommand}
                                isReplace={settings?.commands.useReplace}
                            />
                            :
                            <SourcesForm
                                setSources={setSources}
                                sources={settings.sources}
                            />
                        }
                    </div>
                </>
            }
            <CommandForm
                title="Create New Command"
                visible={isNewModalOpen}
                closeModal={newModalClose}
                addNewCommand={onGetCommand}
                isReplace={settings?.commands.useReplace}
            />
        </InnerPageLayout>
    )
}

export default SettingPage
