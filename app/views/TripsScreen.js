"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsScreen = TripsScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function TripsScreen({ trips, onOpen }) {
    return (<react_native_1.FlatList data={trips} keyExtractor={(t) => t.id} renderItem={({ item }) => (<react_native_paper_1.List.Item title={`${new Date(item.startAt).toLocaleDateString()} — ${(item.distanceMeters / 1609.34).toFixed(2)} mi`} description={item.title || item.notes} onPress={() => onOpen(item)}/>)}/>);
}
