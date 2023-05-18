const fs = require("fs");

console.log("Some random script");

const data = {
    name: "release 200",
    flow: Math.floor(Math.random() * 10002 + 890890),
    moo: 2,
};

fs.writeFileSync("result.json", JSON.stringify(data, null, 4));

console.log("Completed");
