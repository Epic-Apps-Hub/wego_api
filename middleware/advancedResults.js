const advancedResult = model => async(req, res, next) => {
    let query
        ////copy req.query
    const reqQuery = {...req.query }

    //fields to excute
    const removeFields = ['select', 'sort', 'page', 'limit']

    //loop over remove fields and delete them from the query
    removeFields.forEach(param => delete reqQuery[param])

    ///create query string
    let queryStr = JSON.stringify(reqQuery)

    //creating operators like $gt , $lt etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //finding data
    query = model.find(JSON.parse(queryStr))
        //select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    //sorting accoring to field
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //paggination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()
    query = query.skip(startIndex).limit(limit)

    //excuting query
    const results = await query

    ///paggination result
    const paggination = {}
    if (endIndex < total) {
        paggination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        paggination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResult = {
        success: true,
        count: results.length,
        paggination,
        data: results
    }

    next()
}

module.exports = advancedResult