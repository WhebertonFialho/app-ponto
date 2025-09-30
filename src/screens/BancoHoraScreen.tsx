

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { colors } from '@theme/colors';

import MyInputHour from '@components/MyInputHour';
import { useMyDatePicker } from '@contexts/MyDatePickerProvider';
import { useBancoHoraStore } from '@hooks/BancoHoraStore';
import { MyToastGravarSucesso } from '@utils/MyToast';

import { parseHHMMtoMinutos, parseMinutosToHHMM, formatarData, parseDDMMYYYYtoDate, parseDateToDDMMYYYY } from '@utils/index';

export default function BancoHoraScreen() {
    const { openMyDatePicker } = useMyDatePicker();

    const [ dataSelecionada, setDataSelecionada ] = useState<string>(new Date().toLocaleDateString('pt-BR'));
    const [ horasCredito, setHorasCredito ] = useState<string>("00:00");
    const [ horasDebito, setHorasDebito ] = useState<string>("00:00");

    const { bancoHora,  inserir, alterar, selecionaData } = useBancoHoraStore();

    const handleOnPressSalvar = () => {
        const dados = {
            data: dataSelecionada,
            hora_credito: parseHHMMtoMinutos(horasCredito),
            hora_desconto: parseHHMMtoMinutos(horasDebito)
        }

        if ((bancoHora?.codigo ?? 0) == 0)
            inserir(dados);
        else
            alterar({...dados, codigo: bancoHora?.codigo });

        MyToastGravarSucesso();
    }
    const handleOnPressDiaAnterior = () => {
        const data = parseDDMMYYYYtoDate(dataSelecionada);
        data.setDate(data.getDate() - 1);
        
        setDataSelecionada(parseDateToDDMMYYYY(data));
    }

    const handleOnPressDiaProximo = () => {
        const data = parseDDMMYYYYtoDate(dataSelecionada);
        data.setDate(data.getDate() + 1);
        
        setDataSelecionada(parseDateToDDMMYYYY(data));
    }

    const handleOnPressSelecionaDia = async  () => {
        const data = await openMyDatePicker(parseDDMMYYYYtoDate(dataSelecionada));

        setDataSelecionada(parseDateToDDMMYYYY(data));
    }

    useEffect(() => {
        setHorasCredito(parseMinutosToHHMM(bancoHora?.hora_credito ?? 0));
        setHorasDebito(parseMinutosToHHMM(bancoHora?.hora_desconto ?? 0));
    }, [ bancoHora ])
    
    useEffect(() => {
        selecionaData(dataSelecionada);
    }, [ dataSelecionada ])

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                
            <View style={styles.headerData}>
                <TouchableOpacity style={styles.btn} onPress={handleOnPressDiaAnterior}>
                    <AntDesign name="caret-left" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.data} onPress={handleOnPressSelecionaDia}>
                    {formatarData(dataSelecionada)}
                </Text>

                <TouchableOpacity style={styles.btn} onPress={handleOnPressDiaProximo}>
                    <AntDesign name="caret-right" size={24} color="white" />
                </TouchableOpacity>
            </View>
                        
                <View style={styles.row}>
                    <MyInputHour
                        label="Horas Crédito"
                        text={ horasCredito }
                        onChangeText={ setHorasCredito }
                    />
                    <MyInputHour
                        label="Horas Débito"
                        text={ horasDebito }
                        onChangeText={ setHorasDebito }
                    />
                </View>
            </View>
            <View style={styles.footerButtons}>
                <TouchableOpacity 
                    style={ styles.saveButton } 
                    onPress={ handleOnPressSalvar }
                >
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
    headerData: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // distribui espaço
        paddingVertical: 10,
    },
    data: {
        color: colors.textColor,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // faz o texto ocupar o espaço central
    },
    btn: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        padding: 15,
    },
    footerButtons: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        padding: 15,
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