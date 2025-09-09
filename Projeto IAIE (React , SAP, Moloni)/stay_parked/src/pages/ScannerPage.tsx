import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowRightLeft, Loader, Search, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import TokenService from "@/services/tokenService";

function ScannerPage() {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ocrResult, setOcrResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleStatus, setVehicleStatus] = useState<string | null>(null);
    const [inputMode, setInputMode] = useState<'camera' | 'manual'>('camera');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1280px)');
        const handleMediaChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                navigate('/homepage');
            }
        };

        if (mediaQuery.matches) {
            navigate('/homepage');
        }

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, [navigate]);

    useEffect(() => {
        if (inputMode === 'camera') {
            const startCamera = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' },
                    });

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error('Error occurred accessing camera:', err);
                }
            };
            startCamera();
        }
    }, [inputMode]);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const image = canvasRef.current.toDataURL('image/png');

                runOCR(image);
            }
        }
    };

    const runOCR = async (image: string) => {
        const formData = new FormData();
        formData.append('base64Image', image);

        try {
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData,
                headers: {
                    'apikey': 'K84597845288957',
                },
            });
            const data = await response.json();
            const result = data.ParsedResults[0].ParsedText.trim();
            
            const formattedResult = result.replace(/([A-Za-z0-9]{2})(\d{2})([A-Za-z0-9]{2})/, '$1-$2-$3');
            
            setOcrResult(formattedResult);
        } catch (error) {
            console.error('Error occurred processing OCR:', error);
        }
    };

    const fetchVehiclesHistoric = async (plate: string) => {
        const plateRegex = /^[A-Za-z0-9]{2}-[A-Za-z0-9]{2}-[A-Za-z0-9]{2}$/;
        if (!plateRegex.test(plate)) {
            alert('Invalid Plate Format!');
            return;
        }

        setIsLoading(true);
        setVehicleStatus(null);

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

                const historicItem = data.find((item: any) => item.product.name === plate);

                if (!historicItem) {
                    setVehicleStatus("entry");
                } else {
                    const lastMovement = historicItem.notes === "entry" ? "entry" : "exit";
                    setVehicleStatus(lastMovement);
                }
            }
        } catch (error) {
            console.error('Error occurred in fetching historic:', error);
            alert('Error occurred checking vehicle status!');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleInputMode = () => {
        setInputMode(prevMode => prevMode === 'camera' ? 'manual' : 'camera');
        setOcrResult('');
        setVehicleStatus(null);
    };

    const handleVehicleStatus = async () => {
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
                const vehicles = response.data;

                const matchedVehicle = vehicles.find(
                    (vehicle: any) => vehicle.name === ocrResult
                );
    
                if (!matchedVehicle) {
                    alert("Vehicle Not Found!");
                    return;
                }
    
                const productId = matchedVehicle.product_id;
    
                const updateFormData = new URLSearchParams();
                updateFormData.append("company_id", "322440");
                updateFormData.append("product_id", productId);
                updateFormData.append("qty", "1");
                updateFormData.append("movement_date", "0");
                updateFormData.append("notes", vehicleStatus === "entry" ? "exit" : "entry");
    
                const updateResponse = await axios.post(
                    `/moloni/v1/productStocks/insert/?access_token=${accessToken}`,
                    updateFormData,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
    
                if (updateResponse.status === 200) {
                    setVehicleStatus(vehicleStatus === "entry" ? "exit" : "entry");
                } else {
                    console.error("Failed to update vehicle status.");
                }
            } else {
                console.error("Failed to fetch vehicles.");
            }
        } catch (error) {
            console.error("Error occurred updating vehicle status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center w-full h-full space-y-4 md:space-y-8'>
            {inputMode === 'camera' ? (
                <>
                    <div className='w-full md:w-5/6 aspect-video rounded-lg md:rounded-xl p-2 md:p-4 bg-jet'>
                        <video className='w-full rounded-lg md:rounded-xl' ref={videoRef} autoPlay />
                        <canvas ref={canvasRef} className='hidden' width="640" height="480" />
                    </div>
                    <Button
                        className="flex md:justify-center items-center w-full h-min gap-2 md:gap-4 p-2 md:p-4 rounded-lg md:rounded-xl text-jet bg-green hover:bg-lightgreen"
                        onClick={captureImage}
                    >
                        <Camera className="w-6 h-6 md:w-12 md:h-12"/>
                        <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">Tirar Foto</div>
                    </Button>
                </>
            ) : null}
            <Button 
                className="flex md:justify-center items-center w-full h-min gap-2 md:gap-4 p-2 md:p-4 rounded-lg md:rounded-xl text-green bg-jet"
                onClick={toggleInputMode}
            >
                <ArrowRightLeft className="w-6 h-6 md:w-12 md:h-12"/>
                <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">{inputMode === 'camera' ? 'Manual' : 'OCR'}</div>
            </Button>
            <div className='flex flex-col w-full h-min space-y-1 md:space-y-2 xl:space-y-1.5'>
                <div className='w-max text-jet text-base md:text-3xl xl:text-lg font-medium'>
                    Matrícula {inputMode === 'camera' ? '(OCR)' : '(Manual)'}
                </div>
                <div className='flex items-center space-x-2'>
                    <Input
                        className='text-green flex-grow'
                        type="text"
                        placeholder='(XX-XX-XX)'
                        value={ocrResult}
                        onChange={(e) => setOcrResult(e.target.value.toUpperCase())}
                    />
                    <Button 
                        className="px-2 py-1 md:px-3 md:py-6 bg-green hover:bg-lightgreen"
                        onClick={() => fetchVehiclesHistoric(ocrResult)}
                        disabled={!ocrResult}
                    >
                        <Search className="w-6 h-6 md:w-8 md:h-8" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className='flex justify-center items-center w-full h-min'>
                    <Loader className="w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24 text-green animate-spin" />
                </div>
            ) : (
                vehicleStatus && (
                    <Button
                        className="flex md:justify-center items-center w-full h-min gap-2 md:gap-4 p-2 md:p-4 rounded-lg md:rounded-xl text-jet bg-green hover:bg-lightgreen"
                        onClick={handleVehicleStatus}
                    >
                        {vehicleStatus === "entry" ? (
                            <LogOut className="w-6 h-6 md:w-12 md:h-12" />
                        ) : vehicleStatus === "exit" ? (
                            <LogIn className="w-6 h-6 md:w-12 md:h-12" />
                        ) : null}
                        <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">
                            {vehicleStatus === "entry" ? 'Sair' : vehicleStatus === "exit" ? 'Entrar' : ''}
                        </div>
                    </Button>
                )
            )}
        </div>
    );
}

export default ScannerPage;