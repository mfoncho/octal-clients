export default {
    required: (val: any) => Boolean(val),
    number: (val: any) => typeof val == "number",
};
