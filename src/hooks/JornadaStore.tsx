import React, { useEffect, useState, useCallback } from 'react';

import { useMyLoading } from '@contexts/MyLoadingProvider';
import { JornadaDTO } from '@DTOs/JornadaDTO';
import { useJornadaDAO } from '@DAOs/JornadaDAO';

export function useJornadaStore() {
  const { showMyLoading, hideMyLoading } = useMyLoading();
  const [ jornada, setJornada ] = useState<JornadaDTO | null>(null);
  const DAO = useJornadaDAO();

  const buscarJornada = useCallback(async () => {
    showMyLoading();

    const data = await DAO.Get();
    setJornada(data);

    hideMyLoading();
  }, []);

  const inserir = useCallback(async (dto: JornadaDTO) => {
    showMyLoading();

    const isOK = await DAO.Insert(dto);
    if (isOK) 
      await buscarJornada();

  }, [ buscarJornada ]);

  const alterar = useCallback(async (dto: JornadaDTO) => {
    showMyLoading();
    const isOK = await DAO.Update(dto);
    if (isOK) 
      await buscarJornada();
  }, [ buscarJornada ]);

  useEffect(() => {
    buscarJornada();
  }, [ buscarJornada ]);

  return {
    jornada,
    reload: buscarJornada,
    inserir,
    alterar
  };
}
