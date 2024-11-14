// import { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import CareDetail from './CareDetail';
// import useSWR from 'swr';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetcherWithCookie } from 'api';
// import Review from './Review';
// import styled from 'styled-components';
// import { FaArrowLeft } from 'react-icons/fa6';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function CareWizard() {
//   const navigate = useNavigate();
//   const { id: reservationId } = useParams();

//   const [currentStep, setCurrentStep] = useState('care');

//   const slideVariants = {
//     initial: { x: '100%', opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//     exit: { x: '-100%', opacity: 0 },
//     transition: { type: 'spring', stiffness: 300, damping: 30 },
//   };

//   const { data: reservation, mutate } = useSWR(`${API_URL}/reservations/${reservationId}`, fetcherWithCookie);

//   // Step 변경 함수들
//   const handleJournalStep = () => {
//     setCurrentStep('journal');
//   };

//   const handleReviewStep = () => {
//     setCurrentStep('review');
//   };

//   const handleCareStep = () => {
//     setCurrentStep('care');
//   };

//   const handleBackButton = () => {
//     if (currentStep === 'care') {
//       navigate(-1);
//     } else if (currentStep === 'journal' || currentStep === 'review') {
//       handleCareStep();
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 'care':
//         return (
//           <CareDetail
//             reservation={reservation}
//             mutate={mutate}
//             handleReviewStep={handleReviewStep}
//             handleJournalStep={handleJournalStep}
//           />
//         );
//       case 'journal':
//         return <div>Journal</div>; // 실제 Journal 컴포넌트로 교체
//       case 'review':
//         return <Review review={reservation?.review} reservationId={reservation?.id} handleCareStep={handleCareStep} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <div>
//         <BackButton onClick={handleBackButton}>
//           <FaArrowLeft color="#279EFF" size="24px" />
//         </BackButton>
//       </div>

//       <motion.div
//         key={currentStep} // key를 currentStep으로 설정하여 애니메이션 트리거
//         variants={slideVariants}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//       >
//         {renderStep()}
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// const BackButton = styled.button`
//   padding: 20px;
// `;
