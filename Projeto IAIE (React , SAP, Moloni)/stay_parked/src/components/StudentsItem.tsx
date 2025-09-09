export type StudentsItemType = {
    id: number;
    name: string;
    number: string;
    phone: string;
}

function StudentsItem({ name, number, phone }: StudentsItemType) {
    return (
        <div className="flex flex-col xl:flex-row w-full h-min rounded-md md:rounded-xl xl:rounded-lg bg-white p-3 md:p-6 xl:p-4 space-x-0 space-y-3 md:space-x-0 md:space-y-6 xl:space-x-0 xl:space-y-0">
            <div className="flex xl:hidden justify-between items-center w-full xl:min-w-fit xl:max-w-fit h-full">
                <div className="text-green text-2xl md:text-5xl xl:text-4xl font-semibold leading-none">{name}</div>
            </div>
            <div className="flex justify-between items-center w-full flex-1">
                <div className="hidden xl:flex text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{name}</div>
                <div className="text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{number}</div>
                <div className="text-green text-lg md:text-4xl xl:text-3xl font-semibold leading-none">{phone}</div>
            </div>
        </div>
    );
}

export default StudentsItem;