import React from "react";
import { Text, View } from "react-native";

interface FormattedTextProps {
  content: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content }) => {
  const parseLine = (line: string, index: number) => {
    const bulletRegex = /^(Step\s\d+:|-)\s+(.*)/i;
    const bulletMatch = line.match(bulletRegex);
    const text = bulletMatch ? bulletMatch[2] : line;

    const parts = text.split(/(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*)/g);

    return (
      <View key={index} className="flex-row mb-1">
        {bulletMatch && <Text className="mr-2 font-rubik">•</Text>}
        <Text className="flex-1 font-rubik text-black">
          {parts.map((part, i) => {
            if (part.startsWith("***") && part.endsWith("***")) {
              return (
                <Text key={i} className="font-rubik-bolditalic">
                  {part.slice(3, -3)}
                </Text>
              );
            } else if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <Text key={i} className="font-rubik-bold">
                  {part.slice(2, -2)}
                </Text>
              );
            } else if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <Text key={i} className="font-rubik-italic">
                  {part.slice(1, -1)}
                </Text>
              );
            } else {
              return (
                <Text key={i} className="font-rubik">
                  {part}
                </Text>
              );
            }
          })}
        </Text>
      </View>
    );
  };

  return <View>{content.split("\n").map(parseLine)}</View>;
};

export default FormattedText;
