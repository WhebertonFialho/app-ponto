import React, { useEffect, useState, useCallback } from 'react';

import { BancoHoraDTO } from '@DTOs/BancoHoraDTO';
import { useBancoHoraDAO } from '@DAOs/BancoHoraDAO';
import { MyToastGravarErro } from '../utils/MyToast';

export function useBancoHoraStore() {
    
    const [ dataAtual, setDataAtual ] = useState(() => new Date().toLocaleDateString());
    const [ bancoHora, setBancoHora ] = useState<BancoHoraDTO | null>(null);
    const [ saldoBancoHora, setSaldoBancoHora ] = useState<Omit<BancoHoraDTO, "codigo" | "data"> | null>(null);
    
    const DAO = useBancoHoraDAO();

    const buscarBancoHora = useCallback(
        async (dataSelecionada?: string) => {
            const data = dataSelecionada || dataAtual
            const banco = await DAO.GetByData(data);
            setBancoHora(banco);

            const saldo = await DAO.GetSaldoAnterior(data);
            setSaldoBancoHora(saldo);
        }, [ dataAtual ]
    );

    const inserir = useCallback(
        async (dto: BancoHoraDTO) => {
            const isOK = await DAO.Insert(dto);
            if (isOK) 
                await buscarBancoHora();

        }, [ buscarBancoHora ]);

    const alterar = useCallback(
        async (dto: BancoHoraDTO) => {
            const isOK = await DAO.Update(dto);
            if (isOK) 
                await buscarBancoHora();

        }, [ buscarBancoHora ]);

    const selecionaData = (data : string) => {
        setDataAtual(data)
    }
        
    useEffect(() => {
        buscarBancoHora();
    }, [ buscarBancoHora ]);

    return {
        bancoHora,
        saldoBancoHora,
        selecionaData,
        inserir,
        alterar
    };
}
