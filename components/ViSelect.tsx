import { StyleSheet, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { CaretDown, CaretUp } from "phosphor-react-native";
import { textStyles } from "@/globalStyles";

const Variants = ["primary", "secondary", "danger"] as const;
type Variant = (typeof Variants)[number];

interface ViButtonProps {
  variant?: Variant;
  enabled?: boolean;
  allowMultiple?: boolean;
  selectedValue: string;
  onValueChange: (value: any) => void;
  style?: ViewStyle;
  options: { label: string; value: any }[];
}
export function ViSelect({
  options,
  selectedValue,
  onValueChange,
  variant = "primary",
  enabled = true,
  allowMultiple = false,
  style,
}: ViButtonProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <DropDownPicker
      listMode="FLATLIST"
      open={open}
      value={selectedValue}
      items={items}
      setOpen={setOpen}
      setValue={(value) => onValueChange(value)}
      setItems={setItems}
      disabled={!enabled}
      ArrowUpIconComponent={({ style }) => <CaretUp style={style} />}
      ArrowDownIconComponent={({ style }) => <CaretDown style={style} />}
      style={[
        {
          borderRadius: 16,
          borderWidth: 1,
          paddingHorizontal: 16,
          height: 52,
        },
        outlineStyles[variant],
        style,
      ]}
      textStyle={[
        textStyles.CTA,
        variant === "primary"
          ? styles.textPrimary
          : variant === "secondary"
          ? styles.textSecondary
          : styles.textDanger,
      ]}
      labelStyle={
        (textStyles.CTA,
        variant === "primary"
          ? styles.textPrimary
          : variant === "secondary"
          ? styles.textSecondary
          : styles.textDanger)
      }
      dropDownContainerStyle={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: outlineStyles[variant].borderColor,
        overflow: "hidden",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      listItemContainerStyle={{
        borderRadius: 16,
        overflow: "hidden",
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    paddingInline: 8,
  },
  picker: {
    width: "100%",
    height: 52,
    paddingBlock: 16,
    alignItems: "center",
  },

  textPrimary: {
    color: "#21452f",
  },
  textSecondary: {
    color: "#040c15",
  },
  textDanger: {
    color: "#82181a",
  },
});

const outlineStyles = StyleSheet.create({
  primary: { borderColor: "#428a5e" },
  secondary: { borderColor: "#215dab" },
  danger: { borderColor: "#82181a" },
});
