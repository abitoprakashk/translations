/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { parse, traverse } = require("@babel/core");
const t = require("@babel/types");
const glob = require("glob");

const ROOT = path.resolve(__dirname + "/../../../");

const TRANS_NODE = "Trans";
const I18N_KEY = "i18nKey";

const localizationCheck = async () => {
    const hardCodedStrings = {};
    let [filesCount, hardCodedStringsCount] = [0, 0];

    for (const sourceFile of await getSourceFiles()) {
        const strings = await detectHardCodedStrings(sourceFile);
        const fileName = sourceFile.replace(`${ROOT}/src/`, "");

        if (strings.length) {
            hardCodedStrings[fileName] = strings;
            filesCount += 1;
            hardCodedStringsCount += strings.length;
        }
    }

    if (filesCount > 0) {
        console.log(
            `${hardCodedStringsCount} hard coded strings found in ${filesCount} files`
        );

        Object.entries(hardCodedStrings).forEach(([fileName, foundInfo]) => {
            console.log(`\n${fileName}`);
            foundInfo.forEach(({ text, column, line }) => {
                console.log(`\t"${text}" (line ${line}:${column})`);
            });
        });

        process.exit(1);
    }
};

const getSourceFiles = async () => {
    const sourceFiles = await glob.sync(`${ROOT}/src/**/*.{js,jsx}`);
    return sourceFiles;
};

const detectHardCodedStrings = (filePath) => {
    const found = [];
    try {
        const code = fs.readFileSync(filePath, "utf8");

        const ast = parse(code, {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                "@babel/plugin-syntax-dynamic-import",
            ],
            filename: filePath,
        });

        traverse(ast, {
            JSXText(path) {
                const text = path.node.value?.trim();
                if (text?.length > 1 && text.match(/[a-zA-Z0-9]/)) {
                    found.push({ text, ...path.node.loc.start });
                }
            },
            JSXElement(path) {
                if (
                    t.isJSXIdentifier(path.node.openingElement.name) &&
                    path.node.openingElement.name.name === TRANS_NODE
                ) {
                    const i18nKey = path.node.openingElement.attributes.find(
                        (attr) => attr.name.name === I18N_KEY
                    );

                    if (!i18nKey) {
                        found.push({
                            text: nodesToString(path.node.children),

                            ...path.node.loc.start,
                        });
                    }
                    path.skip();
                }
            },
        });
    } catch (err) {
        console.log(`Could not parse file - ${filePath}: ${err}`);
    }

    return found;
};

const nodesToString = (nodes) => {
    let memo = "";
    let nodeIndex = 0;
    nodes.forEach((node) => {
        if (t.isJSXText(node) || t.isStringLiteral(node)) {
            const value = node.value
                .replace(/^[\r\n]+\s*/g, "") // remove leading spaces containing a leading newline character
                .replace(/[\r\n]+\s*$/g, "") // remove trailing spaces containing a leading newline character
                .replace(/[\r\n]+\s*/g, " "); // replace spaces containing a leading newline character with a single space character

            if (!value) {
                return null;
            }
            memo += value;
        } else if (t.isJSXExpressionContainer(node)) {
            const { expression = {} } = node;

            if (t.isNumericLiteral(expression)) {
                memo += ""; // Numeric literal is ignored in react-i18next
            }
            if (t.isStringLiteral(expression)) {
                memo += expression.value;
            } else if (
                t.isObjectExpression(expression) &&
                expression?.properties?.[0]?.type === "ObjectProperty"
            ) {
                memo += `{{${expression.properties[0].key.name}}}`;
            } else {
                // Unsupported JSX expression. Only static values or {{interpolation}} blocks are supported
                // See expression.type for more info
                return null;
            }
        } else if (node.children) {
            memo += `<${nodeIndex}>${nodesToString(
                node.children
            )}</${nodeIndex}>`;
        }

        ++nodeIndex;
    });

    return memo;
};

localizationCheck();
