class Util {
    static #defaultFormat = Intl.NumberFormat("pt-br", {
        currency: "BRL",
        style: "currency"
    })

    static formatCurrency(value) {
        return this.#defaultFormat.format(value)
    }

    static unFormatCurrency(value) {
        // TODO: melhorar regex para ser compatível com mais casos
        // https://stackoverflow.com/questions/29255843/is-there-a-way-to-reverse-the-formatting-by-intl-numberformat-in-javascript
        // Resposta de Erick Wendel
        return Number(value.replace(/\D/g, '')) / 100
    }
}

module.exports = Util