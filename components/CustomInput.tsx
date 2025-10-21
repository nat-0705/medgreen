import { CustomInputProps } from "@/type";
import cn from "clsx";
import { useState } from "react";
import { Text, TextInput, View } from 'react-native';

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default",
    containerClassName,
    numberOfLines = 2,
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={cn("w-full", containerClassName)}>
            {label && <Text className="mb-1 text-gray-700">{label}</Text>}

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#888"
                multiline={secureTextEntry ? false : numberOfLines > 1}
                numberOfLines={secureTextEntry ? 1 : numberOfLines}
                textAlignVertical="top"
                className={cn(
                    'w-full text-black px-3 py-2 rounded-md bg-gray-100',
                    isFocused && 'border border-primary'
                )}
                style={{ height: 20 * numberOfLines }}
            />
        </View>
    );
}

export default CustomInput;
