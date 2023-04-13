const fs = require("fs");

console.log("Some random script");

const data = {
    name: "release 2002222",
    flow: Math.round(Math.random() * 1020),
    moo: 2,
};

fs.writeFileSync("result.json", JSON.stringify(data, null, 4));

console.log("Completed");
