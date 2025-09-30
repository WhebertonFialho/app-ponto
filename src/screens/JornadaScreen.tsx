

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Pressable  } from 'react-native';
import { colors } from '@theme/colors';

import MyInputHour from '@components/MyInputHour';

import { JornadaDTO } from '@DTOs/JornadaDTO';
import { useJornadaStore } from '@hooks/JornadaStore';
import { MyToastGravarSucesso } from '@utils/MyToast';

const diasSemana = [
    { key: 'domingo', label: 'D' },
    { key: 'segunda', label: 'S' },
    { key: 'terca', label: 'T' },
    { key: 'quarta', label: 'Q' },
    { key: 'quinta', label: 'Q' },
    { key: 'sexta', label: 'S' },
    { key: 'sabado', label: 'S' },
];

export default function JornadaScreen() {
    const { jornada, inserir, alterar } = useJornadaStore()

    const [ codigo, setCodigo ] = useState<number | undefined>();
    
    const [ primeiraEntrada, setPrimeiraEntrada ] = useState<string>('00:00');
    const [ primeiraSaida, setPrimeiraSaida ] = useState<string>('00:00');

    const [ segundaEntrada, setSegundaEntrada ] = useState<string>('00:00');
    const [ segundaSaida, setSegundaSaida ] = useState<string>('00:00');

    const [ toleranciaAcrescimo, setToleranciaAcrescimo ] = useState<string>('00:00');
    const [ toleranciaDesconto, setToleranciaDesconto ] = useState<string>('00:00');
    const [selecionados, setSelecionados] = useState<{ [key: string]: boolean }>({});

    const toggleDia = (key: string) => {
      setSelecionados(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const handleOnPressSalvar = () => {
        const dias = diasSemana.reduce((acc, dia) => {
            acc[dia.key] = selecionados[dia.key] ? 'S' : 'N';
            return acc;
        }, {} as Record<string, string>);
        
        const dados : JornadaDTO  = {
            hora_primeira_entrada: primeiraEntrada,
            hora_primeira_saida: primeiraSaida,
            hora_segunda_entrada: segundaEntrada,
            hora_segunda_saida: segundaSaida,
            tolerancia_acrescimo: toleranciaAcrescimo,
            tolerancia_desconto: toleranciaDesconto,
            ...dias
        }

        if(!codigo) 
            inserir({ ...dados });
        else 
            alterar({ codigo: codigo, ...dados});
        
        MyToastGravarSucesso();
    }

    useEffect(() => {
        if (!jornada)
            return;

        setCodigo(jornada.codigo);
        setPrimeiraEntrada(jornada.hora_primeira_entrada);
        setPrimeiraSaida(jornada.hora_primeira_saida);
        setSegundaEntrada(jornada.hora_segunda_entrada);
        setSegundaSaida(jornada.hora_segunda_saida);
        setToleranciaAcrescimo(jornada.tolerancia_acrescimo);
        setToleranciaDesconto(jornada.tolerancia_desconto);

        const diasCarregados: Record<string, boolean> = {};
        diasSemana.forEach(dia => {
          diasCarregados[dia.key] = jornada[dia.key] === 'S';
        });

        setSelecionados(diasCarregados);
    }, [jornada])

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <MyInputHour
                        label="1ª Entrada"
                        text={primeiraEntrada}
                        onChangeText={setPrimeiraEntrada}
                    />
                    <MyInputHour
                        label="1ª Saída"
                        text={primeiraSaida}
                        onChangeText={setPrimeiraSaida}
                    />
                </View>
                <View style={styles.row}>
                    <MyInputHour
                        label="2ª Entrada"
                        text={segundaEntrada}
                        onChangeText={setSegundaEntrada}
                    />
                    <MyInputHour
                        label="2ª Saída"
                        text={segundaSaida}
                        onChangeText={setSegundaSaida}
                    />
                </View>
                <View style={styles.row}>
                    <MyInputHour
                        label="Tolerância Acres."
                        text={toleranciaAcrescimo}
                        onChangeText={setToleranciaAcrescimo}
                    />
                    <MyInputHour
                        label="Tolerância Desc."
                        text={toleranciaDesconto}
                        onChangeText={setToleranciaDesconto}
                    />
                </View>
                <View style={styles.diasContainer}>
                    {diasSemana.map(dia => (
                    <Pressable
                        key={dia.key}
                        onPress={() => toggleDia(dia.key)}
                        style={[
                        styles.diaButton,
                            { backgroundColor: selecionados[dia.key] ? 'green' : '#e0e0e0' },
                        ]}
                    >
                        <Text style={{ color: selecionados[dia.key] ? 'white' : 'black' }}>
                            {dia.label}
                        </Text>
                    </Pressable>
                    ))}
                </View>
            </View>
    
            <View style={styles.footerButtons}>
                <TouchableOpacity style={ styles.saveButton } onPress={ handleOnPressSalvar }>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColorLigth,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      padding: 15,
    },
    diasContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      gap: 10,
    },
    diaButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerButtons: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 10,
      left: 10,
      padding: 10,
      backgroundColor: colors.backgroundColorLigth,
      justifyContent: 'space-between',
    },
    saveButton: {
      flex: 3,
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15,
    },
    saveButtonText: {
      color: 'green',
      fontSize: 18,
      fontWeight: 'bold',
    },
});