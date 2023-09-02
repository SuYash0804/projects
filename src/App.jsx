import moment from "moment/moment"
import { useState } from "react"
import { Check, Delete, Edit, Info, RotateCcw, RotateCw, Trash } from "react-feather"
import { Card, CardBody } from "reactstrap"
import UndoRedo from "./assets/hooks/UndoRedo"

export default function App() {
  const [task, setTask] = useState("")
  const initial = [{ time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"), taskName: "Example task", lastEdited: "" }]

  const { index, currState: tasks, updateState: setTasks, goBack, goForward, lastIndex } = UndoRedo({ initial })

  const canUndo = index > 0
  const canRedo = index < lastIndex
  const [dragStartIndex, setDragStartIndex] = useState(null)

  function updateTasks() {
    if (task !== "") {
      setTasks([...tasks, { time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"), taskName: task, lastEdited: "" }])
    }
    setTask("")
  }

  function dragStart(e, key) {
    setDragStartIndex(key)
    const dragImage = e.target.cloneNode(true)
    dragImage.style.opacity = "1"
    dragImage.style.scale = "1.25"
    e.dataTrasfer.setDragImage(dragImage)
  }

  function dragOver(e, key) {
    e.preventDefault()
    if (key === dragStartIndex) {
      return
    }
    const arr = [...tasks]
    const removed = arr.splice(dragStartIndex, 1)[0]
    arr.splice(key, 0, removed)
    setTasks([...arr])
    setDragStartIndex(key)
  }

  function dragEnd() {
    setDragStartIndex(null)
  }
  return (
    <>
      <div className="d-flex flex-column align-items-stretch p-2">
        <div className="d-flex justify-content-center align-items-center p-4 gap-3">
          <input value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => {
            if (e.key === "Enter") {
              updateTasks()
            }
          }} id="enterTask" className="form-control w-auto" type="text" /><button onClick={updateTasks} className="btn border border-white text-white">Add Task</button>
          <div className="d-flex gap-2 align-items-center">
            <button onClick={goBack} disabled={!canUndo} className="btn btn-dark border border-white d-flex justify-content-center align-items-center">
              <RotateCcw size={13.5} color="white" />
            </button>
            <button onClick={goForward} disabled={!canRedo} className="btn btn-dark border border-white d-flex justify-content-center align-items-center">
              <RotateCw size={13.5} color="white" />
            </button>
          </div>
        </div>
        <div onDragOver={e => e.preventDefault()} className="p-3 m-auto border border-white flex-grow-1" style={{ width: "100%", maxWidth: "800px" }}>
          <div className="d-flex flex-column align-items-stretch gap-3 h-100" style={{ maxHeight: "100%", overflow: "auto" }}>
            {tasks.length >= 1 ? tasks.map((ele, key) => {
              return (
                <Card draggable={tasks.length > 1} onDragStart={(e) => dragStart(e, key)}
                  onTouchStart={(e) => dragStart(e, key)}
                  onTouchMove={e => dragOver(e, key)}
                  onDragOver={e => dragOver(e, key)}
                  onDragEnd={() => dragEnd()}
                  onTouchEnd={() => dragEnd()}
                  key={key} style={key === dragStartIndex ? { opacity: `0.5` } : {}}>
                  <CardBody className="d-flex align-items-center position-relative gap-2">
                    <div className="flex-grow-1">
                      <span className="fs-5" onDragStart={e => e.stopPropagation}>{ele.taskName}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <Trash className="cursor-pointer" onClick={() => {
                        const arr = [...tasks]
                        arr.splice(key, 1)
                        setTasks([...arr])
                      }} size={17.5} />
                    </div>
                    <span className="position-absolute cursor-pointer" style={{ inset: "0px 0px auto auto", fontSize: "10px", padding: "0.15rem" }} title={`Created at ${ele.time}${ele.lastEdited === "" ? "" : `, Last edited on ${ele.lastEdited}`}`}><Info size={12} /></span>
                  </CardBody>
                </Card>
              )
            }) : (
              <label htmlFor="enterTask" className="text-white fs-5 text-center w-100">Enter a task</label>
            )}
          </div>
        </div>
      </div>
    </>
  )
}


