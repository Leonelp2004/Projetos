import logo from '@/img/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import TokenService from '@/services/tokenService';

function LoginPage() {
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            const response = await axios.get(`/moloni/v1/grant/?grant_type=password&client_id=243769580_TESTES_API_UM&client_secret=6a0f8118375ac4ab33bc8f4f1daf651d59a0d789&username=jaquelinegoulart@hotmail.com&password=A100095!`);
            
            if (response.status == 200) {
                const { access_token, refresh_token } = response.data;

                TokenService.setAccessToken(access_token);
                TokenService.setRefreshToken(refresh_token);

                navigate('/homepage');
            }
        } catch (error) {
            console.error('Error occurred in login:', error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen min-h-screen bg-beige space-y-2 md:space-y-4 xl:space-y-3">
            <div className="w-1/2 md:w-1/3 xl:w-1/6 aspect-square bg-contain bg-no-repeat bg-center"  style={{ backgroundImage: `url(${logo})` }}></div>
            <Button
                className="flex md:justify-center items-center w-3/4 md:w-1/2 xl:w-1/4 h-min gap-2 md:gap-4 xl:gap-2 p-2 md:p-5 xl:p-2.5 rounded-lg md:rounded-xl xl:rounded-lg text-jet bg-green hover:bg-lightgreen"
                onClick={handleLogin}
            >
                <LogIn className="w-6 h-6 md:w-10 md:h-10 xl:w-6 xl:h-6" />
                <div className="text-base md:text-3xl xl:text-lg font-medium leading-none">Entrar</div>
            </Button>
        </div>
    )
}

export default LoginPage;