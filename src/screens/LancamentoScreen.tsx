import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Feather, AntDesign } from "@expo/vector-icons";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import MyInputHour from '@components/MyInputHour';
import MyAddButton from '@components/MyAddButton';

import { useLancamentoStore } from '@hooks/LancamentoStore';
import { useJornadaStore } from  '@hooks/JornadaStore';
import { useBancoHoraStore } from '@hooks/BancoHoraStore';

import { LancamentoDTO } from '@DTOs/LancamentoDTO';
import { MyToastGravarSucesso, MyToastInformacao } from '@utils/MyToast';
import { useMyMessage } from '@contexts/MyMessageProvider';
import { parseHHMMtoMinutos, diferencaMinutos, parseMinutosToHHMM, formatarData, parseDDMMYYYYtoDate, parseDateToDDMMYYYY } from '@utils/index';
import { useMyDatePicker } from '@contexts/MyDatePickerProvider';

type Batidas = LancamentoDTO & {
  desativado: boolean
}

export default function LancamentoScreen() {

  const inputRefs = useRef<Array<React.RefObject<TextInput>>>([]);
  const { showMyMessage } = useMyMessage();
  const { openMyDatePicker } = useMyDatePicker();

  const { jornada } = useJornadaStore();
  const { lancamentos, inserir : inserirLancamento, alterar : alterarLancamento, deletar, selecionaData : selecionaDataLancamento } = useLancamentoStore();
  const { bancoHora, saldoBancoHora, inserir: inserirBancoHora, alterar : alterarBancoHora, selecionaData : selecionaDataBancoHora } = useBancoHoraStore();

  const [ dataSelecionada, setDataSelecionada ] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [ inputLancamentos, setInputLancamentos ] = useState<Batidas[]>([]);
  const [ horaBKP, setHoraBKP ] = useState<string>('');

  const [ horasTrabalhada, setHorasTrabalhada ] = useState<string>("00:00");

  const [ horasExtras, setHorasExtras ] = useState<number>(0);
  const [ horasFaltas, setHorasFaltas ] = useState<number>(0);

  const corSaldoDia = () => {
    if (horasExtras == 0 && horasFaltas == 0)
      return colors.textColor;
    
    return horasExtras > horasFaltas ? 'green' :  'red';
  }

  const saldoDia = () => {
    if (horasExtras == 0 && horasFaltas == 0)
      return '00:00';

    return parseMinutosToHHMM(horasExtras > horasFaltas ? horasExtras : horasFaltas)
  }

  const corBancoHoras = () => {
    const saldoAnterior = (saldoBancoHora?.hora_credito ?? 0) - (saldoBancoHora?.hora_desconto ?? 0);
    const saldoDia = (horasExtras - horasFaltas)
    const saldo = (saldoAnterior + saldoDia)
    if (saldo == 0)
      return colors.textColor;
  
    return (saldo > 0 ? 'green' :  'red');
  }

  const bancoHoras = () => {
    const saldoAnterior = (saldoBancoHora?.hora_credito ?? 0) - (saldoBancoHora?.hora_desconto ?? 0);
    const saldoDia = (horasExtras - horasFaltas)
    return parseMinutosToHHMM(saldoAnterior + saldoDia)
  }

  const verificaInputEmEdicao = (index : number) => {
    const indexEmEdicao = inputLancamentos.findIndex(x => x.desativado === false);
   
    if (indexEmEdicao >= 0){
      if (indexEmEdicao !== index) {
        MyToastInformacao('Lançamento em edição, verifique.'); 

        return true;
      }
    }

    return false;
  }

  function calcularHoras() {
    setHorasExtras(0);
    setHorasFaltas(0);

    const toleranciaAcrescimo = parseHHMMtoMinutos(jornada?.tolerancia_acrescimo || '00:00');
    const toleranciaDesconto = parseHHMMtoMinutos(jornada?.tolerancia_desconto || '00:00');
    const pares = [];

    for (let i = 0; i < lancamentos.length; i += 2) {
      if (lancamentos[i + 1]) {
        pares.push({
          entrada: lancamentos[i].hora,
          saida: lancamentos[i + 1].hora
        });
      }
    }

    let minutosTrabalhados = 0;
    pares.forEach(p => {
      minutosTrabalhados += diferencaMinutos(p.entrada, p.saida);
    });

    if (lancamentos.length > 0) {
      const jornadaPrevista =
        diferencaMinutos(jornada?.hora_primeira_entrada || '00:00', jornada?.hora_primeira_saida || '00:00') +
        diferencaMinutos(jornada?.hora_segunda_entrada || '00:00', jornada?.hora_segunda_saida || '00:00');

      let extras = 0;
      let faltas = 0;

      if (minutosTrabalhados > jornadaPrevista + toleranciaAcrescimo) 
        extras = minutosTrabalhados - jornadaPrevista;
      else if (minutosTrabalhados < jornadaPrevista - toleranciaDesconto) 
        faltas = jornadaPrevista - minutosTrabalhados;

      setHorasTrabalhada(parseMinutosToHHMM(minutosTrabalhados));
      
      setHorasExtras(extras);
      setHorasFaltas(faltas);

      const dados = {
        data: dataSelecionada,
        hora_credito: extras,
        hora_desconto: faltas,
      } 

      if((bancoHora?.codigo ?? 0) === 0)
        inserirBancoHora(dados);
      else
        alterarBancoHora({ ...dados, codigo: bancoHora?.codigo })
    }
  }

  const handleInputChange = (index: number, value: string) => {
    let dados = [...inputLancamentos];
    dados[index].data = dataSelecionada;
    dados[index].hora = value;
    
    setInputLancamentos(dados);
  };

  const handleOnPressNovo = () => {
    const indexEmEdicao = inputLancamentos.findIndex(x => x.desativado === false);
    if (indexEmEdicao >= 0)
      return;

    if (inputLancamentos[inputLancamentos.length - 1]?.codigo === 0)
      return;

    setInputLancamentos([
      ...inputLancamentos,
      {
        codigo: 0,
        data: dataSelecionada,
        hora: new Date().toTimeString().slice(0,5),
        desativado: false
      }
    ])
  }

  const handleOnPressBotaoVerde = async (index : number) => {
    if (verificaInputEmEdicao(index)) 
      return;
    
    if (inputLancamentos[index].desativado) {
      setHoraBKP(inputLancamentos[index].hora);

      setInputLancamentos(input =>
        input.map((item, i) =>
          i === index ? { ...item, desativado: false } : item
        )
      )
    }
    else {
      const dados = {
        data: dataSelecionada,
        hora: inputLancamentos[index].hora
      }

      if (inputLancamentos[index].codigo == 0)
        inserirLancamento({ ...dados });
      else
        alterarLancamento({ codigo: inputLancamentos[index].codigo, ...dados });

      MyToastGravarSucesso();
    }
  };

  const handleOnPressBotaoVermelho = async (index : number) => {
    if (verificaInputEmEdicao(index))
      return;

    if (inputLancamentos[index].desativado) {  
      showMyMessage(
        'Remover',
        'Deseja remover a Lançamento?',
        [
            { text: 'Não' },
            { text: 'Sim', onPress: () => deletar(inputLancamentos[index]?.codigo || 0) }
        ]
    );
    }
    else {
      if (inputLancamentos[index]?.codigo === 0) {
        setInputLancamentos(inputLancamentos => inputLancamentos.slice(0, -1));

        return;
      }

      setInputLancamentos(input =>
        input.map((item, i) =>
          i === index 
            ? { ...item, desativado: true, hora: horaBKP } 
            : item
        )
      );
    }
  };

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

  useLayoutEffect(() => {
    inputRefs.current = inputLancamentos.map(
      (_, i) => inputRefs.current[i] ?? React.createRef()
    );

    const indexEmEdicao = inputLancamentos.findIndex((x) => x.desativado === false);
    if (indexEmEdicao !== -1) {
      setTimeout(() => {
        const ref = inputRefs.current[indexEmEdicao];
        if (ref?.current) 
          ref.current.focus();
      }, 150);
    }
  }, [ inputLancamentos ]);

  useEffect(() => {
    selecionaDataLancamento(dataSelecionada);
    selecionaDataBancoHora(dataSelecionada);
  }, [ dataSelecionada ])
  
  useEffect(() => {
    setInputLancamentos(
      lancamentos.map(item => ({
        ...item,
        desativado: true
      }))
    )

    calcularHoras();
  }, [ lancamentos ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoHeader}>
          <TouchableOpacity onPress={ () => handleOnPressDiaAnterior() }>
            <AntDesign name="caret-left" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text 
              style={ styles.date } 
              onPress={ () => handleOnPressSelecionaDia() }
            >
              { formatarData(dataSelecionada) }
            </Text> 
          </View>
          <TouchableOpacity onPress={ () => handleOnPressDiaProximo() }>
            <AntDesign name="caret-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={ styles.infoRow }>
          <View style={ styles.infoItem }>
            <Text style={ styles.infoLabel }>Tempo Trab.</Text>
            <Text style={ styles.infoValue }>{ horasTrabalhada }</Text>
          </View>
          <View style={ styles.infoItem }>
            <Text style={ [styles.infoValue, { color: `${ corSaldoDia() }` }] }>{ saldoDia() }</Text>
            <Text style={ styles.infoLabel }>Saldo do Dia</Text>
          </View>
          <View style={ styles.infoItem }>
            <Text style={ [styles.infoValue, { color: `${ corBancoHoras() }` }] }>{ bancoHoras() }</Text>
            <Text style={ styles.infoLabel }>Banco Horas</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={ styles.scrollArea }
        contentContainerStyle={ styles.content }
      >
        {inputLancamentos.map((lancamento, index) => (
          <View key={index + 1} style={styles.row}>
            <MyInputHour
              ref={ inputRefs.current[index] }
              text={ lancamento.hora || '' }
              onChangeText={ (value) => handleInputChange(index, value) }
              editable={ !lancamento.desativado }
              onSubmitEditing={ () => handleOnPressBotaoVerde(index) }
              autoFocus={ !lancamento.desativado }
            />
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { borderColor: 'green' }]}
                onPress={ () => handleOnPressBotaoVerde(index) }
              >
                <Feather name={lancamento.desativado ? "edit" : "check"} size={20} color="green" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { borderColor: 'red' }]}
                onPress={ () => handleOnPressBotaoVermelho(index) }
              >
                <Feather name={lancamento.desativado ? "trash" : "x"} size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={ styles.footer }>
        <MyAddButton onPress={ handleOnPressNovo } />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundColorLigth 
  },
  header: { 
    backgroundColor: '#272626', 
    paddingVertical: 15, 
    paddingHorizontal: 20 
  },
  infoHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  date: { 
    color: colors.textColor, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
  infoItem: { 
    alignItems: 'center' 
  },
  infoLabel: { 
    color: colors.textColor, 
    fontSize: 12, 
    marginTop: 5 
  },
  infoValue: { 
    color: colors.textColor, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  scrollArea: { 
    flex: 1,
  },
  content: { 
    padding: 10, 
    alignItems: 'center',
    paddingBottom: 80 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    gap: 10, 
    marginBottom: 8
  },
  buttons: { 
    flexDirection: 'row', 
    gap: 5 
  },
  button: { 
    width: 36, 
    height: 36, 
    borderWidth: 1, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85, 
    backgroundColor: colors.backgroundColorLigth,
    justifyContent: 'center',
    alignItems: 'center',
  }
});