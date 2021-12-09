import React from 'react'
import MacroItem from './MacroItem'

interface Props {
    macros: string[]
    onPlay: (name: string) => void
    onDelete: (name: string) => void
    onRename: (name: string) => void
}

const MacroList: React.FC<Props> = ({ macros, onPlay, onRename, onDelete }) => {
    return (
        <div className="macro-list-container">
            {
                macros.map((macro: string, index: number) => {
                    return <MacroItem
                                onPlay={onPlay}
                                onRename={onRename}
                                onDelete={onDelete}
                                macro={macro}
                                key={index} 
                            />
                })
            }
        </div>
    )
}

export default MacroList
