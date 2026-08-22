import { useState } from 'react';
import './RegistrationModal.css';

export default function RegistrationModal({ isOpen, onClose, registrationLink }) {
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content registration-modal">
        
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
          <h2 className="modal-title">SIH 2026 – Team Guidelines</h2>
          <p className="modal-subtitle">Please read the instructions carefully before proceeding.</p>
        </div>
        
        <div className="guidelines-scroll-area">
          <h3>Team Eligibility & Composition</h3>
          <ul>
            <li>All team members must belong to the same college/institute. Inter-college teams are not permitted.</li>
            <li>Each team must consist of <strong>exactly 6 members</strong>, including at least <strong>one female</strong> team member.</li>
            <li>Each team must nominate one <strong>Team Leader</strong> who will be responsible for communication, document submission, and coordination.</li>
          </ul>

          <h3>Problem Statement Selection</h3>
          <ul>
            <li>Teams may select a problem statement from any relevant theme or choose a problem statement officially published on the SIH 2026 website: <a href="https://sih.gov.in/sih2026PS" target="_blank" rel="noopener noreferrer">https://sih.gov.in/sih2026PS</a>.</li>
          </ul>

          <h3>Technical Skills</h3>
          <ul>
            <li><strong>Software Edition:</strong> Teams should have members with relevant programming or required technical skills.</li>
            <li><strong>Hardware Edition:</strong> Multidisciplinary teams are encouraged, including members from Mechanical, Electronics, Product Design, and Programming domains.</li>
          </ul>

          <h3>Consent Form – Mandatory</h3>
          <p>A Consent Form is strictly required. The Team Leader must:</p>
          <ul>
            <li>Download the Consent Form from the provided link.</li>
            <li>Save the form on their system as <code>TeamName_ConsentLetter</code>.</li>
            <li>Fill in all required details correctly without spelling mistakes.</li>
            <li>Verify the information with all team members before submission.</li>
            <li>Upload the completed Consent Form in the designated section of the registration form.</li>
          </ul>
          <p><strong>Consent Letter Format:</strong> <a href="https://docs.google.com/document/d/1vKufCdIzYzXV4G_6ScICWWg6N-kLCmrD/" target="_blank" rel="noopener noreferrer">Download Here</a></p>

          <h3>PPT Template – Mandatory Format</h3>
          <p>Teams must prepare their presentation strictly according to the provided format, structure, and instructions.</p>
          <ul>
            <li><strong>PPT Format (Google Slides):</strong> <a href="https://docs.google.com/presentation/d/1zfTdID53p_wxCmviVm_itbp7XmPOmuu1/" target="_blank" rel="noopener noreferrer">View Format</a></li>
            <li><strong>PPT Download Link:</strong> <a href="https://sih.gov.in/letters/2026/SIH2026-IDEA-Presentation-Format.pptx" target="_blank" rel="noopener noreferrer">Download Template</a></li>
          </ul>

          <h3>Document Verification & Final Submission</h3>
          <ul>
            <li>Before submitting, the Team Leader must verify all team member names, college details, contact info, problem statement, and attachments.</li>
            <li><strong>No Changes After Submission:</strong> No changes, replacements, additions, or corrections will be entertained after final submission.</li>
            <li><strong>Authentic Information:</strong> All information must be genuine. Forged or incomplete information will lead to disqualification.</li>
            <li><strong>Originality:</strong> Any form of plagiarism or unauthorized use of another team's work will result in disqualification.</li>
            <li><strong>Submission Deadline:</strong> Late submissions may not be considered.</li>
            <li><strong>File Quality:</strong> Uploaded documents must be clearly readable. Blurred or corrupted files may be rejected.</li>
          </ul>

          <div className="guidelines-note">
            <strong>Important Note:</strong> The Team Leader is advised to complete the entire form only after collecting and verifying the required information from all team members. Once the form is submitted, no changes will be entertained.
          </div>
          
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <label className="agreement-checkbox">
              <input 
                type="checkbox" 
                checked={hasAgreed} 
                onChange={(e) => setHasAgreed(e.target.checked)} 
              />
              <span>I have carefully read and agreed to all the guidelines and instructions above.</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-actions">
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              {hasAgreed ? (
                <a 
                  href={registrationLink || "https://forms.gle/ZbCWyiSGveuNrS7m9/"}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  onClick={() => {
                    // Delay close slightly so the link can open first
                    setTimeout(() => {
                      onClose();
                      setHasAgreed(false);
                    }, 100);
                  }}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Proceed to Registration
                </a>
              ) : (
                <button className="btn-primary" disabled={true}>
                  Proceed to Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
