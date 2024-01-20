import {
    Editor,
    EditorState,
    Modifier,
    RichUtils,
    convertFromRaw,
    convertToRaw,
} from "draft-js";
import React from "react";
import styles from "./customEditor.module.css";

type CustomStyleKeys = "RED" | "BOLD" | "HEADING" | "UNDERLINE";

const CUSTOM_STYLES: Record<CustomStyleKeys, CustomStyleKeys> = {
    RED: "RED",
    BOLD: "BOLD",
    HEADING: "HEADING",
    UNDERLINE: "UNDERLINE",
};

const styleMap = {
    RED: {
        color: "red",
        fontWeight: 400,
    },
    BOLD: {
        color: "black",
        fontSize: 16,
        fontWeight: 700,
    },
    HEADING: {
        color: "black",
        fontSize: 32,
        fontWeight: 700,
    },
    UNDERLINE: {
        color: "black",
        textDecoration: "underline",
    },
};

export const CustomEditor = () => {
    const [editorState, setEditorState] = React.useState(() => {
        const savedContent = localStorage.getItem("editor-content");
        if (savedContent) {
            return EditorState.createWithContent(
                convertFromRaw(JSON.parse(savedContent))
            );
        }

        return EditorState.createEmpty();
    });

    const updateEditorState = (
        currentContent: any,
        selection: any,
        styleKey: CustomStyleKeys
    ) => {
        const newContentState = Modifier.replaceText(
            currentContent,
            selection.merge({ anchorOffset: 0, focusOffset: 3 }),
            ""
        );

        const newEditorState = EditorState.push(
            editorState,
            newContentState,
            "remove-range"
        );

        setEditorState(RichUtils.toggleInlineStyle(newEditorState, styleKey));
    };

    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);

        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const block = currentContent.getBlockForKey(selection.getStartKey());
        const text = block.getText();

        if (text.startsWith("# ")) {
            updateEditorState(currentContent, selection, CUSTOM_STYLES.HEADING);
        }
        if (text.startsWith("*** ")) {
            updateEditorState(
                currentContent,
                selection,
                CUSTOM_STYLES.UNDERLINE
            );
        } else if (text.startsWith("** ")) {
            updateEditorState(currentContent, selection, CUSTOM_STYLES.RED);
        } else if (text.startsWith("* ")) {
            updateEditorState(currentContent, selection, CUSTOM_STYLES.BOLD);
        }
    };

    const handleSaveClick = () => {
        const content = editorState.getCurrentContent();
        const rawContent = convertToRaw(content);

        localStorage.setItem("editor-content", JSON.stringify(rawContent));

        alert("Changes Saved");
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editor_title_save_div}>
                <p className={styles.editor_title}>
                    Demo editor by{" "}
                    <a
                        target="_blank"
                        href="https://mritunjaysaha.netlify.app"
                        rel="noreferrer"
                    >
                        Mritunjay Saha
                    </a>
                </p>
                <button
                    onClick={handleSaveClick}
                    className={styles.save_button}
                >
                    Save
                </button>
            </div>

            <div tabIndex={-1} className={styles.editor_container}>
                <Editor
                    onChange={onEditorStateChange}
                    editorState={editorState}
                    customStyleMap={styleMap}
                />
            </div>
        </div>
    );
};
