import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

// Simple default firmware template (C)
const defaultFirmware = `#include <stdio.h>\n\nvoid app_main() {\n    // Your code here\n    printf("Hello from ESP32 firmware!\n");\n}\n`;

/**
 * ESP32FirmwareEditor – Allows users to edit firmware source code and compile it.
 * For now, the compile step is a placeholder that logs the source. In a full implementation,
 * this would invoke an in‑browser WebAssembly clang/llvm compiler and produce an ELF/WASM binary
 * that can be loaded into the ESP32 simulation engine.
 */
export default function ESP32FirmwareEditor({ onCompile }: { onCompile: (binary: Uint8Array) => void }) {
    const [code, setCode] = useState<string>(defaultFirmware);
    const [compiling, setCompiling] = useState<boolean>(false);

    const handleEditorChange = (value?: string) => {
        setCode(value ?? '');
    };

    const compileFirmware = async () => {
        setCompiling(true);
        // Placeholder: In a real implementation, compile `code` to binary using WebAssembly clang.
        console.log('Compiling firmware...');
        console.log(code);
        // Simulate binary output as Uint8Array of the source string bytes.
        const binary = new TextEncoder().encode(code);
        onCompile(binary);
        setCompiling(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <Editor
                    height="400px"
                    defaultLanguage="c"
                    defaultValue={defaultFirmware}
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                />
            </div>
            <button
                onClick={compileFirmware}
                disabled={compiling}
                style={{ marginTop: '8px', padding: '8px 16px', alignSelf: 'flex-end' }}
            >
                {compiling ? 'Compiling...' : 'Compile & Load'}
            </button>
        </div>
    );
}
