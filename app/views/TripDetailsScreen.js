"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripDetailsScreen = TripDetailsScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function TripDetailsScreen({ onSave, initial }) {
    const [title, setTitle] = (0, react_1.useState)(initial?.title ?? '');
    const [notes, setNotes] = (0, react_1.useState)(initial?.notes ?? '');
    const [saveAsRoutine, setSaveAsRoutine] = (0, react_1.useState)(false);
    return (<react_native_1.View style={{ flex: 1, padding: 16 }}>
      <react_native_paper_1.TextInput label="Title/Purpose" value={title} onChangeText={setTitle} style={{ marginBottom: 12 }}/>
      <react_native_paper_1.TextInput label="Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} style={{ marginBottom: 12 }}/>
      <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <react_native_paper_1.Switch value={saveAsRoutine} onValueChange={setSaveAsRoutine}/>
        <react_native_paper_1.Text style={{ marginLeft: 8 }}>Save as routine</react_native_paper_1.Text>
      </react_native_1.View>
      <react_native_paper_1.Button mode="contained" onPress={() => onSave({ title, notes, saveAsRoutine })}>
        Save
      </react_native_paper_1.Button>
    </react_native_1.View>);
}
