import React from 'react';
import '../styles/LeaveProgressBar.css';

const LeaveProgressBar = ({ facultyApprovalStatus, placementApprovalStatus, status, isPartOfPlacementTraining }) => {
  
  const steps = {
    step1: 'completed',
    step2_1: facultyApprovalStatus === 'Approved' ? 'completed' : facultyApprovalStatus === 'Rejected' ? 'rejected' : 'pending',
    step2_2: isPartOfPlacementTraining ? placementApprovalStatus === 'Approved' ? 'completed' : placementApprovalStatus === 'Rejected' ? 'rejected' : 'pending' : '',
    step3: status === 'Approved' ? 'completed' : status === 'Rejected' ? 'rejected' : 'pending',
    step4: status === 'Approved' ? 'completed' : status === 'Rejected' ? 'rejected' : 'pending'
  };

  // Helper function to determine step status icon
  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <div className="step-icon completed">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'rejected':
        return (
          <div className="step-icon rejected">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="step-icon pending">
            <div className={`step-inner ${status === 'active' ? 'active' : ''}`}></div>
          </div>
        );
    }
  };

  return (
    <div className="horizontal-progress-bar">
      {/* Step 1 */}
      <div className="step-item">
        {getStepIcon(steps.step1)}
        <div className="step-label">Submitted</div>
      </div>
      
      {isPartOfPlacementTraining &&
      <div className="step-subgroup">
        {/* Step 2.1 */}
        <div className="substep-item">
          {getStepIcon(steps.step2_1)}
          <div className="step-label">Approved by faculty</div>
        </div>
        
        {/* Step 2.2 */}
        <div className="substep-item">
          {getStepIcon(steps.step2_2)}
          <div className="step-label">Approved by placement cell</div>
        </div>
      </div>}

      {!isPartOfPlacementTraining && 
        <div className="step-item">
          {getStepIcon(steps.step2_1)}
          <div className="step-label">Approved by faculty</div>
        </div>
      }

      {/* Step 3 */}
      <div className="step-item">
        {getStepIcon(steps.step3)}
        <div className="step-label">Leave granted</div>
      </div>
      
      {/* Step 4 */}
      <div className="step-item">
        {getStepIcon(steps.step4)}
        <div className="step-label">Gate Pass generated</div>
      </div>
    </div>
  );
};

export default LeaveProgressBar;