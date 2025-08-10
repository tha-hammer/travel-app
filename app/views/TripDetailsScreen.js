"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripDetailsScreen = TripDetailsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function TripDetailsScreen({ onSave, initial }) {
    const [title, setTitle] = (0, react_1.useState)(initial?.title ?? '');
    const [notes, setNotes] = (0, react_1.useState)(initial?.notes ?? '');
    const [saveAsRoutine, setSaveAsRoutine] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: { flex: 1, padding: 16 }, children: [(0, jsx_runtime_1.jsx)(react_native_paper_1.TextInput, { label: "Title/Purpose", value: title, onChangeText: setTitle, style: { marginBottom: 12 } }), (0, jsx_runtime_1.jsx)(react_native_paper_1.TextInput, { label: "Notes", value: notes, onChangeText: setNotes, multiline: true, numberOfLines: 3, style: { marginBottom: 12 } }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 }, children: [(0, jsx_runtime_1.jsx)(react_native_paper_1.Switch, { value: saveAsRoutine, onValueChange: setSaveAsRoutine }), (0, jsx_runtime_1.jsx)(react_native_paper_1.Text, { style: { marginLeft: 8 }, children: "Save as routine" })] }), (0, jsx_runtime_1.jsx)(react_native_paper_1.Button, { mode: "contained", onPress: () => onSave({ title, notes, saveAsRoutine }), children: "Save" })] }));
}
