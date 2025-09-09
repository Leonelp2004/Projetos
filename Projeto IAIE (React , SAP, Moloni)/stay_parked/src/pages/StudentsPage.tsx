import { useState, useEffect } from 'react';
import StudentsItem, { StudentsItemType } from "@/components/StudentsItem";
import TokenService from "@/services/tokenService";
import axios from "axios";
import { CirclePlus, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

function StudentsPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [studentsItems, setStudentsItems] = useState<StudentsItemType[]>([]);
    const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
    const [name, setName] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [csrfToken, setCsrfToken] = useState<string>('');

    async function fetchStudents() {
        setIsLoading(true);

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
                const csrfToken = response.headers['x-csrf-token'];
                if (csrfToken) {
                    setCsrfToken(csrfToken);
                }

                const data = response.data.d.results;
    
                const formattedStudentsItems = data.map((studentItem: any) => {
                    const uuidMatch = studentItem.__metadata.id.match(/guid'([a-f0-9\-]+)'/);
                    const uuid = uuidMatch ? uuidMatch[1] : '';
    
                    const name = studentItem.FirstName + " " + studentItem.LastName;
                    const number = "a" + studentItem.SearchTerm1;
                    const phone = studentItem.BusinessPartnerIDByExtSystem;

                    if (!name || !number || !phone) {
                        return null;
                    }
    
                    return {
                        id: uuid,
                        name: name,
                        number: number,
                        phone: phone,
                    };
                }).filter((item: null) => item !== null);
    
                setStudentsItems(formattedStudentsItems);
            }
        } catch (error) {
            console.error('Error occurred in fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addStudent() {
        try {
            const accessToken = TokenService.getAccessToken();
    
            if (!accessToken) {
                throw new Error("Access token not found!");
            }

            const nameParts = name.trim().split(" ");
            const isValidName = nameParts.length === 2;
            if (!isValidName) {
                throw new Error("Student Name Invalid Format!");
            }

            const firstName = nameParts[0];
            const lastName = nameParts[1];

            const numberRegex = /^a\d{6}$/;
            if (!numberRegex.test(number)) {
                throw new Error("Student Number Invalid Format!");
            }

            const phoneRegex = /^\d{9}$/;
            if (!phoneRegex.test(phone)) {
                throw new Error("Student Phone Invalid Format!");
            }
    
            const cleanedNumber = number.replace(/^a/, '');

            const response = await axios.post(
                '/sap/MD_BUSINESSPARTNER_SRV/C_BusinessPartner', 
                {
                    BusinessPartner: cleanedNumber,  
                    BusinessPartnerCategory: "1", 
                    FirstName: firstName,
                    LastName: lastName,
                    FullName: name,
                    OrganizationBPName1: "Universidade do Minho",
                    GenderCodeName_Text: "Male",
                    BusinessPartnerIsBlocked: false,
                    SearchTerm1: cleanedNumber,
                    SearchTerm2: "",
                    BusinessPartnerIDByExtSystem: phone,
                    CountryName: "PT",
                    CityName: "Braga",
                    StreetName: "Rua de Braga",
                    PostalCode: "4730-597"
                },
                {
                    auth: {
                        username: "LEARN-113",
                        password: "Leonelcoelh016"
                    },
                    headers: {
                        "sap-client": "317",
                        "X-CSRF-Token": csrfToken,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            if (response.status === 201) {
                setIsAddStudentDialogOpen(false);
                setName("");
                setNumber("");
                setPhone("");
                fetchStudents();
            } else {
                throw new Error("Error occurred while adding the student!");
            }
        } catch (error) {
            console.error("Error occurred while adding the student:", error);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full xl:space-y-4'>
            <div className='hidden xl:block w-full h-min text-right text-green text-4xl font-bold'>Alunos</div>
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="animate-spin text-green w-12 h-12 md:w-32 md:h-32 xl:w-24 xl:h-24" />
                </div>
            ) : studentsItems.length > 0 ? (
                <div className='flex flex-col w-full flex-1 space-y-2 md:space-y-4 xl:space-y-3 md:pr-4 overflow-y-auto no-scrollbar md:scrollbar md:scrollbar-w-2 xl:scrollbar-w-1 scrollbar-thumb-green scrollbar-thumb-rounded-full'>
                    {studentsItems.map(item => (
                        <div key={item.id} className='w-full h-auto xl:h-full'>
                            <StudentsItem 
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
                    <div className='text-green text-xl md:text-4xl xl:text-3xl font-light'>Alunos não encontrados!</div>
                </div>
            )}
            {!isLoading && (
                <div className="flex md:justify-center w-full h-min mt-4 md:mt-8 xl:mt-0">
                    <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="flex md:justify-center items-center w-full xl:w-1/4 h-min gap-2 md:gap-4 xl:gap-2 p-2 md:p-5 xl:p-2.5 rounded-lg md:rounded-xl xl:rounded-lg text-jet bg-green hover:bg-lightgreen"
                                >
                                <CirclePlus className="w-6 h-6 md:w-10 md:h-10 xl:w-6 xl:h-6" />
                                <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">Adicionar Aluno</div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[80vw] md:w-[50vw] xl:w-[25vw] rounded-xl md:rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 select-none">
                            <DialogHeader>
                                <DialogTitle className="text-lg md:text-3xl xl:text-2xl text-jet">
                                    Dados do Aluno
                                </DialogTitle>
                                <DialogDescription className="text-base md:text-xl xl:text-lg text-jet">
                                    Insira os dados do aluno.
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
                                        onClick={addStudent}
                                    >
                                        <CirclePlus className="w-6 h-6 md:w-10 md:h-10 xl:w-7 xl:h-7" />
                                        Adicionar
                                    </Button>
                                    <Button
                                        className="flex items-center w-full h-min gap-2 md:gap-4 xl:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 xl:px-4 xl:py-2 border-2 md:border-4 xl:border-2 border-jet rounded-md md:rounded-xl xl:rounded-lg shadow-md md:shadow-xl xl:shadow-lg transition-all duration-200 text-green hover:text-jet text-sm md:text-2xl xl:text-lg font-medium leading-none bg-jet hover:bg-lightgreen"
                                        onClick={() => setIsAddStudentDialogOpen(false)}
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

export default StudentsPage;