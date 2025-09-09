import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon: StartIcon, inputClassName, iconClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className={`relative ${className}`}>
        {StartIcon && (
          <div className="absolute left-2 md:left-4 xl:left-3 top-1/2 transform -translate-y-1/2">
            <StartIcon className={`w-5 h-5 md:w-10 md:h-10 xl:w-7 xl:h-7 text-muted-foreground ${iconClassName}`} />
          </div>
        )}
        <input
          type={currentType}
          className={`w-full py-1.5 px-2 md:py-3 md:px-4 xl:py-2 xl:px-3 rounded-lg md:rounded-xl xl:rounded-lg text-sm md:text-xl xl:text-xl border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
            StartIcon ? 'pl-8 md:pl-16 xl:pl-12' : ''
          } ${isPasswordType ? 'pr-10' : ''} ${inputClassName}`}
          ref={ref}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute right-0 top-0 h-full px-2 py-2 md:px-4 md:py-2 xl:px-3 xl:py-2 hover:bg-transparent z-10"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4 md:w-6 md:h-6 xl:w-5 xl:h-5" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="w-4 h-4 md:w-6 md:h-6 xl:w-5 xl:h-5" aria-hidden="true" />
            )}
            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
          </button>
        )}
        {isPasswordType && (
          <style>{`
            .hide-password-toggle::-ms-reveal,
            .hide-password-toggle::-ms-clear {
              visibility: hidden;
              pointer-events: none;
              display: none;
            }
          `}</style>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };