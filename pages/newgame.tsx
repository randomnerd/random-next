import React, { useState } from 'react'
import { EuiCheckbox, EuiRange, EuiTitle } from '@elastic/eui';

const NewGame = () => {
    const [wordCount, setWordCount] = useState(30)
    const [roundTime, setRoundTime] = useState(60)
    const [skipPenalty, setSkipPenalty] = useState(true)
    return (
        <div className="NewGame">
            <EuiTitle size="xxs">
                <h4>Words to win: {wordCount}</h4>
            </EuiTitle>
            <EuiRange
                step={5}
                value={wordCount}
                min={10}
                max={200}
                onChange={(e) => setWordCount(Number(e.currentTarget.value))}

            />
            <EuiTitle size="xxs">
                <h4>Round time: {roundTime}</h4>
            </EuiTitle>
            <EuiRange
                showLabels={true}
                step={5}
                value={roundTime}
                min={10}
                max={120}
                onChange={(e) => setRoundTime(Number(e.currentTarget.value))}

            />
            <br />
            <EuiCheckbox
                id="skipPenalty"
                label="Penalty for skipping a word"
                checked={skipPenalty}
                onChange={() => setSkipPenalty(!skipPenalty)}
            />
        </div>
    )
}

export default NewGame
