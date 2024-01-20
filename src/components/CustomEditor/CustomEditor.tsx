import { Editor, EditorState } from "draft-js";
import React from "react";
import styles from "./customEditor.module.css";

export const CustomEditor = () => {
    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );

    return (
        <div className={styles.editor_container}>
            <Editor editorState={editorState} onChange={setEditorState} />
        </div>
    );
};
