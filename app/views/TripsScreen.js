"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsScreen = TripsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
function TripsScreen({ trips, onOpen }) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: trips, keyExtractor: (t) => t.id, renderItem: ({ item }) => ((0, jsx_runtime_1.jsx)(react_native_paper_1.List.Item, { title: `${new Date(item.startAt).toLocaleDateString()} — ${(item.distanceMeters / 1609.34).toFixed(2)} mi`, description: item.title || item.notes, onPress: () => onOpen(item) })) }));
}
