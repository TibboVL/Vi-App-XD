import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const globStyles = require("../globalStyles");

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
    const colors = getTagColor(label); // ✅ Fix here
    const bg = colors.bg;
    const text = colors.text;
  
    return (
      <View style={[styles.tag, { backgroundColor: bg }]}>
        <Text style={[globStyles.bodySmall, { color: text }]}>{label}</Text>
      </View>
    );
  }

  function getTagColor(tag: string): { bg: string; text: string } {
  switch (tag.toLowerCase()) {
    case 'mindfullness':
      return { bg: '#DFF3FB', text: '#5BC0EB' };
    case 'connections':
      return { bg: '#FFF2E5', text: '#FFA552' };
    case 'sports':
      return { bg: '#EBFAF1', text: '#58D68D' };
    case 'skills':
      return { bg: '#F1E7F8', text: '#A66DD4' };
      default:
      return { bg: '#e5e7eb', text: '#374151' }; 
  }
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  }
});
