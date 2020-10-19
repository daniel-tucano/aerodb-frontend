import React, { useState, useRef } from 'react'

import './CopyPanel.css'

type CopyPanelProps = {
    title: string | Element,
    copyText: string,
}

const CapyPanel: React.FC<CopyPanelProps> = (props) => {

    const [isCopied, setIsCopied] = useState(false)

    const copyPanelTextRef = useRef<any>()

    const onCopy = () => {
        if (!isCopied) {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 750)

            if(copyPanelTextRef.current) {
                navigator.clipboard.writeText(props.copyText)
            }
        }
    }

    return (
        <div className='copy-panel-wrapper'>
            <div className="copy-panel-title">
                {props.title}
            </div>

            <div className={`copy-panel-btn ${isCopied ? 'copied' : 'not-copied'}`} onClick={onCopy}>
                <i className={`material-icons ${isCopied ? 'copied-icon' : 'not-copied-icon'}`}> {isCopied ? "done" : "content_copy"}</i>
                <span>{isCopied ? '': 'copy'}</span>
            </div>

            <div className="copy-panel-copy-text" ref={copyPanelTextRef}>
                {props.copyText}
            </div>
        </div>
    )
}

export default CapyPanel
