import * as Icons from "lucide-react";
import { NavLink, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarOptionProps {
    desktop?: boolean;
    icon: string;
    to: string;
    label: string;
}

function SidebarOption({ desktop, icon, to, label }: SidebarOptionProps) {
    const location = useLocation();
    const isActive = to ? location.pathname.startsWith(to) : false;
    const Icon = (Icons as any)[icon] || Icons.Ellipsis;

    return (
        <>
            {!desktop ? (
                to === "/scanner" ? (
                    <NavLink 
                        to={to} 
                        className={`flex flex-col justify-center items-center w-[15%] md:w-[15%] aspect-square mb-12 md:mb-16 rounded-full bg-green`}
                    >
                        <div className={`flex justify-center items-center ${isActive ? 'text-white' : 'text-jet'}`}>
                            <Icon className="w-6 h-6 md:w-12 md:h-12" />
                        </div>
                    </NavLink>
                ) : (
                    <NavLink 
                        to={to} 
                        className={`flex flex-col justify-center items-center w-[10%] m-2 md:m-4 ${isActive ? 'text-green' : 'text-white'}`}
                    >
                        <div className={`flex justify-center items-center ${isActive ? 'text-yellow' : 'text-white'}`}>
                            <Icon className="w-6 h-6 md:w-10 md:h-10" />
                        </div>
                        <div className={`mt-1 md:mt-2 text-xs md:text-2xl font-semibold ${isActive ? 'text-green' : 'text-white'}`}>
                            {label}
                        </div>
                    </NavLink>
                )
            ) : (
                <TooltipProvider delayDuration={100} skipDelayDuration={500}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NavLink 
                                to={to || ''} 
                                className={`flex justify-center items-center w-full aspect-square`}
                            >
                                <Icon className={`w-8 h-8 ${isActive ? 'text-green' : 'text-white'}`} />
                            </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="left" sideOffset={12} className="border-green border-2">
                            <h1 className="text-green text-md font-semibold">{label}</h1>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </>
    );
};

export default SidebarOption;