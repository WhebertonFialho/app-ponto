import { useMyLoading } from '@contexts/MyLoadingProvider';

import { useSQLiteContext } from 'expo-sqlite';
import { BancoHoraDTO } from '@DTOs/BancoHoraDTO';

export const useBancoHoraDAO = () => {
    const db = useSQLiteContext();
    const { showMyLoading, hideMyLoading } = useMyLoading();

    const Insert = async (DTO: BancoHoraDTO): Promise<boolean> => {
      showMyLoading();
      try {
        const result = await db.runAsync(
          `INSERT INTO banco_hora (
            data, 
            hora_credito, 
            hora_desconto)
          VALUES (?, ?, ?);`,
          [ DTO.data, DTO.hora_credito, DTO.hora_desconto ]
        );
        return true;
      } catch (error) {
        return false;
      } finally {
        hideMyLoading(); 
      }
    };
  
    const GetByData = async (data: string): Promise<BancoHoraDTO | null> => {
      try {
        const result = await db.getFirstAsync<BancoHoraDTO>(
          `SELECT codigo, 
                  data, 
                  hora_credito,
                  hora_desconto
              FROM banco_hora
            WHERE data = ?;`,
          [data]
        );
    
        return result;
      } catch (error) {
        console.error('Erro ao buscar por data:', error);
        return null;
      } finally {
        hideMyLoading(); 
      }
    };
  
    const Update = async (DTO: BancoHoraDTO): Promise<boolean> => { 
      if (!DTO.codigo) 
        throw new Error('Código obrigatório para Alteração');
  
      try {
        await db.runAsync(
          `UPDATE banco_hora 
              SET data = ?,
                  hora_credito = ?,
                  hora_desconto = ?
            WHERE codigo = ?;`,
          [
            DTO.data,
            DTO.hora_credito,
            DTO.hora_desconto,
            DTO.codigo
          ]
        );
        return true
      } catch (error) {
        return false      
      } finally {
        hideMyLoading(); 
      }    
    };

    const GetSaldoAnterior = async (data: string): Promise<Omit<BancoHoraDTO, 'codigo' | 'data' >| null> => {
      try {
        const dataFormatada = data.split('/').reverse().join('');

        const result = await db.getFirstAsync<BancoHoraDTO>(
          `SELECT sum(hora_credito) hora_credito,
                  sum(hora_desconto) hora_desconto
              FROM banco_hora
            WHERE (substr(data, 7, 4) || substr(data, 4, 2) || substr(data, 1, 2)) < ?`,
          [dataFormatada]
        );

        return result;
      } catch (error) {
        console.error('Erro ao buscar por data:', error);
        return { hora_credito: 0, hora_desconto: 0 };
      } finally {
        hideMyLoading(); 
      }
    };

    return { Insert, GetByData, GetSaldoAnterior, Update };
  };