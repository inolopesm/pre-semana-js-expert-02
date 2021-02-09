const loki = require('lokijs')

class TodoRepository {
    constructor() {
        const db = new loki('todo', { })
        this.schedule = db.addCollection('schedule')
    }

    create(data) {
        return this.schedule.insertOne(data)
    }

    list() {
        return this.schedule.find()
    }
}

module.exports = TodoRepository
