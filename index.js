const fs = require("fs");

console.log("Some random script");

const data = {
    name: "release XSS",
    flow: Math.floor(Math.random() * 10002 + 890890),
    moo: 2,
};

fs.writeFileSync("result.json", JSON.stringify(data, null, 4));

console.log("Completed");
