const http = require('http');
const url = require('url');

const items = [
    {id: 1, name: "name 1", description: "description 1"},
    {id: 2, name: "name 2", description: "description 2"},
    {id: 3, name: "name 3", description: "description 3"},
    {id: 4, name: "name 4", description: "description 4"},
    {id: 5, name: "name 5", description: "description 5"},
    {id: 6, name: "name 6", description: "description 6"},
    {id: 7, name: "name 7", description: "description 7"},
    {id: 8, name: "name 8", description: "description 8"},
    {id: 9, name: "name 9", description: "description 9"},
    {id: 10, name: "name 10", description: "description 10"},
    {id: 11, name: "name 11", description: "description 11"},
    {id: 12, name: "name 12", description: "description 12"},
]
// api get
const handleApiGetList = (req, res) => {
    const parseUrl = url.parse(req.url, true);
    console.log('parseUrl:', parseUrl);
    console.log('type:', typeof parseUrl);

    const path = parseUrl.pathname;
    if (path === '/api/items') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
    })
    res.end(JSON.stringify(items))
} else {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    })
    res.end('Not Found')
}
}

// Api get detail
const handleApiGetDetail = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    const itemId = parseInt(parseUrl.pathname.split('/')[3])
    console.log('Item Id in Api get Detail:', itemId)
    const index = items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(items[index]))
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('Item Id Not Found')
    }
}

// Api pagination
const handleApiGetPagination = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    const pageIndex = parseInt(parseUrl.query.pageIndex) || 1
    const limit = parseInt(parseUrl.query.limit) || 10
    console.log('pageIndex:', pageIndex)
    console.log('limit:', limit)

    const startIndex = (pageIndex - 1) * limit
    const endIndex = (startIndex + limit - 1)
    console.log('startIndex:', startIndex)
    console.log('endIndex:', endIndex)
    let result = {};
    result = {
        data: items.slice(startIndex, endIndex + 1),
        itemsPerPage: limit,
        totalPages: Math.ceil(items.length / limit),
        currentPageIndex: pageIndex
    };
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(result))
}

// api post
const handlePostApi = (req, res) => {
    let bodyStr = "";
    req.on('data', (chunk)=>{
        bodyStr += chunk.toString();
        console.log('body in:', bodyStr)
    })
    req.on('end', ()=>{
        const body = JSON.parse(bodyStr)
        const newItem = {id: items.length + 1, ...body}
        items.push(newItem)
        res.writeHead(201, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(newItem))
    })
}

// api put
const handlePutApi = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    // console.log('parseUrl:', parseUrl)
    // console.log('item id:', parseUrl.pathname.split('/')[3])
    // console.log('type of item id:', typeof parseUrl.pathname.split('/')[3])
    const itemId = parseInt(parseUrl.pathname.split('/')[3])
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const updateData = JSON.parse(body)
        console.log('update data:', updateData)
        const index = items.findIndex((item) => item.id === itemId)
        if (index !== -1) {
            items[index] = {...items[index], ...updateData}
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(items[index]))
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('Item Id Not Found')
        }
    })
}

// Api delete
const handleApiDelete = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    const itemId = parseInt(parseUrl.pathname.split('/')[3])
    console.log('delete item id:', itemId)
    const index = items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
        items.splice(index, 1)
        console.log('items:', items)
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('Delete item success')
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('Item Id Not Found')
    }
}

const server = http.createServer((req, res)=>{
    const parseUrl = url.parse(req.url, true)
    const itemId = parseInt(parseUrl.pathname.split('/')[3])
    // api/items/:id
    if(req.method === 'GET' && parseUrl.pathname === 'api/items') {
        handleApiGetList(req, res);
    } else if (req.method === 'GET' && parseUrl.pathname.startsWith('/api/items/') && itemId) {
        handleApiGetDetail(req, res)
    } else if (req.method === 'GET' && parseUrl.pathname === '/api/items/pagination') {
        handleApiGetPagination(req, res)
    }
    else if (req.method === 'POST') {
        handlePostApi(req, res)
    } else if (req.method === 'PUT') {
        handlePutApi(req, res)
    } else if (req.method === 'DELETE') {
        handleApiDelete(req, res)
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'})
        res.end('Method Not Allowed')
    }
})

const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`Server running in PORT ${PORT}`)
})