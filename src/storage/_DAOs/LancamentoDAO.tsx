import { useSQLiteContext } from 'expo-sqlite';
import { LancamentoDTO } from '@DTOs/LancamentoDTO';

export const useLancamentoDAO = () => {
  const db = useSQLiteContext();

  const Insert = async (DTO: LancamentoDTO): Promise<boolean> => {
    try {
      const result = await db.runAsync(`
        INSERT INTO lancamento (data, hora) 
        VALUES (?, ?);`, 
        [ DTO.data, DTO.hora ]);
      return result.changes > 0; 
    } catch (error) {
      return false;
    }
  };

  const GetByData = async (data: string): Promise<LancamentoDTO[] | null> => {
    try {
      const result = await db.getAllAsync<LancamentoDTO>(
        `SELECT codigo, data, hora 
           FROM lancamento
          WHERE data = ? 
          ORDER BY hora ASC;`,
        [data]
      );
  
      return result;
    } catch (error) {
      console.error('Erro ao buscar por data:', error);
      return [];
    }
  };

  const Update = async (DTO: LancamentoDTO): Promise<boolean> => {
    if (!DTO.codigo) 
      throw new Error('Código obrigatório para Alteração');
   
    try {
      const result = await db.runAsync(
        `UPDATE lancamento 
            SET data = ?, 
                hora = ? 
          WHERE codigo = ?;`, 
          [DTO.data, DTO.hora, DTO.codigo]
      );
      return result.changes > 0;
    } catch {
      return false;
    }
  };

  const Delete = async (codigo: number): Promise<boolean> => {

    if (!codigo) 
      throw new Error('Código obrigatório para exclusão');

    try {
      const result = await db.runAsync(
        `DELETE FROM lancamento 
          WHERE codigo = ?;`,
        [codigo]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao excluir:', error);
      return false;
    }
  };

  return { Insert, GetByData, Update, Delete };
};
