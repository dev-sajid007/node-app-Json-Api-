const http = require('http');
const fs = require('fs');
const url = require('url');

//replace temp Function
const replaceTemp = (temp,post) => {

    let output = temp.replace(/{%TITLE%}/g,post.title);
    output = output.replace(/{%IMAGE%}/g,post.image);
    output = output.replace(/{%DESCRIPTION%}/g,post.body);
    output = output.replace(/{%ID%}/g,post.id);
    // output = output.replace('{%STATUS%}',post.status);
    if(!post.status)
    {
        output = output.replace(/{%STATUS%}/g,'INACTIVE');
        output = output.replace(/{%BTN_STATUS%}/g,'danger');
    } 
    else{
        output = output.replace(/{%STATUS%}/g,'ACTIVE');
        output = output.replace(/{%BTN_STATUS%}/g,'success');
    }
    return output;
}


//main template
let tempMain = fs.readFileSync(`${__dirname}/templates/temp-main.html`,'utf-8');
let tempCard = fs.readFileSync(`${__dirname}/templates/cards.html`,'utf-8');
let tempPost = fs.readFileSync(`${__dirname}/templates/post.html`,'utf-8');


//data
let data    = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
let dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {

    const {query,pathname} = url.parse(req.url,true);

    if(pathname === '/'){

        let cardsHtml = dataObj.map((el) => replaceTemp(tempCard,el)).join('');
        let output = tempMain.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }
    else if(pathname === '/product'){
        const post = dataObj[query.id];
        let output = replaceTemp(tempPost,post);
        res.end(output);
    }
    else if(pathname === '/api'){
        res.writeHead(200,{'Content-type' : 'application/json'});
        res.end(data);
    }
    else{
        res.end('Page not found!');
    }

});



server.listen(3000,() => {
    console.log('Server Start...');
})