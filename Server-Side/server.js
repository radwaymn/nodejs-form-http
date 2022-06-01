const http = require("http");
const fs = require("fs");

let mainHtml = fs.readFileSync("../Client-Side/HTML/main.html").toString();
let welcomeHtml = fs.readFileSync("../Client-Side/HTML/welcome.html").toString();
let homeIcon = fs.readFileSync("../Client-Side/ASSETS/home.png");
let userIcon = fs.readFileSync("../Client-Side/ASSETS/user.png");
let styleCss = fs.readFileSync("../Client-Side/CSS/style.css").toString();
let scriptJs = fs.readFileSync("../Client-Side/JS/script.js").toString();

http.createServer((request, response) => {
    if(request.method == "GET") {
        switch(request.url) {
            case "/":
            case "/main.html":
                response.writeHead(response.statusCode, {"content-type": "text/html"});
                response.write(mainHtml);
                break;
            case "/style.css":
            case "/CSS/style.css":
                response.setHeader("content-type", "text/css");
                response.write(styleCss);
                break;
            case "/script.js":
            case "/JS/script.js":
                response.setHeader("content-type", "text/javascript");
                response.write(scriptJs);
                break;
            case "/favicon.ico":
            case "/home.png":
            case "/ASSETS/home.png":
                response.setHeader("content-type", "image/vnd.microsoft.icon");
                response.write(homeIcon);
                break;
            case "/user.png":
            case "/ASSETS/user.png":
                response.setHeader("content-type", "image/vnd.microsoft.icon");
                response.write(userIcon);
                break;
            default:
                if(request.url.includes("/welcome.html")) {
                    response.writeHead(response.statusCode, {"content-type": "text/html"});
                    let clientObj = getDataObject(request.url.split("?")[1]);
                    saveJsonFile(fs, clientObj);
                    for (let prop in clientObj) {
                        welcomeHtml = welcomeHtml.replace(`{${prop}}`, clientObj[prop]);
                    }
                    response.write(welcomeHtml);
                    for (let prop in clientObj) {
                        welcomeHtml = welcomeHtml.replace(clientObj[prop], `{${prop}}`);
                    }
                }
                else {
                    response.writeHead(404, { "content-type": "text/plain" });
                    response.write("Error 404: page not found");
                }
        }
        response.end();
    }
    else if(request.method == "POST") {
        let clientObj = {};
        request.on("data", (data) => {
            clientObj = getDataObject(data.toString());
        });
        request.on("end", function() {
            saveJsonFile(fs, clientObj);
            for(let prop in clientObj) {
                welcomeHtml = welcomeHtml.replace(`{${prop}}`, clientObj[prop]);
            }   
            response.write(welcomeHtml);
            for(let prop in clientObj) {
                welcomeHtml = welcomeHtml.replace(clientObj[prop], `{${prop}}`);
            }  
            response.end();
        });
    }
}).listen(7000, () => {
    console.log("Server started, Listening on PORT 7000 ...");
})

function getDataObject(data) {
    let obj = {};
    let allData = data.split("&");
    for(let i in allData) {
        obj[allData[i].split("=")[0]] = decodeURIComponent(allData[i].split("=")[1]);
    }
    return obj;
}

function saveJsonFile(fs, obj) {
    let arr = JSON.parse(fs.readFileSync("clients.json")) || [];
    arr.push(obj);
    fs.writeFileSync("clients.json", JSON.stringify(arr));
}
