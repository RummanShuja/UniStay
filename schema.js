const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        price: Joi.number().required().min(0),
        brokerage: Joi.number().required().min(0),
        security: Joi.number().required().min(0),
        address: Joi.string().required(),
        image: Joi.array().items(
            Joi.object({
                url: Joi.string().uri().required(),
                originalName: Joi.string().required(),
                filename: Joi.string().regex(/\.jpg$|\.jpeg$|\.png$/i).required()
            })
        ).min(1),
    }).required(),
    deleteImages: Joi.array().items(Joi.string())
})

// not adding the owner, interestedViewer fields becuase the data for them does not comes 
// from any form submission i m using post request to input them

// and delete is here but not in the actual schema bcz its a one time thing and not need to be 
// saved but it is here bcz the incoming data has this field so need to validate it