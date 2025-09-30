import { useSQLiteContext } from 'expo-sqlite';
import { JornadaDTO } from '@DTOs/JornadaDTO';

export const useJornadaDAO = () => {
  const db = useSQLiteContext();

  const Insert = async (DTO: JornadaDTO): Promise<boolean> => {
    try {
      await db.runAsync(
        `INSERT INTO jornada (
          hora_primeira_entrada, 
          hora_primeira_saida, 
          hora_segunda_entrada, 
          hora_segunda_saida, 
          tolerancia_desconto, 
          tolerancia_acrescimo,
          domingo,
          segunda,
          terca,
          quarta,
          quinta,
          sexta,
          sabado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          DTO.hora_primeira_entrada,
          DTO.hora_primeira_saida,
          DTO.hora_segunda_entrada,
          DTO.hora_segunda_saida,
          DTO.tolerancia_desconto,
          DTO.tolerancia_acrescimo,
          DTO.domingo,
          DTO.segunda,
          DTO.terca,
          DTO.quarta,
          DTO.quinta,
          DTO.sexta,
          DTO.sabado,
        ]
      );
      return true;
    } catch (error) {
      console.error("Erro ao inserir jornada:", error);
      return false;
    }
  };

  const Get = async (): Promise<JornadaDTO | null> => {
    try {
      const result = await db.getFirstAsync<JornadaDTO>(`SELECT * FROM jornada;`);
      return result ?? null;
    } catch (error) {
      console.error('Erro ao buscar jornada:', error);
      return null;
    }
  };

  const Update = async (DTO: JornadaDTO): Promise<boolean> => {
    if (!DTO.codigo) 
      throw new Error('Código obrigatório para Alteração');

    try {
      await db.runAsync(
        `UPDATE jornada 
            SET hora_primeira_entrada = ?,
                hora_primeira_saida = ?,
                hora_segunda_entrada = ?,
                hora_segunda_saida = ?,
                tolerancia_desconto = ?,
                tolerancia_acrescimo = ?,
                domingo = ?,
                segunda = ?,
                terca = ?,
                quarta = ?,
                quinta = ?,
                sexta = ?,
                sabado = ?
          WHERE codigo = ?;`,
        [
          DTO.hora_primeira_entrada,
          DTO.hora_primeira_saida,
          DTO.hora_segunda_entrada,
          DTO.hora_segunda_saida,
          DTO.tolerancia_desconto,
          DTO.tolerancia_acrescimo,
          DTO.domingo,
          DTO.segunda,
          DTO.terca,
          DTO.quarta,
          DTO.quinta,
          DTO.sexta,
          DTO.sabado,
          DTO.codigo,
        ]
      );
      return true;
    } catch (error) {
      console.error("Erro ao atualizar jornada:", error);
      return false;      
    }    
  };

  return { Insert, Get, Update };
};
