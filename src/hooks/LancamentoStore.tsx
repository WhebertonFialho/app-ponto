import React, { useState, useCallback, useEffect } from 'react';

import { useMyLoading } from '@contexts/MyLoadingProvider';
import { LancamentoDTO } from '@DTOs/LancamentoDTO';
import { useLancamentoDAO } from '@DAOs/LancamentoDAO';

export function useLancamentoStore() {
  const { showMyLoading, hideMyLoading } = useMyLoading();
  const [ lancamentos, setLancamentos ] = useState<LancamentoDTO[]>([]);
  const [ dataAtual, setDataAtual ] = useState(() => new Date().toLocaleDateString());

  const DAO = useLancamentoDAO();

  const buscarLancamento = useCallback(
    async (dataSelecionada?: string) => {
      showMyLoading();

      const data = dataSelecionada || dataAtual;
      const list = await DAO.GetByData(data);
      setLancamentos(list ?? []);

      hideMyLoading();
    },
    [dataAtual]
  );

  const inserir = useCallback(
    async (dto: LancamentoDTO) => {
      showMyLoading();
      
      const isOK = await DAO.Insert(dto);
      if (isOK) await 
        buscarLancamento();
      
      hideMyLoading();
    },
    [buscarLancamento]
  );

  const alterar = useCallback(
    async (dto: LancamentoDTO) => {
      showMyLoading();
      
      const isOK = await DAO.Update(dto);
      if (isOK) await 
        buscarLancamento();
      
      hideMyLoading();
    },
    [buscarLancamento]
  );

  const deletar = useCallback(async (codigo: number) => {
    showMyLoading();

    const isOK = await DAO.Delete(codigo);
    if (isOK) 
      await buscarLancamento();

    hideMyLoading();
  }, [ buscarLancamento ]);

  const selecionaData = (data : string) => {
    setDataAtual(data)
  }

  useEffect(() => {
    buscarLancamento();
  }, [buscarLancamento]);

  return {
    lancamentos,
    selecionaData,
    inserir,
    alterar,
    deletar
  };
}
