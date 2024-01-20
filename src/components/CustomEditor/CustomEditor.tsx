import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
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
    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );
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

    return (
        <div className={styles.editor_container}>
            <Editor
                onChange={onEditorStateChange}
                editorState={editorState}
                customStyleMap={styleMap}
            />
        </div>
    );
};
