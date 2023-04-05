const fs = require("fs");

console.log("Some random script");

const data = {
    name: "Usman",
    flow: Math.round(Math.random() * 100),
};

fs.writeFileSync("result.json", JSON.stringify(data, null, 4));

console.log("Completed");
