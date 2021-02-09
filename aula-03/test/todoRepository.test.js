const { describe, it, before, afterEach } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')
const TodoRepository = require('../src/todoRepository')

describe('todoRepository', () => {
    let todoRepository = null
    let sandbox = null

    before(() => {
        todoRepository = new TodoRepository()
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('methods signature', () => {
        it('should call find from lokijs', () => {
            const mockDatabase = [
                {
                    text: 'Hello World',
                    when: new Date('2020-12-01'),
                    meta: { revision: 0, created: 161118563507, version: 0 },
                    '$loki': 1
                }
            ]

            const functionName = 'find'
            const expedtedReturn = mockDatabase

            sandbox.stub(todoRepository.schedule, functionName).returns(expedtedReturn)

            const result = todoRepository.list()

            expect(result).to.be.deep.equal(expedtedReturn)
            expect(todoRepository.schedule[functionName].calledOnce).to.be.ok
        })

        it('should call insertOne from lokijs', () => {
            const functionName = 'insertOne'
            const expectedReturn = true

            sandbox.stub(todoRepository.schedule, functionName).returns(expectedReturn)

            const data = { text: 'Hello World', when: new Date('2020-12-01') }

            const result = todoRepository.create(data)

            expect(result).to.be.ok
            expect(todoRepository.schedule[functionName].calledOnceWithExactly(data)).to.be.ok
        })
    })
})
