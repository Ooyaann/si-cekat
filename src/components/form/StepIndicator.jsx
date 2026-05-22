export const StepIndicator = ({ currentStep, totalSteps = 6 }) => {
  const steps = [
    { num: 1, label: 'Data Kendaraan' },
    { num: 2, label: 'Administrasi' },
    { num: 3, label: 'Teknis Utama' },
    { num: 4, label: 'Teknis Penunjang' },
    { num: 5, label: 'Dokumentasi' },
    { num: 6, label: 'Review' }
  ];

  return (
    <div className="w-full py-4 mb-4">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full z-0"></div>
        
        {/* Progress bar fill */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200
                  ${isCompleted ? 'bg-primary border-primary text-white scale-105' : 
                    isActive ? 'bg-white border-primary text-primary scale-110 shadow-sm ring-4 ring-primary/10' : 
                    'bg-white border-neutral-300 text-neutral-400'}`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                ) : step.num}
              </div>
              
              {/* Optional labels below, hidden on mobile for space saving */}
              <span className={`hidden md:block mt-2 text-xs font-semibold absolute -bottom-6 whitespace-nowrap transition-colors duration-200
                ${isActive ? 'text-primary' : isCompleted ? 'text-neutral-700' : 'text-neutral-400'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="md:hidden mt-4 text-center">
        <span className="text-sm font-bold text-primary">
          Langkah {currentStep} dari {totalSteps}: {steps[currentStep-1].label}
        </span>
      </div>
    </div>
  );
};
