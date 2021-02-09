// https://www.mercadobitcoin.net/api/BTC/trades/?id=3706

const Pagination = require('./pagination')

const main = async () => {
    const pagination = new Pagination()
    const firstPage = 770e3
    const request = pagination.getPaginated({
        url: 'https://www.mercadobitcoin.net/api/BTC/trades/',
        page: firstPage
    })
    for await (const items of request) {
        console.table(items)
    }
}

main().catch(console.error)
