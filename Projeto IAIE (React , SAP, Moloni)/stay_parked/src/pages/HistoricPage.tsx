import { useEffect, useState } from 'react';
import axios from "axios";
import { TriangleAlert } from 'lucide-react';
import TokenService from "@/services/tokenService";
import HistoricItem, { HistoricItemType } from "@/components/HistoricItem";

function HistoricPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [historicItems, setHistoricItems] = useState<HistoricItemType[]>([]);

    async function fetchVehiclesHistoric() {
        setIsLoading(true);
        try {
            const accessToken = TokenService.getAccessToken();

            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const formData = new URLSearchParams();
            formData.append("company_id", "322440");

            const response = await axios.post(
                `/moloni/v1/productStocks/getAll/?access_token=${accessToken}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            
            if (response.status === 200) {
                const data = response.data;

                const formattedHistoricItems = data.map((historicItem: any) => ({
                    id: historicItem.stock_movement_id,
                    type: historicItem.notes === "entry" ? "entry" : "exit",
                    plate: historicItem.product.name,
                    date: new Date(historicItem.movement_date),
                }));

                setHistoricItems(formattedHistoricItems);
            }
        } catch (error) {
            console.error('Error occurred in fetching historic:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchVehiclesHistoric();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full xl:space-y-4'>
            <div className='hidden xl:block w-full text-right text-green text-4xl font-bold'>Histórico</div>
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin text-green w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24" />
                </div>
            ) : historicItems.length > 0 ? (
                <div className='flex flex-col xl:grid xl:grid-cols-3 xl:grid-rows-8 xl:gap-x-8 xl:gap-y-4 w-full h-full space-y-2 md:space-y-4 xl:space-y-0 md:pr-4 overflow-y-auto no-scrollbar md:scrollbar md:scrollbar-w-2 xl:scrollbar-w-1 scrollbar-thumb-green scrollbar-thumb-rounded-full'>
                    {historicItems.map(item => (
                        <div key={item.id} className='w-full h-auto xl:h-full'>
                            <HistoricItem 
                                id={item.id} 
                                type={item.type} 
                                plate={item.plate} 
                                date={new Date(item.date)} 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center w-full h-full'>
                    <TriangleAlert className="text-green w-12 h-12 md:w-24 md:h-24 xl:w-16 xl:h-16"/>
                    <div className='text-green text-xl md:text-4xl xl:text-3xl font-light'>Histórico encontra-se vazio!</div>
                </div>
            )}
        </div>
    );
}

export default HistoricPage;