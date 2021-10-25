const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////

//file

// fs.readFile("./txt/main.txt", "utf-8", (err, data) => {
//   console.log(data);
//   fs.readFile("./txt/main2.txt", "utf-8", (err, data2) => {
//     console.log(data2);

//     fs.writeFile("./txt/final.txt", `${data}\n ${data2}`, (err) => {
//       console.log("writing final text");
//     });
//   });
// });

// console.log("prit");

/////////////////////////

//server
const replaceTemp = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.form);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);

const paymentPage = fs.readFileSync(
  `${__dirname}/templates/payment.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/farm.json`, "utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join();
    const output = tempOverview.replace("{%PRODUCTCARDS%}", cardHtml);
    res.end(output);
  }
  //product
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);
  }

  //api
  else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  }

  //page not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end(paymentPage);
  }
});

server.listen(3000, () => {
  console.log("listening to port 3000");
});
