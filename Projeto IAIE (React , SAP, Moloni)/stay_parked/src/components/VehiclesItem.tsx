export type VehiclesItemType = {
    id: number;
    plate: string;
    name: string;
    number: string;
    phone: string;
}

function VehiclesItem({ plate, name, number, phone }: VehiclesItemType) {
    return (
        <div className="flex flex-col xl:flex-row w-full h-min rounded-md md:rounded-xl xl:rounded-lg bg-white p-3 md:p-6 xl:p-4 space-x-0 space-y-3 md:space-x-0 md:space-y-6 xl:space-x-4 xl:space-y-0">
            <div className="flex justify-between items-center w-full xl:min-w-fit xl:max-w-fit h-full">
                <div className="text-green text-2xl md:text-5xl xl:text-4xl font-semibold leading-none">{plate}</div>
            </div>
            <div className="hidden xl:flex w-1 max-h-full rounded-xl bg-jet"></div>
            <div className="flex justify-between items-center w-full flex-1">
                <div className="text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{name}</div>
                <div className="text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{number}</div>
                <div className="text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{phone}</div>
            </div>
        </div>
    );
}

export default VehiclesItem;