import brandLogo from 'figma:asset/aa914b18f567f6825fda46e6657ced11e5c34887.png';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#000000] flex items-center justify-center z-50">
      <div className="animate-pulse">
        <img 
          src={brandLogo} 
          alt="Screndly" 
          className="w-[99px] h-[99px] sm:w-[115px] sm:h-[115px] md:w-[132px] md:h-[132px]"
        />
      </div>
    </div>
  );
}