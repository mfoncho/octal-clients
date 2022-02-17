import { parse } from "./code";

const lang = "text";

const code = `when will all this com to and end
when 
\`\`\`code
code in code i like it
\`\`\`
111`;

const sample = `\`\`\`${lang}
${code}
\`\`\`
whell 
dont match
`;

test("Parse code block", () => {
    let match = parse(sample);
    expect(match[0]).toBe(lang);
    expect(match[1]).toBe(code);
});
