import Textarea from "./Textarea";
import Suggestions from "./Suggestion";
import Post from "./Post";
import Input from "./Input";

export type TextAreaType = typeof Textarea & {
    Post: typeof Post;
    Input: typeof Input;
    Suggestions: typeof Suggestions;
};

(Textarea as TextAreaType).Post = Post;
(Textarea as TextAreaType).Input = Input;
(Textarea as TextAreaType).Suggestions = Suggestions;

export default Textarea as TextAreaType;
