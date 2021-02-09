(() => {
    const BTN_RESTART_ID = 'btn-restart'
    const COUNTER_ID = 'counter'
    const COUNTER_VALUE = 100
    const INTERVAL_PERIOD = 10

    class CounterComponent {
        constructor() {
            this.init()
        }

        prepareCounterProxy() {
            const handler = {
                set: (currentContext, propertyKey, newValue) => {
                    console.log({ currentContext, propertyKey, newValue })

                    if (!currentContext.value) currentContext.stop()

                    currentContext[propertyKey] = newValue
                    return true
                }
            }

            const counter = new Proxy({
                value: COUNTER_VALUE,
                stop: () => { }
            }, handler)

            return counter
        }

        updateText({ counterElement, counter }) {
            const textIdentifier = '$counter'
            const defaultText = `Começando em <strong>${textIdentifier}</strong> segundos...`
            counterElement.innerHTML = defaultText.replace(textIdentifier, counter.value--)
        }

        scheduleCounterStop({ counterElement, intervalId }) {
            return () => {
                clearInterval(intervalId)
                counterElement.innerHTML = ""
                this.disableButton(false)
            }
        }

        prepareButton(buttonElement, init) {
            buttonElement.addEventListener('click', init.bind(this))

            return (value = true) => {
                buttonElement.removeEventListener('click', init.bind(this))

                if (value) {
                    buttonElement.setAttribute('disabled', value)
                } else {
                    buttonElement.removeAttribute('disabled')
                }
            }
        }

        init() {
            console.log('initialized!')
            const counterElement = document.getElementById(COUNTER_ID)
            const counter = this.prepareCounterProxy()

            // counter.value = 100
            // counter.value = 90
            // counter.value = 80

            // this.updateText({ counterElement, counter })
            // this.updateText({ counterElement, counter })
            // this.updateText({ counterElement, counter })

            const intervalId = setInterval(() => {
                this.updateText({ counterElement, counter })
            }, INTERVAL_PERIOD)

            const buttonElement = document.getElementById(BTN_RESTART_ID)

            const disableButton = this.prepareButton(buttonElement, this.init)
            disableButton()

            counter.stop = this
                .scheduleCounterStop
                .apply({ disableButton }, [{ counterElement, intervalId }])
        }
    }

    window.CounterComponent = CounterComponent
})()