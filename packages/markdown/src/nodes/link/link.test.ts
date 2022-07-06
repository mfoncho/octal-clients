import pattern from "./pattern";

const link = "hello link";

const ref = "http://www.example.com";

const sample = `[${link}](${ref}) The point of reference-style links is not that they’re easier to write.`;

const sample2 = `link to ${ref} The point of reference-style links is not that they’re easier to write.`;

test("title link match", () => {
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(sample);
    expect(match).toBeTruthy();
    if (match) {
        expect(match[2]).toBe(link);
        expect(match[5]).toBe(ref);
    }
});

test("parse path", () => {
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(sample2);
    expect(match).toBeTruthy();
    if (match) {
        expect(match[0]).toBe(ref);
    }
});

test("match ip path", () => {
    let path = "http://0.0.0.0/path";
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(path);
    expect(match).toBeTruthy();
});

test("match ip path with port", () => {
    let path = "http://0.0.0.0:80/path";
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(path);
    expect(match).toBeTruthy();
});

test("match url simple domain format", () => {
    let path = "sample.com";
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(path);
    expect(match).toBeTruthy();
});

test("match url with subdomain www", () => {
    let path = "http://www.sample.com/path";
    const cpattern = new RegExp(pattern);
    let match: ReturnType<typeof cpattern["exec"]> = cpattern.exec(path);
    expect(match).toBeTruthy();
});
