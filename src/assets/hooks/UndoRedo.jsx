import isEqual from 'lodash.isequal'
import { useEffect, useState } from 'react'

const UndoRedo = ({ initial }) => {
    const [timeline, setTimeline] = useState([initial])
    const [index, setIndex] = useState(0)
    const [currState, setCurrState] = useState(timeline[index])
    const updateState = (value) => {
        if (isEqual(currState, value)) {
            return
        }
        const copy = timeline.slice(0, index + 1)
        copy.push(value)
        setTimeline(copy)
        setIndex(copy.length - 1)
    }
    
    const goBack = (steps = 1) => {
        setIndex(Math.max(0, Number(index) - (Number(steps) || 1)))
    }
    
    const goForward = (steps = 1) => {
        setIndex(Math.min(timeline.length - 1, Number(index) + (Number(steps) || 1)))
    } 

    useEffect(() => {
        setCurrState(timeline[index])
    }, [timeline, index])
    return {index, currState, updateState, goBack, goForward, lastIndex: (timeline.length - 1)}
}

export default UndoRedo