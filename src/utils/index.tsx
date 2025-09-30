export function parseHHMMtoMinutos(horas : string) {
    const [hora, minuto] = horas.split(":").map(Number);
    
    return hora * 60 + minuto;
}
  
export function parseMinutosToHHMM(minutos : number) {
    if (minutos < 0)
        minutos = (minutos * (-1));
        
    const hora = Math.floor(minutos / 60);
    const minuto = minutos % 60;

    return `${hora.toString().padStart(2,'0')}:${minuto.toString().padStart(2,'0')}`;
}
  
export function diferencaMinutos(hora1 : string, hora2 : string) {

    return parseHHMMtoMinutos(hora2) - parseHHMMtoMinutos(hora1);
}

export function formatarData(dataStr: string): string {
    const partes = dataStr.split('/').map(Number);
    const dia = partes[0];
    const mes = (partes[1] || 1) - 1; 
    const ano = partes[2] || 2000;

    const data = new Date(ano, mes, dia);

    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    };

    const dataFormatada = data.toLocaleDateString('pt-BR', options);

    return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
}

export function parseDDMMYYYYtoDate(dataStr: string): Date {
    const partes = dataStr.split('/').map(Number);
    const dia = partes[0];
    const mes = (partes[1] || 1) - 1; // mês começa em 0
    const ano = partes[2] || 2000;

    return new Date(ano, mes, dia);
}

export function parseDateToDDMMYYYY(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}