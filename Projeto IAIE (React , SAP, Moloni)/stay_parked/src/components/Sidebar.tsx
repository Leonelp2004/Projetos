import { Outlet } from 'react-router-dom';
import SidebarOption from '@/components/SidebarOption';
import logo from '@/img/logo.png';

function Sidebar() {
    const mobileOptions = [
            { icon: "House", to: '/homepage', label: 'Início' },
            { icon: "History", to: '/historic', label: 'Histórico' },
            { icon: "CarFront", to: '/vehicles', label: 'Veículos' },
            { icon: "Scan", to: '/scanner', label: 'Scanner' },
            { icon: "ShipWheel", to: '/drivers', label: 'Condutores' },
            { icon: "Users", to: '/students', label: 'Alunos' },
            { icon: "LogOut", to: '/sign-out', label: 'Sair'},
        ];

    const desktopOptions = [
            { icon: "House", to: '/homepage', label: 'Início', position: 'top' },
            { icon: "History", to: '/historic', label: 'Histórico', position: 'top' },
            { icon: "CarFront", to: '/vehicles', label: 'Veículos', position: 'top' },
            { icon: "ShipWheel", to: '/drivers', label: 'Condutores', position: 'top' },
            { icon: "Users", to: '/students', label: 'Alunos', position: 'top' },
            { icon: "LogOut", to: '/sign-out', label: 'Sair', position: 'bottom' },
        ];

    return (
        <div className='w-full h-screen bg-beige'>
            <div className='overflow-auto flex justify-center items-center xl:fixed xl:right-0 w-full xl:w-17/18 h-9/10 xl:h-full p-6 md:p-12 xl:p-6'>
                <Outlet />
            </div>

            <div className="flex xl:hidden justify-around items-center fixed bottom-0 w-full h-1/10 rounded-t-xl md:rounded-t-3xl bg-jet">
                {mobileOptions.map((option, index) => (
                    <SidebarOption key={index} to={option.to} icon={option.icon} label={option.label}/>
                ))}
            </div>

			<div className="hidden xl:flex items-center left-0 w-1/18 h-full pl-6 py-6">
                <div className='flex flex-col items-center w-full h-full p-2 rounded-lg bg-jet'>
                    <div className="flex justify-center items-center w-full aspect-square mb-2 bg-cover bg-center">
                        <div className='w-4/5 aspect-square bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url(${logo})` }}></div>
                    </div>
                    <div className='w-full h-1 mb-2 rounded-2xl bg-green'></div>
                    <div className="flex flex-col justify-between items-center w-full flex-1">
                        {['top', 'bottom'].map((position) => (
                            desktopOptions.some(option => option.position === position) && (
                                <div key={position} className={`flex flex-col items-center w-full`}>
                                    {desktopOptions.filter(option => option.position === position).map((option, index) => (
                                        <SidebarOption key={index} to={option.to} desktop={true} icon={option.icon} label={option.label}/>
                                    ))}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
