import React, {useState, useEffect} from 'react'
import InnerPageLayout from '../layouts/InnerPageLayout'
import MacroList from '../components/macroList/MacroList'
import { Modal, Input, Card } from 'antd';
import { useAtom } from 'jotai';
import { socketAtom } from '../state/socket';
import { macroAtom, MacroStoreValue } from '../state/macroStote';
import find from 'lodash.find';

const Macro = () => {
    const [socket,] = useAtom(socketAtom)
    const [macroInfo, setMacroInfo] = useAtom(macroAtom)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [targetMacroName, setTargetMacroName] = useState<string>("")
    const [newMacroName, setNewMacroName] = useState<string>("")

    useEffect(() => {
        socket.on("macros:update", (macroInfo: MacroStoreValue) => {
            console.log(macroInfo);
            setMacroInfo(macroInfo)
        })

        socket.emit("macros:getAll")

        return () => {
            socket.removeAllListeners("macros:update")
        }
    }, [])

    const recordMacro = () => {
        const max: number = Number.MAX_SAFE_INTEGER
        const min: number = 1
        const randomName: string = `macro-${Math.floor(Math.random() * (max - min) + min)}`
        socket.emit("macros:record", {name: randomName})
    }

    const playMacro = (name: string) => {
        socket.emit("macros:play", {name})
    }

    const renameMacro = (name: string) => {
        setTargetMacroName(name)
        showModal()
    }

    const deleteMacro = (name: string) => {
        socket.emit("macros:remove", {name})
    }

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        if (! /^[a-zA-Z0-9 ]+$/.test(newMacroName)) {
            Modal.error({
                title: 'Can not use this name',
                content: "name should be english and number only (a-z, A-Z, 0-9)"
            })
            return
        }
        socket.emit("macros:update", {oldName:targetMacroName, newName: newMacroName})
        setTargetMacroName("")
        setNewMacroName("")
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setTargetMacroName("")
        setNewMacroName("")
    }

    const getPlayingMacro = (): string => {
        if (!macroInfo) return ""
        return find(Object.keys(macroInfo.playingMacroStatus), (key: string) => macroInfo.playingMacroStatus[key]) || ""
    }

    return (
        <InnerPageLayout disableBack={macroInfo?.isRecord || getPlayingMacro().length > 0}>
            <div style={{color:'black'}}>
                {
                    getPlayingMacro() ?
                    <Card>
                        <h1>{getPlayingMacro()} are playing</h1>
                        <p>Press Esc to stop</p>
                    </Card>
                    :
                    <>
                        <div>
                            <button
                                type="button"
                                className={macroInfo?.isRecord ? "disableBtn" : "mainBtn"}
                                disabled={macroInfo?.isRecord}
                                onClick={recordMacro}
                            >
                                {
                                    !macroInfo?.isRecord ?
                                    <>
                                        <span role="img" aria-label="books">
                                        🔴
                                        </span>
                                        Record (F6)
                                    </>
                                    : <> To Stop Record Press Esc </>
                                }
                            </button>
                        </div>
                        <MacroList
                            onPlay={playMacro}
                            onRename={renameMacro}
                            onDelete={deleteMacro}
                            macros={macroInfo?.avaliable_macros || []}
                        />
                    </>
                }
            </div>
            <Modal title="Update Macro Name" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input
                    placeholder="Enter macro name here"
                    value={newMacroName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewMacroName(event.target.value)}    
                />
            </Modal>
        </InnerPageLayout>
    )
}

export default Macro