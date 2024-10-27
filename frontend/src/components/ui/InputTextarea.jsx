import { useRef, useState } from 'react';
import Editor from './Editor';
import Quill from 'quill';
const Delta = Quill.import('delta');

const InputTextarea = ({ label, description, defaultValue, value, setValue }) => {
    const [range, setRange] = useState();

    // Use a ref to access the quill instance directly
    const quillRef = useRef();

    const handleTextChange = (delta, oldDelta, source) => {
        const editor = quillRef.current;
        if (editor) {
            const html = editor.root.innerHTML;
            setValue(html);
        }
    };

    return (
        <div className="flex flex-col justify-between">
            {label &&
            <>
            <div className="input-label w-auto">
                <div className="flex">
                    {label}
                </div>
                {description &&
                    <div className="fs-12 text-secondary">
                        {description}
                    </div>
                }
            </div>
            </>
            }
            <div className="flex-grow-1 border-radius bg-white text-color-initial border">
                <div>
                    <Editor
                        ref={quillRef}
                        defaultValue={defaultValue}
                        onSelectionChange={setRange}
                        onTextChange={handleTextChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default InputTextarea;