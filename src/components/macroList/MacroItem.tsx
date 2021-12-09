import React, {useState} from 'react'
import { Button, Tooltip } from 'antd';
import { PlayCircleOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
    macro: string
    onRename: (name: string) => void
    onPlay: (name: string) => void
    onDelete: (name: string) => void
}

const MacroItem: React.FC<Props> = ({ macro, onPlay, onRename, onDelete }) => {
    const [isHover, setHover] = useState<boolean>(false)

    return (
        <div className="macro-item-container"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {
                isHover ?
                <div className="controller">
                    <Tooltip title={`Play ${macro}`}>
                        <Button
                            onClick={() => onPlay(macro)}
                            type="primary"
                            shape="circle"
                            icon={<PlayCircleOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title={`Rename ${macro}`}>
                        <Button
                            onClick={() => onRename(macro)}
                            type="primary"
                            shape="circle"
                            icon={<SettingOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title={`Delete ${macro}`}>
                        <Button
                            onClick={() => onDelete(macro)}
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </div>
                :
                <>
                    {macro}
                </>
            }
        </div>
    )
}

export default MacroItem
