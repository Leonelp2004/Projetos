import { useState, useEffect } from 'react';
import DriversItem, { DriversItemType } from "@/components/DriversItem";
import TokenService from "@/services/tokenService";
import axios from "axios";
import { CirclePlus, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

function DriversPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [driversItems, setDriversItems] = useState<DriversItemType[]>([]);
    const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);
    const [name, setName] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    async function fetchDrivers() {
        setIsLoading(true);
        try {
            const accessToken = TokenService.getAccessToken();

            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const formData = new URLSearchParams();
            formData.append("company_id", "322440");

            const response = await axios.post(
                `/moloni/v1/suppliers/getAll/?access_token=${accessToken}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            
            if (response.status === 200) {
                const data = response.data;

                const formattedDriversItems = data.map((driverItem: any) => ({
                    id: driverItem.supplier_id,
                    name: driverItem.name,
                    number: driverItem.address,
                    phone: driverItem.contact_phone,
                }));

                setDriversItems(formattedDriversItems);
            }
        } catch (error) {
            console.error('Error occurred in fetching drivers:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addDriver() {
        try {
            const accessToken = TokenService.getAccessToken();
    
            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const numberRegex = /^a\d{6}$/;
            if (!numberRegex.test(number)) {
                throw new Error("Driver Number Invalid Format!");
            }

            const phoneRegex = /^\d{9}$/;
            if (!phoneRegex.test(phone)) {
                throw new Error("Driver Phone Invalid Format!");
            }
    
            const params = new URLSearchParams();
            params.append("company_id", "322440");
            params.append("vat", Math.floor(Math.random() * 1000000000).toString());
            params.append("number", Math.floor(Math.random() * 900).toString());
            params.append("name", name);
            params.append("language_id", "1");
            params.append("address", number);
            params.append("city", "Braga");
            params.append("country_id", "1");
            params.append("maturity_date_id", "1");
            params.append("payment_method_id", "1");
            params.append("discount", "0");
            params.append("credit_limit", "0");
            params.append("qty_copies_document", "1");
            params.append("delivery_method_id", "1");
            params.append("contact_phone", phone);

            const response = await axios.post(
                `/moloni/v1/suppliers/insert/?access_token=${accessToken}`,
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
    
            if (response.status === 200) {
                setIsAddDriverDialogOpen(false);
                setName("");
                setNumber("");
                setPhone("");
                fetchDrivers();
            } else {
                throw new Error("Error occurred while adding the driver!");
            }
        } catch (error) {
            console.error("Error occurred while adding the driver:", error);
        }
    }

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full xl:space-y-4'>
            <div className='hidden xl:block w-full h-min text-right text-green text-4xl font-bold'>Condutores</div>
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin text-green w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24" />
                </div>
            ) : driversItems.length > 0 ? (
                <div className='flex flex-col w-full flex-1 space-y-2 md:space-y-4 xl:space-y-3 md:pr-4 overflow-y-auto no-scrollbar md:scrollbar md:scrollbar-w-2 xl:scrollbar-w-1 scrollbar-thumb-green scrollbar-thumb-rounded-full'>
                    {driversItems.map(item => (
                        <div key={item.id} className='w-full h-auto xl:h-full'>
                            <DriversItem 
                                id={item.id} 
                                name={item.name} 
                                number={item.number}
                                phone={item.phone}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center w-full h-full'>
                    <TriangleAlert className="text-green w-12 h-12 md:w-24 md:h-24 xl:w-16 xl:h-16"/>
                    <div className='text-green text-xl md:text-4xl xl:text-3xl font-light'>Condutores não encontrados!</div>
                </div>
            )}
            {!isLoading && (
                <div className="flex md:justify-center w-full h-min mt-4 md:mt-8 xl:mt-0">
                    <Dialog open={isAddDriverDialogOpen} onOpenChange={setIsAddDriverDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="flex md:justify-center items-center w-full xl:w-1/4 h-min gap-2 md:gap-4 xl:gap-2 p-2 md:p-5 xl:p-2.5 rounded-lg md:rounded-xl xl:rounded-lg text-jet bg-green hover:bg-lightgreen"
                                >
                                <CirclePlus className="w-6 h-6 md:w-10 md:h-10 xl:w-6 xl:h-6" />
                                <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">Adicionar Condutor</div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[80vw] md:w-[50vw] xl:w-[25vw] rounded-xl md:rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 select-none">
                            <DialogHeader>
                                <DialogTitle className="text-lg md:text-3xl xl:text-2xl text-jet">
                                    Dados do Condutor
                                </DialogTitle>
                                <DialogDescription className="text-base md:text-xl xl:text-lg text-jet">
                                    Insira os dados do condutor.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center space-y-2 md:space-y-4 xl:space-y-3">
                                <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                                    <div className='w-max text-jet text-sm md:text-md xl:text-base font-medium'>Nome</div>
                                    <Input
                                        className='text-green'
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                                    <div className='w-max text-jet text-sm md:text-md xl:text-base font-medium'>Número</div>
                                    <Input
                                        className='text-green'
                                        type="text"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                                    <div className='w-max text-jet text-sm md:text-md xl:text-base font-medium'>Telemóvel</div>
                                    <Input
                                        className='text-green'
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col xl:flex-row justify-center items-center gap-2 md:gap-4 xl:gap-3 w-full h-min pt-2 md:pt-4 xl:pt-3">
                                    <Button
                                        className="flex items-center w-full h-min gap-2 md:gap-4 xl:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 xl:px-4 xl:py-2 border-2 md:border-4 xl:border-2 border-green rounded-md md:rounded-xl xl:rounded-lg shadow-md md:shadow-xl xl:shadow-lg transition-all duration-200 text-jet text-sm md:text-2xl xl:text-lg font-medium leading-none bg-green hover:bg-lightgreen"
                                        onClick={addDriver}
                                    >
                                        <CirclePlus className="w-6 h-6 md:w-10 md:h-10 xl:w-7 xl:h-7" />
                                        Adicionar
                                    </Button>
                                    <Button
                                        className="flex items-center w-full h-min gap-2 md:gap-4 xl:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 xl:px-4 xl:py-2 border-2 md:border-4 xl:border-2 border-jet rounded-md md:rounded-xl xl:rounded-lg shadow-md md:shadow-xl xl:shadow-lg transition-all duration-200 text-green hover:text-jet text-sm md:text-2xl xl:text-lg font-medium leading-none bg-jet hover:bg-lightgreen"
                                        onClick={() => setIsAddDriverDialogOpen(false)}
                                    >
                                        <X className="w-6 h-6 md:w-10 md:h-10 xl:w-7 xl:h-7" />
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}

export default DriversPage;