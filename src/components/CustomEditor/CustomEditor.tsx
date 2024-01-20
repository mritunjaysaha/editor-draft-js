import { ContentState, Editor, EditorState, RichUtils } from "draft-js";
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
    HEADING: {
        fontSize: 32,
        fontWeight: 700,
        // background: "pink",
    },
    BOLD: {
        fontWeight: 700,
        // background: "red",
    },
    RED: {
        color: "red",
        // background: "blue",
    },
    UNDERLINE: {
        textDecoration: "underline",
        // background: "yellow",
    },
};

export const CustomEditor = () => {
    const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty()
    );
    const updateEditorState = (
        text: string,
        replaceKey: string,
        styleKey: CustomStyleKeys
    ) => {
        const newText = text.replace(replaceKey, "");

        const newContentState = ContentState.createFromText(newText);

        const newEditorState = EditorState.createWithContent(newContentState);

        const updatedEditorState = RichUtils.toggleInlineStyle(
            newEditorState,
            styleKey
        );

        setEditorState(updatedEditorState);
    };

    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);

        const currentContent = editorState.getCurrentContent();
        const text = currentContent.getPlainText();

        if (text.includes("*** ")) {
            updateEditorState(text, "*** ", CUSTOM_STYLES.UNDERLINE);
        } else if (text.includes("** ")) {
            console.log("red");
        }

        // const blocksHTML = draftToHtml(
        //     convertToRaw(editorState.getCurrentContent())
        // );

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(blocksHTML, "text/html");

        // // @ts-ignore
        // const bodyContents = doc.childNodes[0].childNodes[1].children;

        // // @ts-ignore
        // Array.from(bodyContents).forEach((element: HTMLElement) => {
        //     const { innerHTML } = element;

        //     if (innerHTML.includes("***&nbsp;")) {

        //         const updatedEditorState = RichUtils.toggleInlineStyle(
        //             editorState,
        //             "HIGHLIGHT"
        //         );

        //         setEditorState(updatedEditorState);
        //     } else if (innerHTML.includes("**&nbsp;")) {
        //         console.log({ innerHTML }, "red color");
        //     }
        //     if (innerHTML.includes("#&nbsp;")) {
        //         console.log({ innerHTML }, "heading");
        //     }
        // });
    };

    return (
        <div className={styles.editor_container}>
            <Editor
                editorState={editorState}
                onChange={onEditorStateChange}
                customStyleMap={styleMap}
            />
        </div>
    );
};
