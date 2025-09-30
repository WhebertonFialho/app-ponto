import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS jornada(
      codigo INTEGER PRIMARY KEY AUTOINCREMENT,  
      hora_primeira_entrada TEXT,
      hora_primeira_saida TEXT,
      hora_segunda_entrada TEXT,
      hora_segunda_saida TEXT,
      tolerancia_desconto TEXT,
      tolerancia_acrescimo TEXT,
      domingo TEXT DEFAULT 'N',
      segunda TEXT DEFAULT 'N',
      terca TEXT DEFAULT 'N',
      quarta TEXT DEFAULT 'N',
      quinta TEXT DEFAULT 'N',
      sexta TEXT DEFAULT 'N',
      sabado TEXT DEFAULT 'N'
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lancamento(
      codigo INTEGER PRIMARY KEY AUTOINCREMENT,  
      data TEXT,
      hora TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS banco_hora(
      codigo INTEGER PRIMARY KEY AUTOINCREMENT,  
      data TEXT,
      hora_credito INTEGER DEFAULT 0,
      hora_desconto INTEGER DEFAULT 0
    );
  `);
}