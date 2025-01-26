import joi from 'joi'

const listConType = {
    body: joi.object({
    })
}

const listConTypeCreds = {
    param: joi.object({
        id: joi.string().required()
    })
}

export { listConType, listConTypeCreds };