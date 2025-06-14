import { Text, View } from "react-native";

export const ViTable = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
export const ViTableHeader = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
};
export const ViTableHeaderCell = ({
  flex = 1,
  children,
}: {
  flex?: number;
  children: React.ReactNode;
}) => {
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 8, flex }}>
      <Text style={{ fontWeight: "800" }}>{children}</Text>
    </View>
  );
};
export const ViTableBody = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ gap: 4 }}>{children}</View>;
};
export const ViTableRow = ({
  backgroundColor,
  children,
}: {
  backgroundColor?: string;
  children: React.ReactNode;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor,
        borderRadius: 8,
        paddingVertical: 8,
      }}
    >
      {children}
    </View>
  );
};
export const ViTableCell = ({
  flex = 1,
  children,
}: {
  flex?: number;
  children: React.ReactNode;
}) => {
  return <View style={{ flex }}>{children}</View>;
};
