import Markdown from "./markdown";
import Hr from "./nodes/hr";
import List from "./nodes/list";
import Text from "./nodes/text";
import reslate from "./reslate";
import Code from "./nodes/code";
import Bold from "./nodes/strong";
import Emoji from "./nodes/emoji";
import Link from "./nodes/link";
import Image from "./nodes/image";
import Italic from "./nodes/emphasis";
import Strike from "./nodes/strike";
import Heading from "./nodes/heading";
import Paragraph from "./nodes/paragraph";
import Blockquote from "./nodes/blockquote";
import Mention from "./nodes/mention";

const sample = `### title ~~here~~ right
-------------
[This is an image](https://myoctocat.com/assets/images/base-octocat.svg)
what do we do now *this is a **paragraph*** _underscrore _one _two  _three __bold__ emphasis end_ test

> blockquote
> more blockquote #3a781606-a1ba-4d22-b014-f4471ef9569b
> #### headers in blockquote
>
> > - [x] ordered one ❤️ yep
> > - [ ] unordered two

*************
1. ordered on
2. ordered tow

\`\`\`text
some raw text
james brown

list of people
James Hill
\`\`\`
`;

function build() {
    const markdown = new Markdown();
    const paragraph = new Paragraph();
    const heading = new Heading();
    const blockquote = new Blockquote();
    const list = new List();
    const hr = new Hr();
    const emoji = new Emoji();
    const link = new Link();
    const text = new Text();
    const mention = new Mention();
    const italic = new Italic();
    const code = new Code();
    const strike = new Strike();
    const bold = new Bold();
    const image = new Image();
    markdown.add(paragraph);
    markdown.add(mention);
    markdown.add(hr);
    markdown.add(emoji);
    markdown.add(image);
    markdown.add(link);
    markdown.add(list);
    markdown.add(strike);
    markdown.add(bold);
    markdown.add(text);
    markdown.add(heading);
    markdown.add(italic);
    markdown.add(code);
    markdown.add(blockquote);
    return markdown;
}

test("Markdown should be pluggable", () => {
    const markdown = new Markdown();
    const paragraph = new Paragraph();
    markdown.add(paragraph);
    expect(markdown.component(paragraph.name)).toBe(paragraph);
});

test("Markdown should be unpluggable", () => {
    const markdown = new Markdown();
    const paragraph = new Paragraph();
    markdown.add(paragraph);
    markdown.remove(paragraph.name);
    expect(markdown.component(paragraph.name)).toBe(undefined);
});

test("Parse markdown sample", () => {
    const markdown = build();
    const parsed = markdown.parse(sample);
    //console.log(JSON.stringify(parsed[3], null, 2));
    expect(parsed.length).toBe(13);
});
