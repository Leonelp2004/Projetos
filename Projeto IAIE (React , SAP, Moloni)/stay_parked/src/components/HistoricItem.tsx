import { LogIn, LogOut } from 'lucide-react';

export type HistoricItemType = {
    id: number;
    type: string;
    plate: string;
    date: Date;
}

function formatRelativeDate(date: Date): string {
    const now = new Date();
    const dateWithAddedHour = new Date(date);
    dateWithAddedHour.setHours(dateWithAddedHour.getHours());
    const diffInSeconds = Math.floor((now.getTime() - dateWithAddedHour.getTime()) / 1000);

    const units: { [key: string]: number } = {
        ano: 60 * 60 * 24 * 365,
        mês: 60 * 60 * 24 * 30,
        dia: 60 * 60 * 24,
        hora: 60 * 60,
        minuto: 60,
        segundo: 1
    };

    
    for (const unit in units) {
        const unitValue = units[unit];
        if (diffInSeconds >= unitValue) {
            const count = Math.floor(diffInSeconds / unitValue);
            return `Há ${count} ${unit}${count > 1 ? 's' : ''} atrás`;
        }
    }
    
    return 'Agora mesmo';
}

function HistoricItem({ type, plate, date }: HistoricItemType) {
	return (
        <div className="flex w-full h-full">
            <div className="h-full aspect-square pt-2 pb-2 pr-2 md:pt-4 md:pb-4 md:pr-4 xl:pt-2 xl:pb-2 xl:pr-2">
                <div className="flex justify-center items-center h-full aspect-square rounded-lg md:rounded-2xl xl:rounded-xl bg-green">
                    {type === 'entry' ? 
                        <LogIn className="text-jet w-8 h-8 md:w-16 md:h-16 xl:w-12 xl:h-12"/>
                    : type === 'exit' ? 
                        <LogOut className="text-jet w-8 h-8 md:w-16 md:h-16 xl:w-12 xl:h-12"/>
                    : null
                    }
                </div>
            </div>
            <div className="flex flex-col justify-center w-full h-full space-y-1 md:space-y-0.5 xl:space-y-0">
                <div className='w-full text-jet text-lg md:text-3xl xl:text-2xl font-light leading-none'>
                    {type === 'entry' ? 
                        "Entrada"
                    : type === 'exit' ? 
                        "Saída"
                    : ""
                    }
                </div>
                <div className='w-full text-jet text-xl md:text-4xl xl:text-3xl font-semibold leading-none'>{plate}</div>
                <div className='w-full text-green text-base md:text-3xl xl:text-xl font-normal leading-none'>
                    {formatRelativeDate(new Date(date))}
                </div>
            </div>
        </div>
	);
}

export default HistoricItem;