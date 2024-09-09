import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { FormProvider, useForm } from 'react-hook-form';
import { Dayjs } from 'dayjs';
import { IFormInput } from './api';
import StatusHeader from './component/StatusHeader';

export default function FormWizard() {
  const methods = useForm<IFormInput>({
    defaultValues: {
      date: null,
      startTime: null,
      endTime: null,
      address: '',
      detailAddress: '',
    },
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNextStep} />;
      case 2:
        return <Step2 onNext={handleNextStep} onPrevious={handlePreviousStep} />;
      case 3:
        return <Step3 />;
      default:
        return null;
    }
  };

  // console.log(methods.watch());

  return (
    <FormProvider {...methods}>
      <StatusHeader currentStep={currentStep} onPrevious={handlePreviousStep} />
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </FormProvider>
  );
}
