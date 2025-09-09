import { useState, useEffect } from 'react';
import VehiclesItem, { VehiclesItemType } from "@/components/VehiclesItem";
import TokenService from "@/services/tokenService";
import axios from "axios";
import { Loader, CirclePlus, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

function VehiclesPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [vehiclesItems, setVehiclesItems] = useState<VehiclesItemType[]>([]);
    const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
    const [supplierId, setSupplierId] = useState<string>('');
    const [plate, setPlate] = useState<string>('');

    async function fetchVehicles() {
        setIsLoading(true);
        try {
            const accessToken = TokenService.getAccessToken();

            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const formData = new URLSearchParams();
            formData.append("company_id", "322440");
            formData.append("category_id", "8547180");

            const response = await axios.post(
                `/moloni/v1/products/getAll/?access_token=${accessToken}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;

                const formattedVehiclesItems = await Promise.all(
                    data.map(async (vehicleItem: any) => {
                        const supplierId = vehicleItem.suppliers?.[0]?.supplier_id;

                        if (supplierId) {
                            const supplierFormData = new URLSearchParams();
                            supplierFormData.append("company_id", "322440");
                            supplierFormData.append("supplier_id", supplierId);

                            const supplierResponse = await axios.post(
                                `/moloni/v1/suppliers/getOne/?access_token=${accessToken}`,
                                supplierFormData,
                                {
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                    },
                                }
                            );

                            const supplierData = supplierResponse.data;

                            return {
                                id: vehicleItem.product_id,
                                plate: vehicleItem.name,
                                name: supplierData.name,
                                number: supplierData.address,
                                phone: supplierData.contact_phone,
                            };
                        }

                        return {
                            id: vehicleItem.product_id,
                            plate: vehicleItem.name,
                            name: "",
                            number: "",
                            phone: "",
                        };
                    })
                );

                setVehiclesItems(formattedVehiclesItems);
            }
        } catch (error) {
            console.error("Error occurred in fetching vehicles:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addVehicle() {
        try {
            const accessToken = TokenService.getAccessToken();
    
            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const plateRegex = /^[A-Za-z0-9]{2}-[A-Za-z0-9]{2}-[A-Za-z0-9]{2}$/;
            if (!plateRegex.test(plate)) {
                throw new Error("Plate Invalid Format!");
            }
    
            const params = new URLSearchParams();
            params.append("company_id", "322440");
            params.append("category_id", "8547180");
            params.append("type", "1");
            params.append("name", plate);
            params.append("reference", "REF001");
            params.append("price", "9000");
            params.append("unit_id", "1");
            params.append("has_stock", "1");
            params.append("stock", "100");
            params.append("tax_id", "0");
            params.append("value", "0");
            params.append("order", "0");
            params.append("cumulative", "0");
            params.append("reference", "M" + Math.floor(Math.random() * 900).toString());
            params.append("suppliers[0][supplier_id]", supplierId);
            params.append("suppliers[0][cost_price]", "25");
            params.append("cost_price", "9000");
            params.append("property_id", "0");
            params.append("warehouse_id", "1");
            params.append("exemption_reason", "M10");

            const response = await axios.post(
                `/moloni/v1/products/insert/?access_token=${accessToken}`,
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.status === 200) {
                setIsAddVehicleDialogOpen(false);
                setSupplierId("");
                setPlate("");
                fetchVehicles();
            } else {
                throw new Error("Error occurred while adding the vehicle!");
            }
        } catch (error) {
            console.error("Error occurred while adding the vehicle:", error);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full xl:space-y-4">
            <div className="hidden xl:block w-full h-min text-right text-green text-4xl font-bold">Veículos</div>
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <Loader className="animate-spin text-green w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24" />
                </div>
            ) : vehiclesItems.length > 0 ? (
                <div className="flex flex-col w-full flex-1 space-y-2 md:space-y-4 xl:space-y-3 md:pr-4 overflow-y-auto no-scrollbar md:scrollbar md:scrollbar-w-2 xl:scrollbar-w-1 scrollbar-thumb-green scrollbar-thumb-rounded-full">
                    {vehiclesItems.map((item) => (
                        <div key={item.id} className="w-full h-auto xl:h-full">
                            <VehiclesItem
                                id={item.id}
                                plate={item.plate}
                                name={item.name}
                                number={item.number}
                                phone={item.phone}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <TriangleAlert className="text-green w-12 h-12 md:w-24 md:h-24 xl:w-16 xl:h-16" />
                    <div className="text-green text-xl md:text-4xl xl:text-3xl font-light">Veículos não encontrados!</div>
                </div>
            )}
            {!isLoading && (
                <div className="flex md:justify-center w-full h-min mt-4 md:mt-8 xl:mt-0">
                    <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
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
                                    Dados do Veículo
                                </DialogTitle>
                                <DialogDescription className="text-base md:text-xl xl:text-lg text-jet">
                                    Insira os dados do veículo.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center space-y-2 md:space-y-4 xl:space-y-3">
                                <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                                    <div className='w-max text-jet text-sm md:text-md xl:text-base font-medium'>Condutor</div>
                                    <Input
                                        className='text-green'
                                        type="text"
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                                    <div className='w-max text-jet text-sm md:text-md xl:text-base font-medium'>Matrícula</div>
                                    <Input
                                        className='text-green'
                                        type="text"
                                        value={plate}
                                        onChange={(e) => setPlate(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col xl:flex-row justify-center items-center gap-2 md:gap-4 xl:gap-3 w-full h-min pt-2 md:pt-4 xl:pt-3">
                                    <Button
                                        className="flex items-center w-full h-min gap-2 md:gap-4 xl:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 xl:px-4 xl:py-2 border-2 md:border-4 xl:border-2 border-green rounded-md md:rounded-xl xl:rounded-lg shadow-md md:shadow-xl xl:shadow-lg transition-all duration-200 text-jet text-sm md:text-2xl xl:text-lg font-medium leading-none bg-green hover:bg-lightgreen"
                                        onClick={addVehicle}
                                    >
                                        <CirclePlus className="w-6 h-6 md:w-10 md:h-10 xl:w-7 xl:h-7" />
                                        Adicionar
                                    </Button>
                                    <Button
                                        className="flex items-center w-full h-min gap-2 md:gap-4 xl:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 xl:px-4 xl:py-2 border-2 md:border-4 xl:border-2 border-jet rounded-md md:rounded-xl xl:rounded-lg shadow-md md:shadow-xl xl:shadow-lg transition-all duration-200 text-green hover:text-jet text-sm md:text-2xl xl:text-lg font-medium leading-none bg-jet hover:bg-lightgreen"
                                        onClick={() => setIsAddVehicleDialogOpen(false)}
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

export default VehiclesPage;