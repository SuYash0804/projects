import moment from "moment/moment"
import { useState } from "react"
import { Check, Delete, Edit, Info, Trash } from "react-feather"
import { Card, CardBody } from "reactstrap"

export default function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [editKey, setEditKey] = useState(null)
  const [dragStartIndex, setDragStartIndex] = useState(null)

  function updateTasks() {
    if (task !== "") {
      setTasks([...tasks, { time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"), taskName: task, lastEdited: "" }])
    }
    setTask("")
  }
  return (
    <div className="d-flex flex-column align-items-stretch p-2">
      <div className="d-flex justify-content-center align-items-start p-4 gap-2">
        <input value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => {
          if (e.key === "Enter") {
            updateTasks()
          }
        }} id="enterTask" className="form-control w-auto" type="text" /><button onClick={updateTasks} className="btn border border-white text-white">Add Task</button>
      </div>
      <div onDragOver={e => e.preventDefault()} className="p-3 m-auto border border-white flex-grow-1" style={{ width: "100%", maxWidth: "800px" }}>
        <div className="d-flex flex-column align-items-stretch gap-3 h-100" style={{ maxHeight: "100%", overflow: "auto" }}>
          {tasks.length >= 1 ? tasks.map((ele, key) => {
            return (
              <Card draggable onDragStart={() => {
                setDragStartIndex(key)
              }} onDragOver={e => {
                e.preventDefault()

                if (key === dragStartIndex) {
                  return
                }
                const arr = [...tasks]
                const removed = arr.splice(dragStartIndex, 1)[0]
                arr.splice(key, 0, removed)
                setTasks([...arr])
                setDragStartIndex(key)
              }}
              onDragEnd={() => setDragStartIndex(null)} key={key} style={{opacity: key === dragStartIndex ? `0.5` : "1"}}>
                <CardBody className="d-flex align-items-center position-relative gap-2">
                  <div className="flex-grow-1">
                    {key === editKey ? <input type="text" className="form-control" value={ele.taskName} onChange={e => {
                      const dupTasks = [...tasks]
                      dupTasks[key].taskName = e.target.value
                      dupTasks[key].lastEdited = moment(new Date()).format("MMMM Do YYYY, h:mm:ss a")
                      setTasks([...dupTasks])
                    }} /> : <span className="fs-5">{ele.taskName}</span>}
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    {key === editKey ? <Check className="cursor-pointer" onClick={() => setEditKey(null)} size={17.5} /> : <Edit className="cursor-pointer" onClick={() => setEditKey(key)} size={17.5} />} <Trash className="cursor-pointer" onClick={() => {
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
  )
}


