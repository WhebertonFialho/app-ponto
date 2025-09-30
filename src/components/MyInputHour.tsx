import React, { forwardRef, useState } from "react";
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { colors } from "@theme/colors";

type MyInputHourProps = {
  label?: string;
  text?: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

const MyInputHour = forwardRef<TextInput, MyInputHourProps> (
  ({ label, text, onChangeText, ...rest }, ref) => {

    const formataHora = (valor : string) => {
      let valorNumerico = valor.replace(/^0+/, ''); 
      valorNumerico = valorNumerico.replace(/\D/g, '');
      valorNumerico = valorNumerico.slice(0, 4);
      valorNumerico = valorNumerico.padStart(4, '0');
    
      const horas = valorNumerico.slice(0, 2);
      const minutos = valorNumerico.slice(2);
    
      return `${horas}:${minutos}`;
    };

    const handleOnChange = (value: string) => {
      onChangeText(formataHora(value));
    };
    
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref ?? undefined} 
          style={styles.input}
          value={text}
          placeholderTextColor={colors.textColor}                
          onChangeText={handleOnChange}
          keyboardType="numeric"
          placeholder="00:00"
          {...rest}
        />
      </View>
    )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: { 
    fontSize: 20, 
    marginBottom: 5, 
    marginLeft: 5,
    color: colors.textColor, 
  },
  input: {
    height: 50,
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
    backgroundColor: colors.backgroundColorDark,
    fontFamily: 'DS-Digital', 
    color: colors.textColor
  }
});

export default MyInputHour;