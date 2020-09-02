require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Task = require('./models/task')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/tasks', (req, res) => {
  Task.find({}).then(tasks => {
    res.json(tasks)
  })
})

app.put('/api/tasks/:id', (request, response) => {
  const body = request.body
  // console.log(body)
  const task = {
    taskName: body.taskName,
    done: body.done
  }

  Task.findByIdAndUpdate({_id: request.params.id}, request.body)
    .then(() => {
      Task.findOne({_id: request.params.id}).then((updatedTask) => {
        response.json(updatedTask)
      })
    })
    .catch(error => next(error))
})

app.get('/api/tasks/:id', (request, response) => {
  Task.findById(request.params.id)
    .then(task => {
      if (task) {
        response.json(task)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

app.delete('/api/tasks/:id', (request, response) => {
  Task.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/tasks', (request, response) => {
  const body = request.body

  if (!body.taskName) {
    return response.status(400).json({ 
      error: 'Task missing' 
    })
  }

  const task = new Task({
    taskName: body.taskName,
    done: false,
  })

  task.save().then(savedTask => {
    response.json(savedTask)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})