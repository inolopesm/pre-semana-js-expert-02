const { describe, it, before, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')
const TodoService = require('../src/todoService')
const Todo = require('../src/todo')

describe('todoService', () => {
    let sandbox = null

    before(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('#list', () => {
        const mockDatabase = [
            {
                text: 'Hello World',
                when: new Date('2020-12-01'),
                meta: { revision: 0, created: 161118563507, version: 0 },
                '$loki': 1
            }
        ]

        let todoService = null

        beforeEach(() => {
            const dependencies = { todoRepository: { list: sandbox.stub().returns(mockDatabase) } }
            todoService = new TodoService(dependencies)
        })

        it('should return data on a specific format', () => {
            const result = todoService.list()
            const [{ meta, $loki, ...expected }] = mockDatabase
            expect(result).to.be.deep.equal([expected])
        })
    })

    describe('#create', () => {
        let todoService = null

        beforeEach(() => {
            const dependencies = { todoRepository: { create: sandbox.stub().returns(true) } }
            todoService = new TodoService(dependencies)
        })

        it('shoud\'t save todo item with invalid data', () => {
            const data = new Todo({ text: '', when: new Date('20-12-01') })

            Reflect.deleteProperty(data, 'id')

            const expected = { error: { message: 'invalid data', data: data } }

            const result = todoService.create(data)
            expect(result).to.be.deep.equal(expected)
        })

        it('shoud save todo item with late status when the property is further than today', () => {
            const properties = { text: 'Hello World', when: new Date('2020-12-01 12:00:00 GMT-0') }
            const expectedId = '000001'

            const uuid = require('uuid')
            const fakeUUID = sandbox.fake.returns(expectedId)
            sandbox.replace(uuid, 'v4', fakeUUID)

            const data = new Todo(properties)

            const today = new Date('2020-12-02')
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expedtedCallWith = { ...data, status: 'late' }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expedtedCallWith))
                .to.be.ok
        })

        it('shoud save todo item with pending status', () => {
            const properties = { text: 'Hello World', when: new Date('2020-12-03 12:00:00 GMT-0') }
            const expectedId = '000001'

            const uuid = require('uuid')
            const fakeUUID = sandbox.fake.returns(expectedId)
            sandbox.replace(uuid, 'v4', fakeUUID)

            const data = new Todo(properties)

            const today = new Date('2020-12-02')
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expedtedCallWith = { ...data, status: 'pending' }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expedtedCallWith))
                .to.be.ok
        })
    })
})
