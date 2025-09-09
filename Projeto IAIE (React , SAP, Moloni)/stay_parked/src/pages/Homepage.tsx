import { useState, useEffect } from 'react';
import axios from 'axios';
import TokenService from "@/services/tokenService";

function Homepage() {
	const [vehiclesCount, setVehiclesCount] = useState(0);
    const [driversCount, setDriversCount] = useState(0);
    const [studentsCount, setStudentsCount] = useState(0);

	async function fetchVehicles() {
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
                setVehiclesCount(response.data.length);
            }
        } catch (error) {
            console.error('Error occurred in fetching vehicles:', error);
        }
    }

	async function fetchDrivers() {
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
                setDriversCount(response.data.length);
            }
        } catch (error) {
            console.error('Error occurred in fetching drivers:', error);
        }
    }

	async function fetchStudents() {
        try {
            const accessToken = TokenService.getAccessToken();

            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const response = await axios.get(
                `/sap/MD_BUSINESSPARTNER_SRV/C_BusinessPartner?$format=json&$filter=CreatedByUser eq 'LEARN-113'&$select=FirstName,LastName,SearchTerm1,SearchTerm2,BusinessPartnerIDByExtSystem`,
                {
                    auth: {
                        username: "LEARN-113",
                        password: "Leonelcoelh016"
                    },
                    headers: {
                        "sap-client": "317",
                        "X-CSRF-Token": "fetch"
                    }            
                }
            );
            
            if (response.status === 200) {
                setStudentsCount(response.data.d.results.length);
            }
        } catch (error) {
            console.error('Error occurred in fetching students:', error);
        }
    }

	useEffect(() => {
        fetchVehicles();
        fetchDrivers();
        fetchStudents();
    }, []);

	return (
		<div className="flex w-full h-full space-x-6">
			<div className="flex flex-col w-full xl:w-3/4 h-full space-y-6">
				<div className="w-full h-1/3 xl:h-3/4 rounded-lg md:rounded-2xl xl:rounded-xl p-1.5 md:p-3 xl:p-6 bg-jet">
				<iframe 
					className="w-full h-full rounded-lg md:rounded-2xl xl:rounded-xl" 
					src="https://www.youtube.com/embed/JjrcxsniXvc"
					sandbox="allow-scripts allow-same-origin allow-presentation"
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
				</div>
				<div className="flex flex-col xl:flex-row w-full h-full xl:h-1/4 space-x-0 space-y-4 md:space-y-8 xl:space-x-6 xl:space-y-0">
					<div className="flex justify-between w-full xl:w-1/3 h-1/3 xl:h-full rounded-lg md:rounded-2xl xl:rounded-xl bg-jet px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2 xl:px-5 xl:pt-5 xl:pb-2">
						<div className="flex items-end w-min h-full text-green text-7xl md:text-9xl xl:text-8xl font-semibold leading-none">{vehiclesCount}</div>
						<div className="flex w-min text-right text-green text-3xl md:text-5xl xl:text-4xl font-normal leading-none">Veículos Registados</div>
					</div>
					<div className="flex justify-between w-full xl:w-1/3 h-1/3 xl:h-full rounded-lg md:rounded-2xl xl:rounded-xl bg-jet px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2 xl:px-5 xl:pt-5 xl:pb-2">
						<div className="flex items-end w-min h-full text-green text-7xl md:text-9xl xl:text-8xl font-semibold leading-none">{driversCount}</div>
						<div className="flex w-min text-right text-green text-3xl md:text-5xl xl:text-4xl font-normal leading-none">Condutores Registados</div>
					</div>
					<div className="flex justify-between w-full xl:w-1/3 h-1/3 xl:h-full rounded-lg md:rounded-2xl xl:rounded-xl bg-jet px-3 pt-3 pb-1 md:px-6 md:pt-6 md:pb-2 xl:px-5 xl:pt-5 xl:pb-2">
						<div className="flex items-end w-min h-full text-green text-7xl md:text-9xl xl:text-8xl font-semibold leading-none">{studentsCount}</div>
						<div className="flex w-min text-right text-green text-3xl md:text-5xl xl:text-4xl font-normal leading-none">Alunos Registados</div>
					</div>
				</div>
			</div>
			<div className="hidden xl:flex flex-col w-1/4 h-full rounded-xl bg-jet px-5 py-4 space-y-4">
				<div className="text-green text-3xl font-semibold">Funcionalidades</div>
				<div className="flex flex-col w-full flex-1 space-y-4">
					<div className="flex flex-col w-full h-min space-y-2">
						<div className="text-white text-2xl font-semibold">Página Inicial</div>
						<ul className="text-lightgreen list-inside pl-4 space-y-1">
							<li>• Vídeo</li>
							<li>• KPIs</li>
							<li>• Lista de Funcionalidades</li>
						</ul>
					</div>
					<div className="flex flex-col w-full h-min space-y-2">
						<div className="text-white text-2xl font-semibold">Histórico</div>
						<ul className="text-lightgreen list-inside pl-4 space-y-1">
							<li>• Visualização de Entradas e Saídas</li>
						</ul>
					</div>
					<div className="flex flex-col w-full h-min space-y-2">
						<div className="text-white text-2xl font-semibold"><i>Scanner</i> de Matrículas</div>
						<ul className="text-lightgreen list-inside pl-4 space-y-1">
							<li>• Dar a Entrada/Saída de Veículos</li>
						</ul>
					</div>
					<div className="flex flex-col w-full h-min space-y-2">
						<div className="text-white text-2xl font-semibold">Veículos</div>
						<ul className="text-lightgreen list-inside pl-4 space-y-1">
							<li>• Adicionar Veículo</li>
							<li>• Visualização dos Veículos</li>
						</ul>
					</div>
					<div className="flex flex-col w-full h-min space-y-2">
						<div className="text-white text-2xl font-semibold">Condutores</div>
						<ul className="text-lightgreen list-inside pl-4 space-y-1">
							<li>• Adicionar Condutor</li>
							<li>• Visualização dos Condutores</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;